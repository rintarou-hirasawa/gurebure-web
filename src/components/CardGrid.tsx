import { Card } from '../types/card';
import CardItem from './CardItem';

interface CardGridProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
}

export default function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="sp-panel p-12 text-center">
        <p className="text-[var(--sp-muted)]">カードが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <p className="text-sm text-[var(--sp-muted)]">
          検索結果: <span className="font-semibold text-[var(--sp-brass)]">{cards.length}</span> 件
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} onClick={() => onCardClick(card)} />
        ))}
      </div>
    </div>
  );
}
