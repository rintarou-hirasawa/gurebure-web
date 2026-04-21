import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import { Card, DEFAULT_SEARCH_FILTERS, SearchFilters } from '../../types/card';
import { useCards } from '../../hooks/useCards';
import { CardImage } from '../CardImage';
import DeckFilterModal from './DeckFilterModal';

type SortMode = 'server' | 'costAsc' | 'costDesc' | 'name';

const SORT_CYCLE: SortMode[] = ['server', 'costAsc', 'costDesc', 'name'];

interface CardSearchForDeckProps {
  onAddCard: (card: Card) => void;
  className?: string;
}

function sortCards(cards: Card[], mode: SortMode): Card[] {
  if (mode === 'server') return cards;
  const c = [...cards];
  const byName = (a: Card, b: Card) => a.name.localeCompare(b.name, 'ja');
  switch (mode) {
    case 'costAsc':
      c.sort((a, b) => a.cost - b.cost || byName(a, b));
      break;
    case 'costDesc':
      c.sort((a, b) => b.cost - a.cost || byName(a, b));
      break;
    case 'name':
      c.sort(byName);
      break;
    default:
      break;
  }
  return c;
}

export default function CardSearchForDeck({ onAddCard, className = '' }: CardSearchForDeckProps) {
  const [filters, setFilters] = useState<SearchFilters>({ ...DEFAULT_SEARCH_FILTERS });
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('server');

  const { cards, loading, error } = useCards(filters);

  const sortedCards = useMemo(() => sortCards(cards, sortMode), [cards, sortMode]);

  useEffect(() => {
    setSearchDraft(filters.searchText);
  }, [filters.searchText]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => (f.searchText === searchDraft ? f : { ...f, searchText: searchDraft }));
    }, 350);
    return () => clearTimeout(t);
  }, [searchDraft]);

  const cycleSort = () => {
    setSortMode((m) => {
      const i = SORT_CYCLE.indexOf(m);
      return SORT_CYCLE[(i + 1) % SORT_CYCLE.length];
    });
  };

  const sortLabel =
    sortMode === 'server'
      ? '並べ替え'
      : sortMode === 'costAsc'
        ? 'コスト↑'
        : sortMode === 'costDesc'
          ? 'コスト↓'
          : '名前順';

  const renderCardTile = (card: Card) => (
    <button key={card.id} type="button" onClick={() => onAddCard(card)} className="min-w-0 text-left">
      <div className="relative aspect-[63/88] w-full overflow-hidden rounded border-2 border-green-200 bg-white shadow-sm transition-transform hover:border-green-500 hover:shadow-md active:scale-95">
        <CardImage card={card} className="h-full w-full object-cover" />
      </div>
      <p className="mt-1 line-clamp-2 text-[10px] leading-tight text-[var(--sp-muted)] sm:text-xs">
        {card.name}
      </p>
    </button>
  );

  const searchRow = (
    <div className="flex flex-wrap items-end gap-2">
      <div className="relative min-w-0 flex-1 basis-[min(100%,12rem)]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
        <input
          type="text"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setFilters((f) => ({ ...f, searchText: searchDraft }));
            }
          }}
          placeholder="カード名"
          className="w-full rounded-md border border-emerald-700 bg-white py-2 pl-9 pr-3 text-sm text-emerald-950 placeholder:text-emerald-600/70 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
        />
      </div>
      <button
        type="button"
        onClick={() => setFilterModalOpen(true)}
        className="flex h-11 w-[4.25rem] shrink-0 flex-col items-center justify-center gap-0.5 rounded-md border border-green-500 bg-green-600 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-green-500 sm:h-11 sm:w-11"
        title="絞り込み"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="leading-none">絞り込み</span>
      </button>
      <button
        type="button"
        onClick={cycleSort}
        className="flex h-11 w-[4.25rem] shrink-0 flex-col items-center justify-center gap-0.5 rounded-md border border-green-500 bg-green-600 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-green-500 sm:h-11 sm:w-11"
        title={sortLabel}
      >
        <ArrowDownUp className="h-4 w-4" />
        <span className="leading-none">{sortLabel}</span>
      </button>
    </div>
  );

  const cardBody =
    loading ? (
      <div className="flex min-h-[8rem] items-center justify-center text-sm text-[var(--sp-muted)]">
        読み込み中…
      </div>
    ) : error ? (
      <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
        カードを読み込めませんでした。通信またはデータベースの設定を確認してください。
        <br />
        <span className="mt-1 block font-mono text-xs opacity-90">{error}</span>
      </div>
    ) : sortedCards.length === 0 ? (
      <div className="flex min-h-[8rem] items-center justify-center px-2 text-center text-sm text-[var(--sp-muted)]">
        条件に合うカードがありません
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {sortedCards.map((card) => renderCardTile(card))}
      </div>
    );

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-green-200 bg-white shadow-sm ${className}`}
    >
      <div className="hidden shrink-0 border-b border-green-100 bg-green-50/80 px-2 py-1.5 text-xs font-medium text-green-900 sm:px-3 sm:text-sm lg:block">
        カード検索・追加
      </div>

      {/* モバイル: 中段＝縦スクロールのグリッド（横カルーセルは iOS で高さ 0 になりやすいため廃止） */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:hidden">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-zinc-50/90 p-2">{cardBody}</div>
        <div className="shrink-0 border-t border-green-200 bg-emerald-950 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {searchRow}
        </div>
      </div>

      {/* デスクトップ */}
      <div className="hidden min-h-0 flex-1 flex-col overflow-hidden lg:flex">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-green-200 bg-emerald-950 px-2 py-2 sm:px-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
            <input
              type="text"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setFilters((f) => ({ ...f, searchText: searchDraft }));
                }
              }}
              placeholder="カード名"
              className="w-full rounded-md border border-emerald-700 bg-white py-2 pl-9 pr-3 text-sm text-emerald-950 placeholder:text-emerald-600/70 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterModalOpen(true)}
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md border border-green-500 bg-green-600 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-green-500"
            title="絞り込み"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="leading-none">絞り込み</span>
          </button>
          <button
            type="button"
            onClick={cycleSort}
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md border border-green-500 bg-green-600 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-green-500"
            title={sortLabel}
          >
            <ArrowDownUp className="h-4 w-4" />
            <span className="leading-none">{sortLabel}</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-zinc-50/90 p-2 sm:p-3">{cardBody}</div>
      </div>

      <DeckFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
