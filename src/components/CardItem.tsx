import { Card } from '../types/card';

interface CardItemProps {
  card: Card;
  onClick: () => void;
}

export default function CardItem({ card, onClick }: CardItemProps) {
  const imageUrl = card.image_url || '/image.png';

  return (
    <div onClick={onClick} className="group cursor-pointer">
      <div className="overflow-hidden rounded-lg border border-[var(--sp-border)] bg-[var(--sp-panel)] transition-all duration-200 hover:border-green-300 hover:shadow-sm group-hover:scale-[1.02]">
        <div className="relative aspect-[3/4]">
          <img
            src={imageUrl}
            alt={card.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== '/image.png') {
                target.src = '/image.png';
              }
            }}
          />
          {card.is_unique && (
            <div className="absolute right-1 top-1 rounded bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">
              ★
            </div>
          )}
        </div>
        <div className="border-t border-[var(--sp-border)] bg-[var(--sp-panel-elevated)] p-2">
          <h3 className="truncate text-xs font-bold leading-tight text-[var(--sp-ink)]">
            {card.name}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-[var(--sp-muted)]">{card.card_type}</span>
            <span className="text-xs font-semibold text-[var(--sp-brass)]">{card.cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
