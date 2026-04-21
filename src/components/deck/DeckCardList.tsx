import { DeckCard } from '../../types/deck';
import { Star, X } from 'lucide-react';
import { CardImage } from '../CardImage';

interface DeckCardListProps {
  deckCards: DeckCard[];
  onRemoveCard: (deckCardId: string) => void;
  /** 左右分割レイアウト用：サムネを詰めて一覧性を上げる */
  compact?: boolean;
  /** カード名の下段を非表示（高さを抑えて一覧を画面内に収める） */
  showNames?: boolean;
}

const cardThumbClass = (compact: boolean) =>
  compact
    ? 'relative aspect-[63/88] rounded-sm overflow-hidden border border-[var(--sp-border)] transition-colors hover:border-[var(--sp-brass-dim)] active:scale-95'
    : 'relative aspect-[63/88] rounded overflow-hidden border-2 border-[var(--sp-border)] transition-colors hover:border-[var(--sp-brass-dim)] active:scale-95';

export default function DeckCardList({
  deckCards,
  onRemoveCard,
  compact = false,
  showNames = true,
}: DeckCardListProps) {
  const withCard = deckCards.filter((dc): dc is DeckCard & { card: NonNullable<DeckCard['card']> } =>
    Boolean(dc.card)
  );

  const sorted = [...withCard].sort((a, b) => {
    const aU = a.card.is_unique ? 0 : 1;
    const bU = b.card.is_unique ? 0 : 1;
    if (aU !== bU) return aU - bU;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  type Slot = { deckCardId: string; card: NonNullable<DeckCard['card']>; key: string };
  const slots: Slot[] = sorted.flatMap((dc) =>
    Array.from({ length: dc.quantity }, (_, i) => ({
      deckCardId: dc.id,
      card: dc.card,
      key: `${dc.id}-${i}`,
    }))
  );

  if (slots.length === 0) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center px-4 text-center text-sm text-[var(--sp-muted)]">
        カードを追加してください
      </div>
    );
  }

  /** デッキビルダー左：横8×縦5（40枚まで）をパネル高に収め、超過分は縦スクロール */
  const fitFiveRows = compact && slots.length <= 40;
  const gridClass = compact
    ? fitFiveRows
      ? 'grid h-full min-h-0 w-full grid-cols-8 grid-rows-5 gap-px'
      : 'grid w-full auto-rows-min grid-cols-8 gap-px'
    : 'grid grid-cols-7 gap-1 sm:grid-cols-8 sm:gap-1.5 md:grid-cols-10 lg:grid-cols-12';

  const thumbClassForSlot = (compact: boolean) =>
    compact && fitFiveRows
      ? 'relative h-full w-full min-h-0 rounded-sm overflow-hidden border border-[var(--sp-border)] transition-colors hover:border-[var(--sp-brass-dim)] active:scale-95'
      : cardThumbClass(compact);

  return (
    <div className={gridClass}>
      {slots.map(({ deckCardId, card, key }) => (
        <div key={key} className="group relative min-h-0 min-w-0" title={card.name}>
          <div className={thumbClassForSlot(compact)}>
            <CardImage card={card} className="h-full w-full object-cover" />
            {card.is_unique && (
              <div
                className={`pointer-events-none absolute left-0.5 top-0.5 flex items-center gap-0.5 rounded bg-amber-500/95 shadow-sm ring-1 ring-amber-700/40 ${compact ? 'p-0.5' : 'px-1 py-0.5 sm:left-1 sm:top-1 sm:px-1.5 sm:py-0.5'}`}
                title="ユニーク"
              >
                <Star
                  className={`fill-amber-950 text-amber-950 ${compact ? 'h-2 w-2' : 'h-2.5 w-2.5 sm:h-3 sm:w-3'}`}
                />
                {!compact && (
                  <span className="hidden text-[0.5rem] font-black leading-none text-amber-950 sm:inline sm:text-[0.55rem]">
                    U
                  </span>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemoveCard(deckCardId)}
              className={`absolute rounded border border-[#7a2e24] bg-[var(--sp-rust)] text-white opacity-100 transition-opacity active:brightness-90 sm:opacity-0 sm:group-hover:opacity-100 ${compact ? 'right-0 top-0 p-0.5' : 'right-0.5 top-0.5 p-1 sm:right-1 sm:top-1'}`}
              title="1枚削除"
            >
              <X className={compact ? 'h-2 w-2' : 'h-2.5 w-2.5 sm:h-3 sm:w-3'} />
            </button>
          </div>
          {showNames && (
            <div
              className={`mt-0.5 truncate text-[var(--sp-muted)] ${compact ? 'text-[8px] leading-tight sm:text-[9px]' : 'text-[9px] sm:text-[10px]'}`}
              title={card.name}
            >
              {card.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
