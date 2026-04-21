import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { GameBoardNew } from '../components/game/GameBoardNew';
import { GameLogEntry } from '../types/room';
import { GameState, CardInGame, Zone, DeckRevealDestination } from '../types/game';
import { Loader2 } from 'lucide-react';
import { buildInitialGameState, cardInGameFromDeckCardRows } from '../lib/initialGameState';
import { resolveBattlePlayDestination } from '../lib/cardZoneRules';

const SOLO_P1 = 'solo-player-1';
const SOLO_P2 = 'solo-player-2';

/**
 * 一人回し: ローカル状態のみ。ターン終了で activePlayer が切り替わり、盤面の「手前」が常に操作中プレイヤー。
 */
export function SoloGamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deck1Id = searchParams.get('deck1');
  const deck2Id = searchParams.get('deck2');

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gameStateRef = useRef<GameState | null>(null);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (!deck1Id || !deck2Id) {
      setError('デッキが指定されていません');
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        const [{ data: d1, error: e1 }, { data: d2, error: e2 }] = await Promise.all([
          supabase.from('deck_cards').select('*, cards(*)').eq('deck_id', deck1Id),
          supabase.from('deck_cards').select('*, cards(*)').eq('deck_id', deck2Id)
        ]);

        if (e1) throw e1;
        if (e2) throw e2;

        const pile1 = cardInGameFromDeckCardRows((d1 || []) as any);
        const pile2 = cardInGameFromDeckCardRows((d2 || []) as any);
        if (pile1.length < 10 || pile2.length < 10) {
          setError('デッキの枚数が足りません（10枚以上必要です）');
          setLoading(false);
          return;
        }

        const initial = buildInitialGameState(
          { playerId: SOLO_P1, deckId: deck1Id, deckPile: pile1 },
          { playerId: SOLO_P2, deckId: deck2Id, deckPile: pile2 },
          1
        );
        setGameState(initial);
        gameStateRef.current = initial;
        setGameLog([
          {
            timestamp: new Date().toISOString(),
            player: 'システム',
            action: '一人回しを開始',
            details: 'プレイヤー1のターン'
          }
        ]);
      } catch (err) {
        console.error(err);
        setError('デッキの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    })();
  }, [deck1Id, deck2Id]);

  const addLogEntry = (entry: GameLogEntry) => {
    setGameLog(log => [...log, entry]);
  };

  const updateGameState = async (newState: Partial<GameState>) => {
    const base = gameStateRef.current;
    if (!base) return;
    const updated = { ...base, ...newState } as GameState;
    setGameState(updated);
    gameStateRef.current = updated;
  };

  const getZoneName = (zone: Zone): string => {
    const names: Record<Zone, string> = {
      deck: '山札',
      hand: '手札',
      mana: 'マナ',
      battle: 'BZ',
      graveyard: '墓地',
      shields: 'シールド'
    };
    return names[zone] || zone;
  };

  const stripFaceDown = (c: CardInGame): CardInGame => {
    const { faceDown: _fd, ...rest } = c;
    return rest as CardInGame;
  };

  const moveCard = async (
    card: CardInGame,
    fromZone: Zone,
    toZone: Zone,
    fromPlayer: 1 | 2,
    toPlayer: 1 | 2
  ) => {
    const base = gameStateRef.current;
    if (!base) return;

    const effectiveToZone = resolveBattlePlayDestination(card, toZone);
    const castSpellInsteadOfBZ = toZone === 'battle' && effectiveToZone === 'graveyard';

    const newState = { ...base };
    const fromState = fromPlayer === 1 ? newState.player1 : newState.player2;
    const toState = toPlayer === 1 ? newState.player1 : newState.player2;

    const fromArray = fromState[fromZone];
    const cardIndex = fromArray.findIndex(c => c.instanceId === card.instanceId);
    if (cardIndex === -1) return;

    const [movedCard] = fromArray.splice(cardIndex, 1);
    toState[effectiveToZone].push(movedCard);

    await updateGameState(newState);

    const isShieldZone = fromZone === 'shields' || effectiveToZone === 'shields' || toZone === 'shields';
    const cardName = isShieldZone ? '' : card.name;
    let actionText: string;
    if (castSpellInsteadOfBZ) {
      actionText = `${card.name}を唱えた`;
    } else if (isShieldZone && fromZone === 'shields') {
      actionText = `シールドを${getZoneName(effectiveToZone)}へ移動`;
    } else if (isShieldZone && toZone === 'shields') {
      actionText = `カードを${getZoneName(fromZone)}からシールドゾーンへ移動`;
    } else {
      actionText = `${cardName}を${getZoneName(fromZone)}から${getZoneName(effectiveToZone)}へ移動`;
    }

    const playerIdForLog = fromPlayer === 1 ? newState.player1.playerId : newState.player2.playerId;
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: actionText
    });
  };

  const breakShield = async (targetPlayer: 1 | 2, selectedCard?: CardInGame) => {
    const base = gameStateRef.current;
    if (!base) return;

    const playerNumber = base.activePlayer;
    const newState = { ...base };
    const targetState = targetPlayer === 1 ? newState.player1 : newState.player2;

    if (targetState.shields.length === 0) {
      newState.gameOver = true;
      newState.winner = playerNumber;
      await updateGameState(newState);
      addLogEntry({
        timestamp: new Date().toISOString(),
        player: 'システム',
        action: `プレイヤー${playerNumber}の勝利！シールドブレイク！`
      });
      return;
    }

    let brokenShield: CardInGame;
    if (selectedCard) {
      const index = targetState.shields.findIndex(c => c.instanceId === selectedCard.instanceId);
      if (index === -1) return;
      [brokenShield] = targetState.shields.splice(index, 1);
    } else {
      const randomIndex = Math.floor(Math.random() * targetState.shields.length);
      [brokenShield] = targetState.shields.splice(randomIndex, 1);
    }

    targetState.hand.push(brokenShield);
    await updateGameState(newState);

    const attackerPlayerId =
      playerNumber === targetPlayer
        ? playerNumber === 1
          ? newState.player2.playerId
          : newState.player1.playerId
        : playerNumber === 1
          ? newState.player1.playerId
          : newState.player2.playerId;
    const defenderPlayerId = targetPlayer === 1 ? newState.player1.playerId : newState.player2.playerId;

    addLogEntry({
      timestamp: new Date().toISOString(),
      player: attackerPlayerId,
      action: `シールドをブレイク（残り${targetState.shields.length}枚）`
    });
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: defenderPlayerId,
      action: 'シールドがブレイクされ、手札に加えた'
    });
  };

  const endTurn = async () => {
    const base = gameStateRef.current;
    if (!base) return;
    const current = base.activePlayer;
    const newActive: 1 | 2 = current === 1 ? 2 : 1;
    const newTurn = base.currentTurn + 1;
    await updateGameState({
      activePlayer: newActive,
      currentTurn: newTurn
    });
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: 'システム',
      action: `ターン${newTurn}開始`,
      details: `プレイヤー${newActive}のターン`
    });
  };

  const drawCard = async () => {
    const base = gameStateRef.current;
    if (!base) return;
    const playerNumber = base.activePlayer;
    const newState = { ...base };
    const playerState = playerNumber === 1 ? newState.player1 : newState.player2;

    if (playerState.deck.length === 0) {
      newState.gameOver = true;
      newState.winner = playerNumber === 1 ? 2 : 1;
      await updateGameState(newState);
      addLogEntry({
        timestamp: new Date().toISOString(),
        player: 'システム',
        action: `プレイヤー${newState.winner}の勝利！デッキアウト！`
      });
      return;
    }

    const [card] = playerState.deck.splice(0, 1);
    playerState.hand.push(card);
    await updateGameState(newState);

    const playerIdForLog = playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId;
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: 'カードを1枚ドロー'
    });
  };

  const addToManaFromDeck = async () => {
    const base = gameStateRef.current;
    if (!base) return;
    const playerNumber = base.activePlayer;
    const newState = { ...base };
    const playerState = playerNumber === 1 ? newState.player1 : newState.player2;

    if (playerState.deck.length === 0) return;

    const [card] = playerState.deck.splice(0, 1);
    playerState.mana.push(card);
    await updateGameState(newState);

    const playerIdForLog = playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId;
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: '山札の上からマナゾーンにカードを追加'
    });
  };

  const shuffleDeck = async () => {
    const base = gameStateRef.current;
    if (!base) return;
    const playerNumber = base.activePlayer;
    const newState = { ...base };
    const ps = playerNumber === 1 ? newState.player1 : newState.player2;
    if (ps.deck.length === 0) return;
    const d = [...ps.deck];
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j], d[i]];
    }
    ps.deck = d;
    await updateGameState(newState);
    const playerIdForLog = playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId;
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: '山札をシャッフル'
    });
  };

  const revealDeckMulti = async (params: { count: number; fromTop: boolean; faceUp: boolean }) => {
    const base = gameStateRef.current;
    if (!base) return;
    const playerNumber = base.activePlayer;
    const newState = { ...base };
    const ps = playerNumber === 1 ? newState.player1 : newState.player2;
    const n = Math.min(params.count, ps.deck.length);
    if (n <= 0) return;
    let taken: CardInGame[];
    if (params.fromTop) {
      taken = ps.deck.splice(0, n);
    } else {
      taken = ps.deck.splice(-n, n);
    }
    ps.deckReveal = taken.map(c => ({ ...c, faceDown: !params.faceUp }));
    ps.deckRevealOneByOne = false;
    await updateGameState(newState);
    const playerIdForLog = playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId;
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: `山札確認: ${n}枚を${params.fromTop ? '上' : '下'}から${params.faceUp ? '表向き' : '裏向き'}で確認`
    });
  };

  const startDeckRevealOneByOne = async () => {
    const base = gameStateRef.current;
    if (!base) return;
    const playerNumber = base.activePlayer;
    const newState = { ...base };
    const ps = playerNumber === 1 ? newState.player1 : newState.player2;
    if (ps.deck.length === 0) return;
    const [c] = ps.deck.splice(0, 1);
    ps.deckReveal = [{ ...c, faceDown: false }];
    ps.deckRevealOneByOne = true;
    await updateGameState(newState);
    const playerIdForLog = playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId;
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: '山札確認: 一枚ずつ確認を開始'
    });
  };

  const moveCardsFromDeckReveal = async (cardIds: string[], destination: DeckRevealDestination) => {
    const base = gameStateRef.current;
    if (!base) return;
    const playerNumber = base.activePlayer;
    const newState = { ...base };
    const ps = playerNumber === 1 ? newState.player1 : newState.player2;
    const reveal = ps.deckReveal ?? [];
    const idSet = new Set(cardIds);
    const toMove = reveal.filter(c => idSet.has(c.instanceId));
    if (toMove.length === 0) return;

    ps.deckReveal = reveal.filter(c => !idSet.has(c.instanceId));

    for (const card of toMove) {
      const clean = stripFaceDown(card);
      if (destination === 'battle') {
        const effective = resolveBattlePlayDestination(clean, 'battle');
        if (effective === 'graveyard') {
          ps.graveyard.push(clean);
        } else {
          ps.battle.push(clean);
        }
      } else if (destination === 'mana') {
        ps.mana.push(clean);
      } else if (destination === 'graveyard') {
        ps.graveyard.push(clean);
      } else if (destination === 'shields') {
        ps.shields.push(clean);
      } else if (destination === 'deckTop') {
        ps.deck.unshift(clean);
      } else if (destination === 'deckBottom') {
        ps.deck.push(clean);
      }
    }

    if (ps.deckRevealOneByOne) {
      if ((ps.deckReveal?.length ?? 0) === 0 && ps.deck.length > 0) {
        const [next] = ps.deck.splice(0, 1);
        ps.deckReveal = [{ ...next, faceDown: false }];
      } else if ((ps.deckReveal?.length ?? 0) === 0 && ps.deck.length === 0) {
        ps.deckRevealOneByOne = false;
        ps.deckReveal = undefined;
      }
    } else if ((ps.deckReveal?.length ?? 0) === 0) {
      ps.deckReveal = undefined;
    }

    await updateGameState(newState);

    const playerIdForLog = playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId;
    const destLabel: Record<DeckRevealDestination, string> = {
      battle: 'バトルゾーン',
      mana: 'マナ',
      graveyard: '墓地',
      shields: 'シールド',
      deckTop: '山札の上',
      deckBottom: '山札の下'
    };
    addLogEntry({
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: `山札確認から${toMove.length}枚を${destLabel[destination]}へ移動`
    });
  };

  const closeDeckOperation = async () => {
    const base = gameStateRef.current;
    if (!base) return;
    const playerNumber = base.activePlayer;
    const newState = { ...base };
    const ps = playerNumber === 1 ? newState.player1 : newState.player2;
    const dr = ps.deckReveal;
    if (dr?.length) {
      for (const c of dr) {
        ps.deck.push(stripFaceDown(c));
      }
      ps.deckReveal = undefined;
    }
    ps.deckRevealOneByOne = false;
    await updateGameState(newState);
  };

  const handleQuitGame = () => {
    navigate('/battle');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--sp-bg)]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[var(--sp-brass)]" />
          <p className="text-[var(--sp-parchment)]">ゲームを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--sp-bg)]">
        <div className="text-center">
          <p className="mb-4 text-xl text-[var(--sp-ink)]">{error ?? 'ゲームを初期化できません'}</p>
          <button type="button" onClick={() => navigate('/battle/solo')} className="sp-btn sp-btn--primary rounded-lg px-6 py-3 text-base font-bold">
            一人回し設定に戻る
          </button>
        </div>
      </div>
    );
  }

  const playerNumber = gameState.activePlayer;
  const isMyTurn = true;

  return (
    <GameBoardNew
      gameState={gameState}
      playerNumber={playerNumber}
      isMyTurn={isMyTurn}
      isSpectator={false}
      gameLog={gameLog}
      soloMode
      opponentHandFaceUp
      soloFullInfo
      gameOverExitLabel="対戦メニューに戻る"
      onMoveCard={moveCard}
      onEndTurn={endTurn}
      onQuitGame={handleQuitGame}
      onUpdateGameState={updateGameState}
      onDrawCard={drawCard}
      onAddToManaFromDeck={addToManaFromDeck}
      onBreakShield={breakShield}
      onMoveCardToZone={moveCard}
      onShuffleDeck={shuffleDeck}
      onRevealDeckMulti={revealDeckMulti}
      onStartDeckRevealOneByOne={startDeckRevealOneByOne}
      onMoveCardsFromDeckReveal={moveCardsFromDeckReveal}
      onCloseDeckOperation={closeDeckOperation}
    />
  );
}
