import { Search, HelpCircle } from 'lucide-react';
import {
  SearchFilters,
  DEFAULT_SEARCH_FILTERS,
  POWER_FILTER_MIN,
  POWER_FILTER_MAX,
} from '../../types/card';

const CARD_TYPE_BUTTONS: { value: string; label: string }[] = [
  { value: '', label: 'すべて' },
  { value: 'モンスター', label: 'モンスター' },
  { value: '呪文', label: '呪文' },
  { value: '装備', label: '装備' },
  { value: 'フィールド', label: 'フィールド' },
  { value: 'マテリアル', label: 'マテリアル' },
];

const EXPANSIONS = ['', '一弾', '二弾', '三弾', '四弾', '五弾'] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (next: SearchFilters) => void;
};

export default function DeckFilterModal({ open, onClose, filters, onFiltersChange }: Props) {
  if (!open) return null;

  const set = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFiltersChange({ ...DEFAULT_SEARCH_FILTERS });
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="カード絞り込み"
      onClick={onClose}
    >
      <div
        className="max-h-[min(92dvh,720px)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-green-200 bg-white shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-[1] flex items-center justify-between border-b border-green-100 bg-green-50/90 px-4 py-3 backdrop-blur-sm">
          <h2 className="text-sm font-bold text-green-950">絞り込み</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100"
          >
            閉じる
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-[var(--sp-muted)]">カードタイプ</p>
            <div className="flex flex-wrap gap-1.5">
              {CARD_TYPE_BUTTONS.map(({ value, label }) => (
                <button
                  key={value || 'all'}
                  type="button"
                  onClick={() => set('cardType', value)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                    filters.cardType === value
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-green-200 bg-white text-green-900 hover:bg-green-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-[var(--sp-muted)]">種族表記</p>
            <div className="flex flex-col gap-2">
              {(
                [
                  ['all', '全て'],
                  ['multi', '複数種族のみ（種族に / を含む）'],
                  ['mono', '単一種族のみ'],
                ] as const
              ).map(([val, label]) => (
                <label key={val} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="deckRaceComplexity"
                    checked={filters.raceComplexity === val}
                    onChange={() => set('raceComplexity', val)}
                    className="h-4 w-4 border-green-300 text-green-600 focus:ring-green-600"
                  />
                  <span className="text-sm text-[var(--sp-ink)]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--sp-muted)]">
                カードタイプ（一覧）
              </label>
              <select
                value={filters.cardType}
                onChange={(e) => set('cardType', e.target.value)}
                className="sp-input w-full text-sm"
              >
                <option value="">選択</option>
                {CARD_TYPE_BUTTONS.filter((b) => b.value).map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--sp-muted)]">種族</label>
              <input
                type="text"
                value={filters.race}
                onChange={(e) => set('race', e.target.value)}
                placeholder="種族を入力"
                className="sp-input w-full text-sm"
              />
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-[var(--sp-muted)]">コスト</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={filters.costMin}
                onChange={(e) => set('costMin', parseInt(e.target.value, 10) || 0)}
                className="sp-input w-full max-w-[5.5rem] text-sm"
              />
              <span className="text-[var(--sp-muted)]">～</span>
              <input
                type="number"
                min={0}
                value={filters.costMax}
                onChange={(e) => set('costMax', parseInt(e.target.value, 10) || 15)}
                className="sp-input w-full max-w-[5.5rem] text-sm"
              />
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-[var(--sp-muted)]">
              パワー（{POWER_FILTER_MIN}～{POWER_FILTER_MAX}）
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={POWER_FILTER_MIN}
                max={POWER_FILTER_MAX}
                value={filters.powerMin}
                onChange={(e) =>
                  set(
                    'powerMin',
                    Math.min(
                      POWER_FILTER_MAX,
                      Math.max(POWER_FILTER_MIN, parseInt(e.target.value, 10) || POWER_FILTER_MIN)
                    )
                  )
                }
                className="sp-input w-full max-w-[6rem] text-sm"
              />
              <span className="text-[var(--sp-muted)]">～</span>
              <input
                type="number"
                min={POWER_FILTER_MIN}
                max={POWER_FILTER_MAX}
                value={filters.powerMax}
                onChange={(e) =>
                  set(
                    'powerMax',
                    Math.min(
                      POWER_FILTER_MAX,
                      Math.max(POWER_FILTER_MIN, parseInt(e.target.value, 10) || POWER_FILTER_MAX)
                    )
                  )
                }
                className="sp-input w-full max-w-[6rem] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--sp-muted)]">弾・シリーズ</label>
            <select
              value={filters.expansion}
              onChange={(e) => set('expansion', e.target.value)}
              className="sp-input w-full text-sm"
            >
              {EXPANSIONS.map((ex) => (
                <option key={ex || 'all'} value={ex}>
                  {ex === '' ? '選択（すべて）' : ex}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--sp-muted)]">タグ</label>
            <select
              value={
                filters.isUnique === true ? 'unique' : filters.isUnique === false ? 'nonunique' : ''
              }
              onChange={(e) => {
                const v = e.target.value;
                set('isUnique', v === 'unique' ? true : v === 'nonunique' ? false : null);
              }}
              className="sp-input w-full text-sm"
            >
              <option value="">選択</option>
              <option value="unique">ユニークカードのみ</option>
              <option value="nonunique">ユニーク以外</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--sp-muted)]">テキスト</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--sp-muted)]" />
              <input
                type="text"
                value={filters.searchText}
                onChange={(e) => set('searchText', e.target.value)}
                placeholder="カード名"
                className="sp-input w-full py-2 pl-9 pr-3 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-green-100 bg-green-50/50 px-4 py-3">
          <button
            type="button"
            title="ヘルプ"
            className="rounded p-1 text-green-700 hover:bg-green-100"
            aria-label="ヘルプ"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-medium text-green-700 underline decoration-green-400 underline-offset-2 hover:text-green-900"
          >
            全条件クリア
          </button>
        </div>
      </div>
    </div>
  );
}
