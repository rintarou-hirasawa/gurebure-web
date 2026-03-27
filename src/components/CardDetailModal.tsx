import { X, Download, Star } from 'lucide-react';
import { Card } from '../types/card';
import { useEffect } from 'react';

interface CardDetailModalProps {
  card: Card | null;
  onClose: () => void;
}

const cardTypeColors: Record<string, string> = {
  モンスター: 'bg-orange-50 text-orange-900 border-orange-200',
  呪文: 'bg-green-50 text-green-900 border-green-200',
  装具: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  装備: 'bg-emerald-50 text-emerald-900 border-emerald-200',
};

export default function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (card) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [card, onClose]);

  if (!card) return null;

  const imageUrl = card.image_url || '/image.png';

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${card.name}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="sp-modal-surface max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--sp-border)] bg-[var(--sp-panel)] px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[var(--sp-ink)]">{card.name}</h2>
            {card.is_unique && (
              <span className="flex items-center gap-1 rounded border border-green-300 bg-green-100 px-2 py-1 text-xs font-semibold text-green-900">
                <Star className="h-3 w-3 fill-current" />
                ユニーク
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-md border border-green-200 p-2 text-[var(--sp-muted)] transition-colors hover:bg-green-50"
              title="カード画像をダウンロード"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-green-200 p-2 text-[var(--sp-muted)] transition-colors hover:bg-green-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <img
                src={imageUrl}
                alt={card.name}
                className="w-full rounded-lg border border-[var(--sp-border)] shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/image.png') {
                    target.src = '/image.png';
                  }
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50/80 p-4">
                <h3 className="mb-3 text-sm font-semibold text-[var(--sp-ink)]">基本情報</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--sp-muted)]">カードタイプ</span>
                    <span
                      className={`rounded border px-3 py-1 text-xs font-semibold ${
                        cardTypeColors[card.card_type] ||
                        'border-[var(--sp-border)] bg-white text-[var(--sp-ink)]'
                      }`}
                    >
                      {card.card_type}
                    </span>
                  </div>
                  {card.race && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--sp-muted)]">種族</span>
                      <span className="text-sm font-medium text-[var(--sp-ink)]">{card.race}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-[var(--sp-border)] pt-2">
                    <span className="text-sm text-[var(--sp-muted)]">コスト</span>
                    <span className="text-2xl font-semibold text-[var(--sp-brass)]">{card.cost}</span>
                  </div>
                  {card.power !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--sp-muted)]">パワー</span>
                      <span className="text-2xl font-semibold text-[var(--sp-rust)]">{card.power}</span>
                    </div>
                  )}
                </div>
              </div>

              {card.abilities && card.abilities.length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50/80 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-[var(--sp-ink)]">能力</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.abilities.map((ability, index) => (
                      <span
                        key={index}
                        className="rounded border border-[var(--sp-border)] bg-white px-2 py-1 text-xs font-medium text-[var(--sp-ink)]"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {card.effect_text && (
                <div className="rounded-lg border border-green-200 bg-green-50/80 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-[var(--sp-ink)]">カード効果</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--sp-parchment)]">
                    {card.effect_text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
