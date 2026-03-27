import { useState } from 'react';
import { X, Star, Sword, Zap, Shield } from 'lucide-react';
import { CardInGame, Zone } from '../../types/game';

interface ZoneActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CardInGame[];
  zoneName: string;
  actions: {
    label: string;
    action: (selectedCards: CardInGame[]) => void;
    requiresSelection?: boolean;
    multiSelect?: boolean;
    viewOnly?: boolean;
  }[];
  canViewCards: boolean;
  zone?: Zone;
}

export function ZoneActionModal({
  isOpen,
  onClose,
  cards,
  zoneName,
  actions,
  canViewCards,
  zone
}: ZoneActionModalProps) {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [forceViewCards, setForceViewCards] = useState(false);
  const [cardDetailModal, setCardDetailModal] = useState<CardInGame | null>(null);

  const showDetailButton = zone !== 'shields' && zone !== 'deck';

  if (!isOpen) return null;

  const getCardTypeIcon = (type: string) => {
    if (type.includes('クリーチャー')) {
      return <Sword className="w-3 h-3 text-red-500" />;
    } else if (type.includes('呪文')) {
      return <Zap className="w-3 h-3 text-green-500" />;
    } else if (type.includes('フィールド')) {
      return <Shield className="w-3 h-3 text-green-500" />;
    }
    return null;
  };

  const handleCardClick = (card: CardInGame, multiSelect: boolean) => {
    if (!canViewCards) return;

    const newSelected = new Set(selectedCards);
    if (multiSelect) {
      if (newSelected.has(card.instanceId)) {
        newSelected.delete(card.instanceId);
      } else {
        newSelected.add(card.instanceId);
      }
    } else {
      newSelected.clear();
      newSelected.add(card.instanceId);
    }
    setSelectedCards(newSelected);
  };

  const handleAction = (action: typeof actions[0]) => {
    if (action.viewOnly) {
      setForceViewCards(true);
      return;
    }
    const selected = cards.filter(c => selectedCards.has(c.instanceId));
    action.action(selected);
    setSelectedCards(new Set());
    setForceViewCards(false);
    // メイン画面に戻さず、このモーダル上で続けて操作できるようにする
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="sp-modal-surface max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg">
        <div className="flex items-center justify-between border-b border-[var(--sp-border)] p-4">
          <h2 className="text-xl font-bold text-[var(--sp-ink)]">
            {zoneName} ({cards.length}枚)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-transparent p-2 text-[var(--sp-muted)] transition-colors hover:border-[var(--sp-border)] hover:bg-green-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-4">
          {(canViewCards || forceViewCards) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cards.map((card) => {
                const isSelected = selectedCards.has(card.instanceId);
                return (
                <div key={card.instanceId} className="relative">
                  <div
                    onClick={() => handleCardClick(card, true)}
                    className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50 shadow-inner ring-2 ring-green-200'
                        : 'border-[var(--sp-border)] hover:border-green-300'
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden rounded ${
                        isSelected ? 'ring-1 ring-black/25' : ''
                      }`}
                    >
                      <img
                        src={card.image_url || '/image.png'}
                        alt={card.name}
                        className={`w-full rounded transition-[filter,opacity] duration-200 ${
                          isSelected ? 'brightness-[0.48] contrast-[1.05] opacity-90' : ''
                        }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== '/image.png') {
                            target.src = '/image.png';
                          }
                        }}
                      />
                      {isSelected && (
                        <div
                          className="pointer-events-none absolute inset-0 rounded bg-black/45"
                          aria-hidden
                        />
                      )}
                      {card.tapped && (
                        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center rounded p-1">
                          <span className="max-w-[90%] rounded-md border border-green-400/50 bg-black/88 px-2 py-1 text-center text-[0.65rem] font-black leading-tight tracking-wide text-green-100 shadow-lg sm:px-3 sm:py-1.5 sm:text-sm">
                            タップ中
                          </span>
                        </div>
                      )}
                      <div className="pointer-events-none absolute top-1 left-1 z-10 flex gap-1">
                        {card.is_unique && (
                          <div className="bg-yellow-400 rounded-full p-0.5">
                            <Star className="w-3 h-3 text-yellow-900 fill-yellow-900" />
                          </div>
                        )}
                        {getCardTypeIcon(card.type) && (
                          <div className="bg-white rounded-full p-0.5">
                            {getCardTypeIcon(card.type)}
                          </div>
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-xs mt-1 text-center truncate ${
                        isSelected ? 'font-semibold text-gray-800' : 'text-gray-700'
                      }`}
                    >
                      {card.name}
                    </p>
                  </div>
                  {showDetailButton && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardDetailModal(card);
                      }}
                      className="absolute right-1 top-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                    >
                      詳細
                    </button>
                  )}
                </div>
              );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-[var(--sp-muted)]">
              <p>カードの内容は非公開です</p>
              <p className="mt-2 text-2xl font-bold text-[var(--sp-ink)]">{cards.length}枚</p>
            </div>
          )}
        </div>

        <div className="border-t border-green-200 bg-green-50 p-4">
          <div className="flex flex-wrap gap-2">
            {actions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAction(action)}
                disabled={action.requiresSelection && selectedCards.size === 0}
                className="sp-btn sp-btn--primary rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {action.label}
              </button>
            ))}
          </div>
          {selectedCards.size > 0 && (
            <p className="mt-2 text-sm text-[var(--sp-muted)]">
              {selectedCards.size}枚選択中
            </p>
          )}
        </div>
      </div>

      {cardDetailModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setCardDetailModal(null)}
        >
          <div
            className="sp-modal-surface max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--sp-border)] bg-[var(--sp-panel)] p-4"
            >
              <h2 className="text-xl font-bold text-[var(--sp-ink)]">カード詳細</h2>
              <button
                type="button"
                onClick={() => setCardDetailModal(null)}
                className="rounded-lg border border-transparent p-2 text-[var(--sp-muted)] transition-colors hover:border-[var(--sp-border)] hover:bg-green-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-4 text-2xl font-semibold text-[var(--sp-ink)]">{cardDetailModal.name}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex border-b border-[var(--sp-border)] pb-2">
                    <span className="w-32 font-semibold text-[var(--sp-muted)]">種類:</span>
                    <span className="text-[var(--sp-ink)]">{cardDetailModal.type}</span>
                  </div>
                  <div className="flex border-b border-[var(--sp-border)] pb-2">
                    <span className="w-32 font-semibold text-[var(--sp-muted)]">文明:</span>
                    <span className="text-[var(--sp-ink)]">{cardDetailModal.civilization}</span>
                  </div>
                  <div className="flex border-b border-[var(--sp-border)] pb-2">
                    <span className="w-32 font-semibold text-[var(--sp-muted)]">コスト:</span>
                    <span className="text-[var(--sp-ink)]">{cardDetailModal.cost}</span>
                  </div>
                  {cardDetailModal.power && (
                    <div className="flex border-b border-[var(--sp-border)] pb-2">
                      <span className="w-32 font-semibold text-[var(--sp-muted)]">パワー:</span>
                      <span className="text-[var(--sp-ink)]">{cardDetailModal.power}</span>
                    </div>
                  )}
                  {cardDetailModal.race && (
                    <div className="flex border-b border-[var(--sp-border)] pb-2">
                      <span className="w-32 font-semibold text-[var(--sp-muted)]">種族:</span>
                      <span className="text-[var(--sp-ink)]">{cardDetailModal.race}</span>
                    </div>
                  )}
                  <div className="flex border-b border-[var(--sp-border)] pb-2">
                    <span className="w-32 font-semibold text-[var(--sp-muted)]">レアリティ:</span>
                    <span className="text-[var(--sp-ink)]">{cardDetailModal.rarity}</span>
                  </div>
                  <div className="flex border-b border-[var(--sp-border)] pb-2">
                    <span className="w-32 font-semibold text-[var(--sp-muted)]">拡張:</span>
                    <span className="text-[var(--sp-ink)]">{cardDetailModal.expansion}</span>
                  </div>
                </div>
                {cardDetailModal.ability && (
                  <div className="mt-6">
                    <h4 className="mb-3 text-lg font-semibold text-[var(--sp-ink)]">カード効果:</h4>
                    <div className="rounded-lg border border-green-200 bg-green-50/80 p-4">
                      <p className="whitespace-pre-wrap leading-relaxed text-[var(--sp-ink)]">
                        {cardDetailModal.ability}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
