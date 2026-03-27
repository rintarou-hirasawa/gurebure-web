import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { GameBoardNew } from '../components/game/GameBoardNew';
import { GameMatch, GameLogEntry } from '../types/room';
import { GameState, CardInGame, Zone } from '../types/game';
import { Loader2 } from 'lucide-react';
import { useScreenOrientationLock } from '../hooks/useScreenOrientationLock';
import { useMatchPortraitNudge } from '../hooks/useMatchPortraitNudge';
import { PortraitToLandscapeOverlay } from '../components/game/PortraitToLandscapeOverlay';
import { resolveBattlePlayDestination } from '../lib/cardZoneRules';

export function GamePageNew() {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('match');
  const navigate = useNavigate();

  const [match, setMatch] = useState<GameMatch | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([]);
  const [playerNumber, setPlayerNumber] = useState<1 | 2 | null>(null);
  const [isSpectator, setIsSpectator] = useState(false);
  const [loading, setLoading] = useState(true);

  /** ポーリングが Supabase 反映前の古い game_state で上書きするのを防ぐ */
  const gameStateRef = useRef<GameState | null>(null);
  const skipRemoteGameStateRef = useRef(false);
  const mutationDepthRef = useRef(0);
  const clearSkipPollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playerId = localStorage.getItem('playerId');

  /** 早期 return の前に呼ぶこと（フックの順序を固定） */
  const gameReady = !loading && !!match && !!gameState;
  useScreenOrientationLock(gameReady);
  const portraitNudge = useMatchPortraitNudge(gameReady);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    return () => {
      if (clearSkipPollTimerRef.current) {
        clearTimeout(clearSkipPollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!matchId || !playerId) {
      navigate('/matchmaking');
      return;
    }

    loadMatch();

    const channel = supabase
      .channel(`match:${matchId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'game_matches', filter: `id=eq.${matchId}` },
        (payload) => {
          console.log('Match updated:', payload);
          loadMatch();
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      loadMatch();
    }, 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [matchId]);

  const loadMatch = async () => {
    try {
      const { data, error } = await supabase
        .from('game_matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (error) throw error;
      if (!data) {
        navigate('/matchmaking');
        return;
      }

      setMatch(data);
      setGameLog(data.game_log || []);

      const soloSameBrowser =
        data.player1_id === data.player2_id && data.player1_id === playerId;

      if (soloSameBrowser) {
        setPlayerNumber((data.active_player ?? 1) as 1 | 2);
        setIsSpectator(false);
      } else if (data.player1_id === playerId) {
        setPlayerNumber(1);
        setIsSpectator(false);
      } else if (data.player2_id === playerId) {
        setPlayerNumber(2);
        setIsSpectator(false);
      } else {
        setIsSpectator(true);
      }

      if (data.game_state && Object.keys(data.game_state).length > 0) {
        if (!skipRemoteGameStateRef.current) {
          const gs = data.game_state as GameState;
          setGameState(gs);
          gameStateRef.current = gs;
        }
      } else {
        await initializeGame(data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initializeGame = async (matchData: GameMatch) => {
    try {
      const { data: deck1Cards } = await supabase
        .from('deck_cards')
        .select('*, cards(*)')
        .eq('deck_id', matchData.player1_deck_id);

      const { data: deck2Cards } = await supabase
        .from('deck_cards')
        .select('*, cards(*)')
        .eq('deck_id', matchData.player2_deck_id);

      const createDeck = (deckCards: any[]): CardInGame[] => {
        const cards: CardInGame[] = [];
        deckCards?.forEach(dc => {
          for (let i = 0; i < dc.quantity; i++) {
            const card = dc.cards;
            cards.push({
              ...card,
              type: card.card_type,
              ability: card.effect_text,
              civilization: card.race || 'なし',
              rarity: card.rarity || 'C',
              instanceId: `${dc.card_id}_${Date.now()}_${Math.random()}`
            });
          }
        });
        return shuffle(cards);
      };

      const shuffle = (array: any[]) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      const player1Deck = createDeck(deck1Cards || []);
      const player2Deck = createDeck(deck2Cards || []);

      const initialState: GameState = {
        player1: {
          playerId: matchData.player1_id,
          deckId: matchData.player1_deck_id,
          deck: player1Deck.slice(10),
          hand: player1Deck.slice(0, 4),
          mana: [],
          battle: [],
          graveyard: [],
          shields: player1Deck.slice(4, 10)
        },
        player2: {
          playerId: matchData.player2_id,
          deckId: matchData.player2_deck_id,
          deck: player2Deck.slice(10),
          hand: player2Deck.slice(0, 4),
          mana: [],
          battle: [],
          graveyard: [],
          shields: player2Deck.slice(4, 10)
        },
        currentTurn: 1,
        activePlayer: (matchData.active_player ?? 1) as 1 | 2,
        startingPlayer: (matchData.active_player ?? 1) as 1 | 2
      };

      await supabase
        .from('game_matches')
        .update({ game_state: initialState })
        .eq('id', matchId);

      setGameState(initialState);
      gameStateRef.current = initialState;
    } catch (err) {
      console.error('Failed to initialize game:', err);
    }
  };

  const moveCard = async (
    card: CardInGame,
    fromZone: Zone,
    toZone: Zone,
    fromPlayer: 1 | 2,
    toPlayer: 1 | 2
  ) => {
    const base = gameStateRef.current;
    if (!base || isSpectator) return;

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
    const logEntry: GameLogEntry = {
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: actionText,
    };

    await addLogEntry(logEntry);
  };

  const breakShield = async (targetPlayer: 1 | 2, selectedCard?: CardInGame) => {
    const base = gameStateRef.current;
    if (!base || !match || isSpectator) return;

    const newState = { ...base };
    const targetState = targetPlayer === 1 ? newState.player1 : newState.player2;

    if (targetState.shields.length === 0) {
      newState.gameOver = true;
      newState.winner = playerNumber;
      await updateGameState(newState);

      const logEntry: GameLogEntry = {
        timestamp: new Date().toISOString(),
        player: 'システム',
        action: `プレイヤー${playerNumber}の勝利！シールドブレイク！`
      };
      await addLogEntry(logEntry);

      await supabase
        .from('game_matches')
        .update({ status: 'finished', winner: playerNumber })
        .eq('id', matchId);

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

    const attackerPlayerId = playerNumber === targetPlayer
      ? (playerNumber === 1 ? newState.player2.playerId : newState.player1.playerId)
      : (playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId);
    const defenderPlayerId = targetPlayer === 1 ? newState.player1.playerId : newState.player2.playerId;

    const attackerAction = `シールドをブレイク（残り${targetState.shields.length}枚）`;
    const defenderAction = `シールドがブレイクされ、手札に加えた`;

    const attackerLog: GameLogEntry = {
      timestamp: new Date().toISOString(),
      player: attackerPlayerId,
      action: attackerAction
    };

    const defenderLog: GameLogEntry = {
      timestamp: new Date().toISOString(),
      player: defenderPlayerId,
      action: defenderAction
    };

    await addLogEntry(attackerLog);
    await addLogEntry(defenderLog);
  };

  const updateGameState = async (newState: Partial<GameState>) => {
    if (!match || isSpectator) return;

    const base = gameStateRef.current;
    if (!base) return;

    const updated = { ...base, ...newState } as GameState;
    mutationDepthRef.current += 1;
    skipRemoteGameStateRef.current = true;
    setGameState(updated);
    gameStateRef.current = updated;

    try {
      await supabase
        .from('game_matches')
        .update({
          game_state: updated,
          updated_at: new Date().toISOString()
        })
        .eq('id', matchId);
    } finally {
      mutationDepthRef.current = Math.max(0, mutationDepthRef.current - 1);
      if (mutationDepthRef.current === 0) {
        if (clearSkipPollTimerRef.current) {
          clearTimeout(clearSkipPollTimerRef.current);
        }
        clearSkipPollTimerRef.current = setTimeout(() => {
          skipRemoteGameStateRef.current = false;
          clearSkipPollTimerRef.current = null;
        }, 320);
      }
    }
  };

  const endTurn = async () => {
    if (!gameState || !match || isSpectator) return;
    if (match.active_player !== playerNumber) return;

    const newActivePlayer = match.active_player === 1 ? 2 : 1;
    const newTurn = match.current_turn + 1;

    await supabase
      .from('game_matches')
      .update({
        active_player: newActivePlayer,
        current_turn: newTurn,
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId);

    const logEntry: GameLogEntry = {
      timestamp: new Date().toISOString(),
      player: 'システム',
      action: `ターン${newTurn}開始`,
      details: `プレイヤー${newActivePlayer}のターン`
    };

    await addLogEntry(logEntry);
  };

  const addLogEntry = async (entry: GameLogEntry) => {
    const newLog = [...gameLog, entry];
    setGameLog(newLog);

    await supabase
      .from('game_matches')
      .update({ game_log: newLog })
      .eq('id', matchId);
  };

  const handleQuitGame = async () => {
    if (!match) return;

    try {
      await supabase
        .from('game_matches')
        .update({ status: 'finished' })
        .eq('id', matchId);

      await supabase
        .from('rooms')
        .update({ status: 'lobby' })
        .eq('id', match.room_id);

      await supabase
        .from('room_participants')
        .update({ role: 'participant' })
        .eq('room_id', match.room_id);

      window.location.href = `/lobby?room=${match.room_id}`;
    } catch (err) {
      console.error('Failed to quit game:', err);
    }
  };

  const drawCard = async () => {
    const base = gameStateRef.current;
    if (!base || !match || isSpectator) return;
    if (match.active_player !== playerNumber) return;

    const newState = { ...base };
    const playerState = playerNumber === 1 ? newState.player1 : newState.player2;

    if (playerState.deck.length === 0) {
      newState.gameOver = true;
      newState.winner = playerNumber === 1 ? 2 : 1;
      await updateGameState(newState);

      const logEntry: GameLogEntry = {
        timestamp: new Date().toISOString(),
        player: 'システム',
        action: `プレイヤー${playerNumber === 1 ? 2 : 1}の勝利！デッキアウト！`
      };
      await addLogEntry(logEntry);

      await supabase
        .from('game_matches')
        .update({ status: 'finished', winner: playerNumber === 1 ? 2 : 1 })
        .eq('id', matchId);

      return;
    }

    const [card] = playerState.deck.splice(0, 1);
    playerState.hand.push(card);

    await updateGameState(newState);

    const playerIdForLog = playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId;
    const logEntry: GameLogEntry = {
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: 'カードを1枚ドロー'
    };

    await addLogEntry(logEntry);
  };

  const addToManaFromDeck = async () => {
    const base = gameStateRef.current;
    if (!base || !match || isSpectator) return;
    if (match.active_player !== playerNumber) return;

    const newState = { ...base };
    const playerState = playerNumber === 1 ? newState.player1 : newState.player2;

    if (playerState.deck.length === 0) return;

    const [card] = playerState.deck.splice(0, 1);
    playerState.mana.push(card);

    await updateGameState(newState);

    const playerIdForLog = playerNumber === 1 ? newState.player1.playerId : newState.player2.playerId;
    const logEntry: GameLogEntry = {
      timestamp: new Date().toISOString(),
      player: playerIdForLog,
      action: '山札の上からマナゾーンにカードを追加'
    };

    await addLogEntry(logEntry);
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

  if (!match || !gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--sp-bg)]">
        <div className="text-center">
          <p className="mb-4 text-xl text-[var(--sp-ink)]">ゲームが見つかりません</p>
          <button
            type="button"
            onClick={() => navigate('/matchmaking')}
            className="sp-btn sp-btn--primary rounded-lg px-6 py-3 text-base font-bold"
          >
            マッチングに戻る
          </button>
        </div>
      </div>
    );
  }

  const isMyTurn = match.active_player === playerNumber;

  return (
    <>
      <PortraitToLandscapeOverlay active={portraitNudge} />
      <GameBoardNew
        gameState={gameState}
        playerNumber={playerNumber || 1}
        isMyTurn={isMyTurn}
        isSpectator={isSpectator}
        gameLog={gameLog}
        onMoveCard={moveCard}
        onEndTurn={endTurn}
        onQuitGame={handleQuitGame}
        onUpdateGameState={updateGameState}
        onDrawCard={drawCard}
        onAddToManaFromDeck={addToManaFromDeck}
        onBreakShield={breakShield}
        onMoveCardToZone={moveCard}
      />
    </>
  );
}
