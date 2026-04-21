import { useState } from 'react';
import { X } from 'lucide-react';
import type { Card } from '../../types/card';
import { DeckCard } from '../../types/deck';
import { CardImage } from '../CardImage';
import CardDetailModal from '../CardDetailModal';

interface DeckListModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckName: string;
  deckCards: DeckCard[];
}

export default function DeckListModal({
  isOpen,
  onClose,
  deckName,
  deckCards,
}: DeckListModalProps) {
  const [detailCard, setDetailCard] = useState<Card | null>(null);

  if (!isOpen) return null;

  const sortedCards = [...deckCards]
    .filter(dc => dc.card)
    .sort((a, b) => {
      const ua = a.card!.is_unique ? 0 : 1;
      const ub = b.card!.is_unique ? 0 : 1;
      if (ua !== ub) return ua - ub;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
      <div className="sp-modal-surface relative flex h-full max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 rounded border border-[var(--sp-border)] bg-[var(--sp-panel-elevated)] p-1 text-[var(--sp-brass)] transition-colors hover:border-[var(--sp-brass-dim)]"
          title="閉じる"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-10">
          <div className="mb-3 rounded-lg border border-green-200 bg-green-50/70 px-3 py-2 text-center">
            <div className="sp-display text-sm font-semibold text-green-950">メインカード</div>
            <p className="mt-1 text-xs text-green-800">{deckName}</p>
          </div>

          <div className="flex justify-center pb-4">
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-8 gap-0.5 sm:gap-1">
              {sortedCards.map((deckCard) =>
                Array.from({ length: deckCard.quantity }).map((_, idx) => (
                  <button
                    key={`${deckCard.card!.id}-${idx}`}
                    type="button"
                    title="カード詳細"
                    onClick={() => setDetailCard(deckCard.card!)}
                    className="aspect-[63/88] w-[11vw] overflow-hidden rounded-sm border border-[var(--sp-border)] bg-[var(--sp-panel-elevated)] shadow-sm transition hover:ring-2 hover:ring-green-400/40 sm:w-[8vw] md:w-[7vw] lg:w-[6vw]"
                  >
                    <CardImage
                      card={deckCard.card!}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <CardDetailModal card={detailCard} onClose={() => setDetailCard(null)} />
    </>
  );
}
