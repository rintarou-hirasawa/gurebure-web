import { useState, useEffect, useRef, type MutableRefObject } from 'react';
import { Star, Sword, Zap, Shield, Info, Wrench, Gem, Package } from 'lucide-react';
import { GameState, CardInGame, Zone, DeckRevealDestination } from '../../types/game';
import { ZoneActionModal } from './ZoneActionModal';
import { DeckOperationModal } from './DeckOperationModal';
import { GameLogEntry } from '../../types/room';
import { CardImage } from '../CardImage';
import CardDetailModal from '../CardDetailModal';

interface GameBoardNewProps {
  gameState: GameState;
  playerNumber: 1 | 2;
  isMyTurn: boolean;
  isSpectator?: boolean;
  gameLog: GameLogEntry[];
  onMoveCard: (card: CardInGame, fromZone: Zone, toZone: Zone, fromPlayer: 1 | 2, toPlayer: 1 | 2) => void;
  onEndTurn: () => void;
  onQuitGame: () => void;
  onUpdateGameState: (newState: Partial<GameState>) => void;
  onDrawCard: () => void;
  onAddToManaFromDeck: () => void;
  onBreakShield: (targetPlayer: 1 | 2, selectedCard?: CardInGame) => void;
  onMoveCardToZone: (card: CardInGame, fromZone: Zone, toZone: Zone, fromPlayer: 1 | 2, toPlayer: 1 | 2) => void;
  onShuffleDeck: () => void;
  onRevealDeckMulti: (params: { count: number; fromTop: boolean; faceUp: boolean }) => void;
  onStartDeckRevealOneByOne: () => void;
  onMoveCardsFromDeckReveal: (cardIds: string[], destination: DeckRevealDestination) => void;
  onCloseDeckOperation: () => void | Promise<void>;
}

