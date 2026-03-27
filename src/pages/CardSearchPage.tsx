import { useState } from 'react';
import SearchFilter from '../components/SearchFilter';
import CardGrid from '../components/CardGrid';
import CardDetailModal from '../components/CardDetailModal';
import { useCards } from '../hooks/useCards';
import { Card, DEFAULT_SEARCH_FILTERS } from '../types/card';

export default function CardSearchPage() {
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_SEARCH_FILTERS }));

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { cards, loading, error } = useCards(filters);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="sp-display mb-2 text-2xl font-semibold text-[var(--sp-ink)]">カード検索</h2>
          <p className="text-sm text-[var(--sp-muted)]">カードを検索できます</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <SearchFilter filters={filters} onFilterChange={setFilters} />
          </aside>

          <section className="lg:col-span-3">
            {loading && (
              <div className="sp-panel border-green-200 bg-green-50/60 p-12 text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
                <p className="mt-4 font-medium text-green-800">読み込み中...</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-red-800">エラーが発生しました: {error}</p>
              </div>
            )}

            {!loading && !error && (
              <CardGrid cards={cards} onCardClick={setSelectedCard} />
            )}
          </section>
        </div>
      </main>

      <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </>
  );
}