export function GameBoardNew({
  gameState,
  playerNumber,
  isMyTurn,
  isSpectator = false,
  gameLog,
  onMoveCard,
  onEndTurn,
  onQuitGame,
  onUpdateGameState,
  onDrawCard,
  onAddToManaFromDeck,
  onBreakShield,
  onMoveCardToZone,
  onShuffleDeck,
  onRevealDeckMulti,
  onStartDeckRevealOneByOne,
  onMoveCardsFromDeckReveal,
  onCloseDeckOperation
}: GameBoardNewProps) {
  const [selectedZone, setSelectedZone] = useState<{
    zone: Zone;
    player: 1 | 2;
  } | null>(null);

  const [selectedCard, setSelectedCard] = useState<CardInGame | null>(null);
  const [showCardViewer, setShowCardViewer] = useState(true);
  const [showMobileLog, setShowMobileLog] = useState(false);
  const [cardDetailModal, setCardDetailModal] = useState<CardInGame | null>(null);
  const [selectedBattleCard, setSelectedBattleCard] = useState<{card: CardInGame, player: 1 | 2} | null>(null);
  const [handManaMenu, setHandManaMenu] = useState<{ card: CardInGame; anchor: DOMRect } | null>(null);
  const [manaDropHover, setManaDropHover] = useState(false);
  const [battleDropHover, setBattleDropHover] = useState(false);
  const [shieldDropHover, setShieldDropHover] = useState(false);
  const [graveyardDropHover, setGraveyardDropHover] = useState(false);
  const handDraggedRef = useRef(false);
  /** 手札ドロップ直後に円形マナの click でモーダルが開くのを防ぐ */
  const suppressManaCircleClickRef = useRef(false);

  const myState = playerNumber === 1 ? gameState.player1 : gameState.player2;
  const opponentState = playerNumber === 1 ? gameState.player2 : gameState.player1;
  const opponentNumber = playerNumber === 1 ? 2 : 1;

  const getZoneActions = (zone: Zone, player: 1 | 2) => {
    if (isSpectator) return [];

    const isMyZone = player === playerNumber;
    const playerState = player === 1 ? gameState.player1 : gameState.player2;
    const actions = [];

    if (zone === 'shields') {
      if (isMyZone) {
        actions.push({
          label: 'シールドを見る',
          action: () => {},
          requiresSelection: false,
          multiSelect: false,
          viewOnly: true
        });
        actions.push({
          label: 'シールドをランダムに手札に加える',
          action: () => {
            if (playerState.shields.length === 0) return;
            const randomIndex = Math.floor(Math.random() * playerState.shields.length);
            const card = playerState.shields[randomIndex];
            onMoveCard(card, 'shields', 'hand', player, player);
          },
          requiresSelection: false,
          multiSelect: false
        });
        actions.push({
          label: 'シールドを選んで手札に加える',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => onBreakShield(player, card));
          },
          requiresSelection: true,
          multiSelect: false
        });
      } else {
        actions.push({
          label: 'シールドをブレイク',
          action: () => {
            onBreakShield(player);
          },
          requiresSelection: false,
          multiSelect: false
        });
      }
    }

    if (zone === 'hand' && isMyZone) {
      actions.push({
        label: 'BZに出す',
        action: (selected: CardInGame[]) => {
          selected.forEach(card => onMoveCard(card, 'hand', 'battle', player, player));
        },
        requiresSelection: true,
        multiSelect: true
      });
      actions.push({
        label: 'マナゾーンに置く',
        action: (selected: CardInGame[]) => {
          selected.forEach(card => onMoveCard(card, 'hand', 'mana', player, player));
        },
        requiresSelection: true,
        multiSelect: true
      });
      actions.push({
        label: 'シールドゾーンに置く',
        action: (selected: CardInGame[]) => {
          selected.forEach(card => onMoveCard(card, 'hand', 'shields', player, player));
        },
        requiresSelection: true,
        multiSelect: true
      });
      actions.push({
        label: '墓地に置く',
        action: (selected: CardInGame[]) => {
          selected.forEach(card => onMoveCard(card, 'hand', 'graveyard', player, player));
        },
        requiresSelection: true,
        multiSelect: true
      });
    }

    if (zone === 'hand' && !isMyZone) {
      actions.push({
        label: 'ランダムハンデス',
        action: () => {
          if (playerState.hand.length === 0) return;
          const randomIndex = Math.floor(Math.random() * playerState.hand.length);
          const card = playerState.hand[randomIndex];
          onMoveCard(card, 'hand', 'graveyard', player, player);
        },
        requiresSelection: false,
        multiSelect: false
      });
    }

    if (zone === 'mana') {
      actions.push({
        label: 'タップ/アンタップ',
        action: (selected: CardInGame[]) => {
          const newState = { ...gameState };
          const state = player === 1 ? newState.player1 : newState.player2;
          state.mana = state.mana.map(c =>
            selected.some(s => s.instanceId === c.instanceId)
              ? { ...c, tapped: !c.tapped }
              : c
          );
          onUpdateGameState(newState);
        },
        requiresSelection: true,
        multiSelect: true
      });
      if (isMyZone) {
        actions.push({
          label: 'BZに出す',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => onMoveCard(card, 'mana', 'battle', player, player));
          },
          requiresSelection: true,
          multiSelect: true
        });
        actions.push({
          label: '手札に戻す',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => onMoveCard(card, 'mana', 'hand', player, player));
          },
          requiresSelection: true,
          multiSelect: true
        });
        actions.push({
          label: '墓地に置く',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => onMoveCard(card, 'mana', 'graveyard', player, player));
          },
          requiresSelection: true,
          multiSelect: true
        });
      }
    }

    if (zone === 'battle') {
      actions.push({
        label: 'タップ/アンタップ',
        action: (selected: CardInGame[]) => {
          const newState = { ...gameState };
          const state = player === 1 ? newState.player1 : newState.player2;
          state.battle = state.battle.map(c =>
            selected.some(s => s.instanceId === c.instanceId)
              ? { ...c, tapped: !c.tapped }
              : c
          );
          onUpdateGameState(newState);
        },
        requiresSelection: true,
        multiSelect: true
      });
      if (isMyZone) {
        actions.push({
          label: '墓地に置く',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => onMoveCard(card, 'battle', 'graveyard', player, player));
          },
          requiresSelection: true,
          multiSelect: true
        });
        actions.push({
          label: '手札に戻す',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => onMoveCard(card, 'battle', 'hand', player, player));
          },
          requiresSelection: true,
          multiSelect: true
        });
        actions.push({
          label: 'マナゾーンに置く',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => onMoveCard(card, 'battle', 'mana', player, player));
          },
          requiresSelection: true,
          multiSelect: true
        });
        actions.push({
          label: '山札の上に置く',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => {
              const newState = { ...gameState };
              const state = player === 1 ? newState.player1 : newState.player2;
              const cardIndex = state.battle.findIndex(c => c.instanceId === card.instanceId);
              if (cardIndex !== -1) {
                const [removed] = state.battle.splice(cardIndex, 1);
                state.deck.unshift(removed);
                onUpdateGameState(newState);
              }
            });
          },
          requiresSelection: true,
          multiSelect: true
        });
        actions.push({
          label: '山札の下に置く',
          action: (selected: CardInGame[]) => {
            selected.forEach(card => {
              const newState = { ...gameState };
              const state = player === 1 ? newState.player1 : newState.player2;
              const cardIndex = state.battle.findIndex(c => c.instanceId === card.instanceId);
              if (cardIndex !== -1) {
                const [removed] = state.battle.splice(cardIndex, 1);
                state.deck.push(removed);
                onUpdateGameState(newState);
              }
            });
          },
          requiresSelection: true,
          multiSelect: true
        });
      }
    }

    if (zone === 'graveyard') {
      actions.push({
        label: '手札に戻す',
        action: (selected: CardInGame[]) => {
          selected.forEach(card => onMoveCard(card, 'graveyard', 'hand', player, player));
        },
        requiresSelection: true,
        multiSelect: true
      });
      actions.push({
        label: 'BZに出す',
        action: (selected: CardInGame[]) => {
          selected.forEach(card => onMoveCard(card, 'graveyard', 'battle', player, player));
        },
        requiresSelection: true,
        multiSelect: true
      });
    }

    return actions;
  };

  /** バトルゾーンのカード表示（デッキ制作のサムネと同じ 63:88） */
  const battleCardWrapClass =
    'relative mx-auto w-[76px] aspect-[63/88] sm:w-[88px] md:w-[96px]';
  const battleCardImgClass = 'h-full w-full rounded border object-cover';

  const ZoneBox = ({
    label,
    cards,
    zone,
    player,
    onClick,
    className = '',
    showCount = true
  }: {
    label: string;
    cards: CardInGame[];
    zone: Zone;
    player: 1 | 2;
    onClick?: () => void;
    className?: string;
    showCount?: boolean;
  }) => (
    <div
      className={`cursor-pointer rounded border border-slate-500 bg-slate-700 p-1 transition-colors hover:border-green-400 lg:border-2 lg:p-2 ${className}`}
      onClick={onClick}
    >
      <div className="text-white text-[0.6rem] lg:text-xs font-bold mb-1 truncate">{label}</div>
      <div className="bg-slate-800 rounded h-8 lg:h-16 flex items-center justify-center">
        <div className="text-white text-xs lg:text-sm font-bold">
          {showCount ? `${cards.length}枚` : ''}
        </div>
      </div>
    </div>
  );

  const ActionButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="sp-game-btn w-full touch-manipulation select-none py-1 text-[0.65rem] lg:py-2 lg:text-sm"
    >
      {label}
    </button>
  );

  /** バトルゾーン用: type / card_type から種類マーク（アイコン＋短いラベル帯） */
  const getBattleZoneTypeMark = (card: CardInGame) => {
    const raw = `${card.type ?? ''} ${card.card_type ?? ''}`;
    if (!raw.trim()) return null;

    const iconSm = 'h-2 w-2 shrink-0 sm:h-2.5 sm:w-2.5';

    if (raw.includes('呪文')) {
      return {
        icon: <Zap className={`${iconSm} text-[var(--sp-brass)]`} strokeWidth={2.5} />,
        iconBg: 'bg-sky-100',
      };
    }
    if (raw.includes('フィールド')) {
      return {
        icon: <Shield className={`${iconSm} text-emerald-800`} strokeWidth={2.5} />,
        iconBg: 'bg-emerald-100',
      };
    }
    if (raw.includes('装備')) {
      return {
        icon: <Wrench className={`${iconSm} text-green-900`} strokeWidth={2.5} />,
        iconBg: 'bg-green-100',
      };
    }
    if (raw.includes('マテリアル')) {
      return {
        icon: <Gem className={`${iconSm} text-violet-800`} strokeWidth={2.5} />,
        iconBg: 'bg-violet-100',
      };
    }
    if (raw.includes('モンスター') || raw.includes('クリーチャー')) {
      return {
        icon: <Sword className={`${iconSm} text-red-800`} strokeWidth={2.5} />,
        iconBg: 'bg-red-100',
      };
    }

    const primary = (card.type || card.card_type || '').trim();
    if (primary) {
      return {
        icon: <Package className={`${iconSm} text-slate-700`} strokeWidth={2.5} />,
        iconBg: 'bg-slate-200',
      };
    }
    return null;
  };

  const renderBattleZoneCardMarks = (card: CardInGame) => {
    const mark = getBattleZoneTypeMark(card);
    const hasTopRow = card.is_unique || mark;
    if (!hasTopRow) return null;
    return (
      <div className="pointer-events-none absolute left-0 top-0 z-[3] flex origin-top-left scale-[0.62] gap-0.5 sm:scale-[0.72]">
        {card.is_unique && (
          <div className="rounded-full bg-yellow-400 p-0.5 ring-1 ring-yellow-900/30">
            <Star className="h-2 w-2 fill-yellow-900 text-yellow-900 sm:h-2.5 sm:w-2.5" />
          </div>
        )}
        {mark && (
          <div
            className={`rounded-full p-0.5 shadow ring-1 ring-black/25 ${mark.iconBg}`}
            title={card.type || card.card_type || ''}
          >
            {mark.icon}
          </div>
        )}
      </div>
    );
  };

  const canInteractHand = !isSpectator && isMyTurn;

  const placeHandCardToZone = (card: CardInGame, toZone: Exclude<Zone, 'deck' | 'hand'>) => {
    if (!canInteractHand) return;
    onMoveCard(card, 'hand', toZone, playerNumber, playerNumber);
    setHandManaMenu(null);
  };

  useEffect(() => {
    if (!handManaMenu) return;
    const onDocDown = (e: MouseEvent) => {
      const menu = document.getElementById('hand-action-float-menu');
      if (menu?.contains(e.target as Node)) return;
      setHandManaMenu(null);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [handManaMenu]);

  const onHandDragStart = (e: React.DragEvent, card: CardInGame) => {
    if (!canInteractHand) {
      e.preventDefault();
      return;
    }
    handDraggedRef.current = true;
    e.dataTransfer.setData('application/x-bg-card', card.instanceId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onHandDragEnd = () => {
    window.setTimeout(() => {
      handDraggedRef.current = false;
    }, 0);
  };

  const onManaDragOver = (e: React.DragEvent) => {
    if (!canInteractHand) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setManaDropHover(true);
  };

  const onManaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setManaDropHover(false);
    if (!canInteractHand) return;
    const id = e.dataTransfer.getData('application/x-bg-card');
    const card = myState.hand.find((c) => c.instanceId === id);
    if (card) {
      suppressManaCircleClickRef.current = true;
      window.setTimeout(() => {
        suppressManaCircleClickRef.current = false;
      }, 250);
      placeHandCardToZone(card, 'mana');
    }
  };

  const openManaModal = (player: 1 | 2) => {
    setSelectedZone({ zone: 'mana', player });
  };

  const onBattleDragOver = (e: React.DragEvent) => {
    if (!canInteractHand) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setBattleDropHover(true);
  };

  const onBattleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setBattleDropHover(false);
    if (!canInteractHand) return;
    const id = e.dataTransfer.getData('application/x-bg-card');
    const card = myState.hand.find((c) => c.instanceId === id);
    if (card) placeHandCardToZone(card, 'battle');
  };

  const onShieldDragOver = (e: React.DragEvent) => {
    if (!canInteractHand) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setShieldDropHover(true);
  };

  const onShieldDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setShieldDropHover(false);
    if (!canInteractHand) return;
    const id = e.dataTransfer.getData('application/x-bg-card');
    const card = myState.hand.find((c) => c.instanceId === id);
    if (card) placeHandCardToZone(card, 'shields');
  };

  const onGraveyardDragOver = (e: React.DragEvent) => {
    if (!canInteractHand) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setGraveyardDropHover(true);
  };

  const onGraveyardDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setGraveyardDropHover(false);
    if (!canInteractHand) return;
    const id = e.dataTransfer.getData('application/x-bg-card');
    const card = myState.hand.find((c) => c.instanceId === id);
    if (card) placeHandCardToZone(card, 'graveyard');
  };

  /** 参考UI: 円形マナゲージ（未タップ数 / 合計）。クリックでマナ操作モーダル */
  const ManaZoneGauge = ({
    manaCards,
    droppable,
    glow,
    onCircleClick,
    suppressClickAfterDropRef,
  }: {
    manaCards: CardInGame[];
    droppable: boolean;
    glow?: boolean;
    onCircleClick?: () => void;
    suppressClickAfterDropRef?: MutableRefObject<boolean>;
  }) => {
    const untapped = manaCards.filter((c) => !c.tapped).length;
    const total = manaCards.length;
    const openable = Boolean(onCircleClick);
    return (
      <div
        role={openable ? 'button' : undefined}
        tabIndex={openable ? 0 : undefined}
        title={openable ? 'マナ操作画面を開く（クリック）' : undefined}
        onKeyDown={
          openable
            ? (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  if (!suppressClickAfterDropRef?.current) onCircleClick?.();
                }
              }
            : undefined
        }
        onClick={
          openable
            ? (ev) => {
                ev.stopPropagation();
                if (suppressClickAfterDropRef?.current) return;
                onCircleClick?.();
              }
            : undefined
        }
        className={`relative z-10 flex h-[120px] w-[120px] shrink-0 flex-col items-center justify-center rounded-full border-4 border-green-400/90 bg-gradient-to-b from-green-600/40 to-emerald-950/90 shadow-[0_0_28px_rgba(34,197,94,0.45)] md:h-[140px] md:w-[140px] ${
          glow ? 'ring-4 ring-green-300/90 ring-offset-2 ring-offset-slate-950' : ''
        } ${droppable ? 'cursor-copy' : ''} ${openable ? 'cursor-pointer hover:brightness-110' : ''}`}
        onDragOver={droppable ? onManaDragOver : undefined}
        onDragLeave={droppable ? () => setManaDropHover(false) : undefined}
        onDrop={droppable ? onManaDrop : undefined}
      >
        <span className="pointer-events-none text-[0.55rem] font-bold uppercase tracking-wider text-green-100/95">
          Mana Zone
        </span>
        <span className="pointer-events-none mt-0.5 text-2xl font-black tabular-nums text-white md:text-3xl">
          {untapped}/{total || 0}
        </span>
      </div>
    );
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-black lg:h-screen lg:flex-row">
      <div className={`w-full lg:w-80 bg-slate-900 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-700 flex flex-col ${showMobileLog ? 'fixed inset-0 z-50 lg:relative' : 'hidden lg:flex'}`}>
        <div className="bg-slate-800 border-b-2 border-slate-700 p-2">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowCardViewer(!showCardViewer)}
              className="text-white text-sm bg-slate-700 px-2 py-1 rounded hidden lg:block"
            >
              カードビューワー {showCardViewer ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setShowMobileLog(false)}
              className="text-white text-sm bg-red-600 px-3 py-1 rounded lg:hidden ml-auto"
            >
              閉じる
            </button>
          </div>
        </div>

        {showCardViewer && selectedCard && (
          <div className="border-b-2 border-slate-700 p-3 bg-slate-800 hidden lg:block">
            <div className="bg-slate-700 rounded p-2">
              <div className="text-white font-bold text-sm mb-1">{selectedCard.name}</div>
              <div className="text-slate-300 text-xs">{selectedCard.type}</div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-slate-900 p-2">
          <div className="text-white text-xs lg:text-sm font-bold mb-2">ゲームログ</div>
          <div className="space-y-1 text-xs">
            {gameLog.slice(-20).map((log, index) => (
              <div key={index} className="text-slate-300 leading-relaxed">
                <span className="text-[var(--sp-brass)]">{log.player}</span>：
                <span className="text-yellow-300">{log.action}</span>
                {log.details && <span>（{log.details}）</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-gradient-to-br from-slate-800 to-slate-900 p-2 ps-[max(0.5rem,env(safe-area-inset-left))] pe-[max(0.5rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:p-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-2 text-center lg:mb-4">
            <div className="text-sm font-bold text-white lg:text-xl mb-1">
              {isSpectator ? '観戦モード' : `${isMyTurn ? 'あなたのターン' : '相手のターン'}`}
            </div>
            <div className="text-xs text-slate-300 lg:text-sm">ターン {gameState.currentTurn}</div>
            <div className="mt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobileLog(true)}
                className="sp-game-btn touch-manipulation px-3 py-1 text-xs lg:hidden"
              >
                ログ
              </button>
              {!isSpectator && (
                <button
                  type="button"
                  onClick={onQuitGame}
                  className="touch-manipulation rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 lg:mt-0 lg:px-4 lg:text-sm"
                >
                  対戦をやめる
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 lg:space-y-3">
            {/* 奥＝相手（上段・やや奥行きで見せる） */}
            <div className="relative z-0 rounded-xl border border-slate-600/50 bg-slate-950/40 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="mb-1.5 text-xs text-slate-400 lg:text-sm">相手の場</div>

              <div className="mb-1.5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex shrink-0 items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedZone({ zone: 'hand', player: opponentNumber })}
                    className="flex flex-col items-start gap-1 rounded-lg border border-slate-600/80 bg-slate-800/80 px-2 py-2 text-left transition hover:border-green-400/60"
                  >
                    <span className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-400">
                      Hand
                    </span>
                    <div className="flex -space-x-3">
                      {Array.from({
                        length: Math.min(5, Math.max(1, opponentState.hand.length)),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="h-12 w-9 rounded border-2 border-green-500/40 bg-slate-900 shadow-md"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-300">{opponentState.hand.length} 枚</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedZone({ zone: 'shields', player: opponentNumber })}
                    className="flex h-[4.5rem] min-w-[3.25rem] flex-col items-center justify-center rounded-md border border-slate-600 bg-slate-800/90 px-1.5 py-1 text-center transition hover:border-green-400/50"
                  >
                    <Shield className="mb-0.5 h-3.5 w-3.5 text-[var(--sp-brass)]" />
                    <span className="text-[0.5rem] font-bold leading-tight text-slate-400">盾</span>
                    <span className="text-sm font-black text-white">{opponentState.shields.length}</span>
                  </button>
                </div>

                <div className="flex flex-1 flex-wrap items-center justify-center gap-3 text-xs text-slate-300 sm:gap-5">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-600 px-2 py-1 hover:bg-slate-700/80"
                    onClick={() => setSelectedZone({ zone: 'deck', player: opponentNumber })}
                  >
                    山 {opponentState.deck.length}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-600 px-2 py-1 hover:bg-slate-700/80"
                    onClick={() => setSelectedZone({ zone: 'graveyard', player: opponentNumber })}
                  >
                    墓 {opponentState.graveyard.length}
                  </button>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <ManaZoneGauge
                    manaCards={opponentState.mana}
                    droppable={false}
                    onCircleClick={() => openManaModal(opponentNumber)}
                  />
                  <button
                    type="button"
                    className="text-[0.65rem] text-slate-400 underline decoration-slate-500"
                    onClick={() => openManaModal(opponentNumber)}
                  >
                    マナ操作
                  </button>
                </div>
              </div>

              <div className="mb-1 rounded-xl border border-slate-600 bg-slate-900/90 p-2 shadow-inner lg:p-3">
                <div className="mb-1.5 text-center text-sm font-bold text-white lg:text-lg">バトルゾーン</div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {opponentState.battle.map((card) => (
                    <div key={card.instanceId} className={`relative shrink-0 ${card.tapped ? 'opacity-50' : ''}`}>
                      <button
                        type="button"
                        title="カード詳細"
                        className="absolute -right-0.5 -top-0.5 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-slate-500/80 bg-slate-900/95 text-green-300 shadow-md hover:bg-slate-800 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardDetailModal(card);
                        }}
                      >
                        <Info className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                      <div
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer"
                        onClick={() => setSelectedZone({ zone: 'battle', player: opponentNumber })}
                        onKeyDown={(ev) => {
                          if (ev.key === 'Enter' || ev.key === ' ') {
                            ev.preventDefault();
                            setSelectedZone({ zone: 'battle', player: opponentNumber });
                          }
                        }}
                      >
                        <div className={battleCardWrapClass}>
                          <CardImage
                            card={card}
                            className={`${battleCardImgClass} pointer-events-none border-2 ${card.tapped ? 'rotate-90' : ''} border-slate-500 hover:border-green-400/80 transition-all`}
                          />
                          {renderBattleZoneCardMarks(card)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 手前＝自分（下段・手元に近い見え方） */}
            <div className="relative z-10 -mt-1 rounded-xl border border-green-500/35 bg-slate-900/85 p-2 shadow-[0_-12px_36px_rgba(0,0,0,0.45)] ring-1 ring-green-500/25 lg:p-3">
              <div className="mb-1.5 text-xs text-slate-400 lg:text-sm">あなたの場</div>

              <div
                title="手札をドロップしてバトルゾーンに出せます"
                className={`mb-2 min-h-[72px] rounded-xl border border-slate-600 bg-slate-900/90 p-2 shadow-inner transition-[box-shadow] lg:min-h-[88px] lg:p-3 ${
                  battleDropHover && canInteractHand ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''
                }`}
                onDragOver={canInteractHand ? onBattleDragOver : undefined}
                onDragLeave={canInteractHand ? () => setBattleDropHover(false) : undefined}
                onDrop={canInteractHand ? onBattleDrop : undefined}
              >
                <div className="mb-1.5 text-center text-sm font-bold text-white lg:text-lg">バトルゾーン</div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {myState.battle.map((card) => (
                    <div key={card.instanceId} className={`relative shrink-0 ${card.tapped ? 'opacity-50' : ''}`}>
                      <button
                        type="button"
                        title="カード詳細"
                        className="absolute -right-0.5 -top-0.5 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-slate-500/80 bg-slate-900/95 text-green-300 shadow-md hover:bg-slate-800 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardDetailModal(card);
                        }}
                      >
                        <Info className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                      <div
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer"
                        onClick={() => setSelectedZone({ zone: 'battle', player: playerNumber })}
                        onKeyDown={(ev) => {
                          if (ev.key === 'Enter' || ev.key === ' ') {
                            ev.preventDefault();
                            setSelectedZone({ zone: 'battle', player: playerNumber });
                          }
                        }}
                      >
                        <div className={battleCardWrapClass}>
                          <CardImage
                            card={card}
                            className={`${battleCardImgClass} pointer-events-none border-2 ${card.tapped ? 'rotate-90' : ''} border-slate-500 hover:border-green-400/80 transition-all`}
                          />
                          {renderBattleZoneCardMarks(card)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* スマホ: バトルゾーンと手札の間に山・シールド・墓地（小ボタン） */}
              <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5 lg:hidden">
                <button
                  type="button"
                  className="touch-manipulation rounded-md border border-slate-600 bg-slate-800/95 px-2 py-1 text-[0.65rem] text-slate-200 active:bg-slate-700"
                  onClick={() => setSelectedZone({ zone: 'deck', player: playerNumber })}
                >
                  <span className="text-slate-400">山</span>{' '}
                  <span className="font-bold text-white">{myState.deck.length}</span>
                </button>
                <div
                  title="手札をドロップしてシールドゾーンに置けます"
                  className={`rounded-md transition-[box-shadow] ${
                    shieldDropHover && canInteractHand
                      ? 'ring-2 ring-green-400 ring-offset-1 ring-offset-slate-900'
                      : ''
                  }`}
                  onDragOver={canInteractHand ? onShieldDragOver : undefined}
                  onDragLeave={canInteractHand ? () => setShieldDropHover(false) : undefined}
                  onDrop={canInteractHand ? onShieldDrop : undefined}
                >
                  <button
                    type="button"
                    className="touch-manipulation flex items-center gap-1 rounded-md border border-slate-600 bg-slate-800/95 px-2 py-1 text-[0.65rem] text-slate-200 active:bg-slate-800"
                    onClick={() => setSelectedZone({ zone: 'shields', player: playerNumber })}
                  >
                    <Shield className="h-3 w-3 shrink-0 text-[var(--sp-brass)]" />
                    <span className="font-bold text-white">{myState.shields.length}</span>
                  </button>
                </div>
                <div
                  title="手札をドロップして墓地に置けます"
                  className={`rounded-md transition-[box-shadow] ${
                    graveyardDropHover && canInteractHand
                      ? 'ring-2 ring-violet-400 ring-offset-1 ring-offset-slate-900'
                      : ''
                  }`}
                  onDragOver={canInteractHand ? onGraveyardDragOver : undefined}
                  onDragLeave={canInteractHand ? () => setGraveyardDropHover(false) : undefined}
                  onDrop={canInteractHand ? onGraveyardDrop : undefined}
                >
                  <button
                    type="button"
                    className="touch-manipulation flex items-center gap-1 rounded-md border border-slate-600 bg-slate-800/95 px-2 py-1 text-[0.65rem] text-slate-200 active:bg-slate-700"
                    onClick={() => setSelectedZone({ zone: 'graveyard', player: playerNumber })}
                  >
                    <span className="text-slate-400">墓</span>
                    <span className="font-bold text-white">{myState.graveyard.length}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
                {/* PC: 左マナ */}
                <div className="order-2 hidden shrink-0 flex-col items-center gap-1 lg:order-1 lg:flex">
                  <ManaZoneGauge
                    manaCards={myState.mana}
                    droppable={canInteractHand}
                    glow={manaDropHover && canInteractHand}
                    onCircleClick={() => openManaModal(playerNumber)}
                    suppressClickAfterDropRef={suppressManaCircleClickRef}
                  />
                  <button
                    type="button"
                    className="text-[0.65rem] text-slate-400 underline decoration-slate-500"
                    onClick={() => openManaModal(playerNumber)}
                  >
                    マナ操作（タップ等）
                  </button>
                </div>

                <div className="order-1 flex min-w-0 flex-1 flex-col items-center gap-2 lg:order-2">
                  <div
                    title="手札をドロップしてシールドゾーンに置けます"
                    className={`hidden w-full max-w-3xl justify-end px-2 transition-[box-shadow] lg:flex ${
                      shieldDropHover && canInteractHand
                        ? 'rounded-md ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900'
                        : ''
                    }`}
                    onDragOver={canInteractHand ? onShieldDragOver : undefined}
                    onDragLeave={canInteractHand ? () => setShieldDropHover(false) : undefined}
                    onDrop={canInteractHand ? onShieldDrop : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedZone({ zone: 'shields', player: playerNumber })}
                      className="flex min-h-[2.25rem] items-center gap-1.5 rounded-md border border-slate-600 bg-slate-800/95 px-2 py-1 text-left text-[0.65rem] text-slate-200 shadow-sm transition hover:border-green-400/60 hover:bg-slate-800"
                    >
                      <Shield className="h-3.5 w-3.5 shrink-0 text-[var(--sp-brass)]" />
                      <div className="flex flex-col leading-tight">
                        <span className="text-[0.55rem] font-bold text-slate-400">シールド</span>
                        <span className="text-sm font-black text-white">{myState.shields.length}枚</span>
                      </div>
                    </button>
                  </div>

                  <div className="hidden flex-wrap items-center justify-center gap-3 text-xs text-slate-200 sm:gap-5 lg:flex">
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/80 px-2 py-1 hover:bg-slate-700"
                      onClick={() => setSelectedZone({ zone: 'deck', player: playerNumber })}
                    >
                      <span className="text-slate-400">山</span>
                      <span className="font-bold">{myState.deck.length}</span>
                    </button>
                    <div className="flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/80 px-2 py-1">
                      <span className="text-slate-400">手</span>
                      <span className="font-bold">{myState.hand.length}</span>
                    </div>
                    <div
                      title="手札をドロップして墓地に置けます"
                      className={`rounded-lg transition-[box-shadow] ${
                        graveyardDropHover && canInteractHand
                          ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-slate-900'
                          : ''
                      }`}
                      onDragOver={canInteractHand ? onGraveyardDragOver : undefined}
                      onDragLeave={canInteractHand ? () => setGraveyardDropHover(false) : undefined}
                      onDrop={canInteractHand ? onGraveyardDrop : undefined}
                    >
                      <button
                        type="button"
                        className="flex h-full min-h-[2rem] w-full items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/80 px-2 py-1 hover:bg-slate-700"
                        onClick={() => setSelectedZone({ zone: 'graveyard', player: playerNumber })}
                      >
                        <span className="text-slate-400">墓</span>
                        <span className="font-bold">{myState.graveyard.length}</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-3xl px-2 lg:mx-auto">
                    <div className="mb-1 text-center text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">
                      Hand
                    </div>
                    <div className="mx-auto flex min-h-[100px] w-full max-w-full items-end justify-center px-0 pb-1 lg:min-h-[130px]">
                      {myState.hand.length === 0 ? (
                        <span className="text-sm text-slate-500">手札なし</span>
                      ) : (
                        myState.hand.map((card, i) => {
                          const n = myState.hand.length;
                          const rot = n === 1 ? 0 : (i - (n - 1) / 2) * 9;
                          const yLift = Math.abs(i - (n - 1) / 2) * 3;
                          return (
                            <div
                              key={card.instanceId}
                              draggable={canInteractHand}
                              onDragStart={(e) => onHandDragStart(e, card)}
                              onDragEnd={onHandDragEnd}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!canInteractHand || handDraggedRef.current) return;
                                setHandManaMenu({
                                  card,
                                  anchor: (e.currentTarget as HTMLDivElement).getBoundingClientRect(),
                                });
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setCardDetailModal(card);
                              }}
                              style={{
                                transform: `rotate(${rot}deg) translateY(${yLift}px)`,
                                zIndex: i,
                                marginLeft: i === 0 ? 0 : -20,
                              }}
                              className={`relative w-[72px] shrink-0 cursor-pointer sm:w-[84px] md:w-[96px] ${
                                canInteractHand ? 'hover:-translate-y-1' : 'opacity-80'
                              } transition-transform`}
                            >
                              <button
                                type="button"
                                title="カード詳細"
                                className="absolute -right-0.5 -top-0.5 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-slate-500/80 bg-slate-900/95 text-green-300 shadow-md hover:bg-slate-800 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setCardDetailModal(card);
                                  setHandManaMenu(null);
                                }}
                              >
                                <Info className="h-4 w-4" strokeWidth={2.5} />
                              </button>
                              <CardImage
                                card={card}
                                className={`pointer-events-none w-full rounded-lg border-2 border-emerald-500/70 shadow-lg ${
                                  !canInteractHand ? 'grayscale' : ''
                                }`}
                                draggable={false}
                              />
                            </div>
                          );
                        })
                      )}
                    </div>
                    <button
                      type="button"
                      className="mx-auto mt-1 block text-[0.65rem] text-slate-500 underline"
                      onClick={() => setSelectedZone({ zone: 'hand', player: playerNumber })}
                    >
                      手札を一覧・詳細操作
                    </button>
                  </div>
                </div>

                {/* スマホ: 左下＝マナ / 右下＝ターン終了・ドロー・マナチャージ */}
                <div className="flex w-full flex-row items-end justify-between gap-2 border-t border-slate-700/50 pt-2 lg:hidden">
                  <div className="-ml-0.5 flex shrink-0 scale-[0.86] flex-col items-center gap-0.5 origin-bottom-left sm:ml-0 sm:scale-[0.92]">
                    <ManaZoneGauge
                      manaCards={myState.mana}
                      droppable={canInteractHand}
                      glow={manaDropHover && canInteractHand}
                      onCircleClick={() => openManaModal(playerNumber)}
                      suppressClickAfterDropRef={suppressManaCircleClickRef}
                    />
                    <button
                      type="button"
                      className="max-w-[5rem] text-center text-[0.55rem] text-slate-400 underline decoration-slate-500 touch-manipulation"
                      onClick={() => openManaModal(playerNumber)}
                    >
                      マナ操作
                    </button>
                  </div>
                  {!isSpectator && (
                    <div className="flex min-w-0 max-w-[58%] flex-col items-stretch gap-1.5 self-end sm:max-w-[50%]">
                      <button
                        type="button"
                        onClick={onEndTurn}
                        disabled={!isMyTurn}
                        className="w-full touch-manipulation rounded-md bg-green-600 px-2 py-2.5 text-[0.7rem] font-semibold leading-tight text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-green-700 sm:text-xs"
                        style={{ clipPath: 'polygon(12% 0%, 88% 0%, 100% 50%, 88% 100%, 12% 100%, 0% 50%)' }}
                      >
                        TURN END
                      </button>
                      <div className="grid grid-cols-2 gap-1">
                        <ActionButton label="ドロー" onClick={onDrawCard} />
                        <ActionButton label="マナチャージ" onClick={onAddToManaFromDeck} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="order-3 hidden w-[140px] shrink-0 flex-col items-center gap-2 lg:flex">
                  {!isSpectator && (
                    <>
                      <button
                        type="button"
                        onClick={onEndTurn}
                        disabled={!isMyTurn}
                        className="w-full min-w-[120px] touch-manipulation rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4 sm:text-base"
                        style={{ clipPath: 'polygon(12% 0%, 88% 0%, 100% 50%, 88% 100%, 12% 100%, 0% 50%)' }}
                      >
                        TURN END
                      </button>
                      <div className="grid w-full grid-cols-2 gap-2">
                        <ActionButton label="ドロー" onClick={onDrawCard} />
                        <ActionButton label="マナチャージ" onClick={onAddToManaFromDeck} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {handManaMenu && canInteractHand && (
        <div
          id="hand-action-float-menu"
          className="fixed z-[100] max-w-[min(100vw-1rem,220px)] rounded-lg border border-slate-600 bg-slate-900/98 p-2 shadow-2xl shadow-black/50"
          style={{
            left: handManaMenu.anchor.left + handManaMenu.anchor.width / 2,
            top: handManaMenu.anchor.top - 8,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="mb-2 border-b border-slate-600 pb-1 text-center text-[0.65rem] font-bold text-slate-400">
            移動先を選択
          </p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="rounded-md border border-slate-500 bg-slate-800 px-2 py-1.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-700"
              onClick={(e) => {
                e.stopPropagation();
                setCardDetailModal(handManaMenu.card);
              }}
            >
              カード詳細を見る
            </button>
            <button
              type="button"
              className="rounded-md bg-green-600 px-2 py-1.5 text-left text-xs font-bold text-white hover:bg-green-500"
              onClick={(e) => {
                e.stopPropagation();
                placeHandCardToZone(handManaMenu.card, 'mana');
              }}
            >
              マナゾーンに置く
            </button>
            <button
              type="button"
              className="rounded-md bg-emerald-700 px-2 py-1.5 text-left text-xs font-bold text-white hover:bg-emerald-600"
              onClick={(e) => {
                e.stopPropagation();
                placeHandCardToZone(handManaMenu.card, 'battle');
              }}
            >
              バトルゾーンに置く
            </button>
            <button
              type="button"
              className="rounded-md bg-violet-800 px-2 py-1.5 text-left text-xs font-bold text-white hover:bg-violet-700"
              onClick={(e) => {
                e.stopPropagation();
                placeHandCardToZone(handManaMenu.card, 'graveyard');
              }}
            >
              墓地に置く
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-700"
              onClick={(e) => {
                e.stopPropagation();
                placeHandCardToZone(handManaMenu.card, 'shields');
              }}
            >
              シールドゾーンに置く
            </button>
          </div>
        </div>
      )}

      {selectedZone &&
        selectedZone.zone === 'deck' &&
        selectedZone.player === playerNumber &&
        !isSpectator && (
          <DeckOperationModal
            isOpen
            onClose={() => {
              void onCloseDeckOperation();
              setSelectedZone(null);
            }}
            deckCount={myState.deck.length}
            deckReveal={myState.deckReveal}
            deckRevealOneByOne={myState.deckRevealOneByOne}
            onShuffle={onShuffleDeck}
            onRevealMulti={onRevealDeckMulti}
            onStartOneByOne={onStartDeckRevealOneByOne}
            onMoveRevealToZone={(ids, dest) => onMoveCardsFromDeckReveal(ids, dest)}
            onOpenCardDetail={(c) => setCardDetailModal(c)}
          />
        )}

      {selectedZone && !(selectedZone.zone === 'deck' && selectedZone.player === playerNumber && !isSpectator) && (
        <ZoneActionModal
          isOpen={true}
          onClose={() => setSelectedZone(null)}
          cards={
            selectedZone.player === 1
              ? gameState.player1[selectedZone.zone]
              : gameState.player2[selectedZone.zone]
          }
          zoneName={
            {
              deck: '山札',
              hand: '手札',
              mana: 'マナゾーン',
              battle: 'バトルゾーン (BZ)',
              graveyard: '墓地',
              shields: 'シールドゾーン'
            }[selectedZone.zone] || selectedZone.zone
          }
          actions={getZoneActions(selectedZone.zone, selectedZone.player)}
          canViewCards={
            isSpectator
              ? !['deck', 'hand', 'shields'].includes(selectedZone.zone)
              : selectedZone.player === playerNumber
                ? ['hand', 'mana', 'battle', 'graveyard'].includes(selectedZone.zone)
                : !['deck', 'hand', 'shields'].includes(selectedZone.zone)
          }
          zone={selectedZone.zone}
        />
      )}

      <CardDetailModal card={cardDetailModal} onClose={() => setCardDetailModal(null)} />

      {gameState.gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="sp-modal-surface max-w-md rounded-lg p-8 text-center">
            <h2 className="sp-display mb-4 text-3xl font-semibold text-[var(--sp-ink)]">
              {gameState.winner === playerNumber ? '勝利！' : '敗北'}
            </h2>
            <p className="mb-6 text-xl text-[var(--sp-parchment)]">
              {gameState.winner === playerNumber
                ? 'おめでとうございます！'
                : '次回頑張りましょう！'}
            </p>
            <button
              type="button"
              onClick={onQuitGame}
              className="sp-btn sp-btn--primary rounded-lg px-6 py-3 text-lg font-bold"
            >
              マッチメイキングへ戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
