import { Search, ChevronDown } from 'lucide-react';
import { SearchFilters, POWER_FILTER_MIN, POWER_FILTER_MAX } from '../types/card';
import { useState } from 'react';

interface SearchFilterProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const sectionToggle =
  'w-full flex items-center justify-between border-t border-green-100 bg-green-50/70 px-4 py-3 transition-colors hover:bg-green-100';

const radioClass =
  'h-4 w-4 border-green-300 text-[var(--sp-brass)] focus:ring-[var(--sp-brass)]';

export default function SearchFilter({ filters, onFilterChange }: SearchFilterProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic', 'type', 'cost', 'power', 'raceKind'])
  );

  const handleChange = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="sp-panel overflow-hidden">
      <div className="border-b border-green-200 bg-green-100 px-4 py-3 text-sm font-semibold text-green-950">
        フリーワード検索
      </div>

      <div className="space-y-2 px-4 py-3">
        <div className="relative">
          <input
            type="text"
            value={filters.searchText}
            onChange={(e) => handleChange('searchText', e.target.value)}
            placeholder="カード名、フィールド、マテリアルを入力"
            className="sp-input w-full py-2 pl-9 pr-3 text-sm"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--sp-muted)]" />
        </div>
        <p className="pl-1 text-xs text-[var(--sp-muted)]">
          カード名、フィールド名、マテリアル名で検索できます
        </p>
      </div>

      <div>
        <button type="button" onClick={() => toggleSection('type')} className={sectionToggle}>
          <span className="text-sm font-bold text-[var(--sp-ink)]">カードタイプ</span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--sp-muted)] transition-transform ${
              expandedSections.has('type') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.has('type') && (
          <div className="space-y-2 px-4 py-3">
            {['すべて', 'モンスター', '呪文', '装備', 'フィールド', 'マテリアル'].map((type) => (
              <label key={type} className="flex cursor-pointer items-center space-x-2">
                <input
                  type="radio"
                  name="cardType"
                  checked={filters.cardType === (type === 'すべて' ? '' : type)}
                  onChange={() => handleChange('cardType', type === 'すべて' ? '' : type)}
                  className={radioClass}
                />
                <span className="text-sm text-[var(--sp-parchment)]">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <button type="button" onClick={() => toggleSection('expansion')} className={sectionToggle}>
          <span className="text-sm font-bold text-[var(--sp-ink)]">弾</span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--sp-muted)] transition-transform ${
              expandedSections.has('expansion') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.has('expansion') && (
          <div className="space-y-2 px-4 py-3">
            {['すべて', '一弾', '二弾', '三弾', '四弾'].map((exp) => (
              <label key={exp} className="flex cursor-pointer items-center space-x-2">
                <input
                  type="radio"
                  name="expansion"
                  checked={filters.expansion === (exp === 'すべて' ? '' : exp)}
                  onChange={() => handleChange('expansion', exp === 'すべて' ? '' : exp)}
                  className={radioClass}
                />
                <span className="text-sm text-[var(--sp-parchment)]">{exp}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <button type="button" onClick={() => toggleSection('raceKind')} className={sectionToggle}>
          <span className="text-sm font-bold text-[var(--sp-ink)]">種族表記</span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--sp-muted)] transition-transform ${
              expandedSections.has('raceKind') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.has('raceKind') && (
          <div className="space-y-2 px-4 py-3">
            {(
              [
                ['all', '全て'],
                ['multi', '複数種族のみ（/ を含む）'],
                ['mono', '単一種族のみ'],
              ] as const
            ).map(([val, label]) => (
              <label key={val} className="flex cursor-pointer items-center space-x-2">
                <input
                  type="radio"
                  name="raceComplexity"
                  checked={filters.raceComplexity === val}
                  onChange={() => handleChange('raceComplexity', val)}
                  className={radioClass}
                />
                <span className="text-sm text-[var(--sp-parchment)]">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <button type="button" onClick={() => toggleSection('race')} className={sectionToggle}>
          <span className="text-sm font-bold text-[var(--sp-ink)]">種族</span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--sp-muted)] transition-transform ${
              expandedSections.has('race') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.has('race') && (
          <div className="px-4 py-3">
            <input
              type="text"
              value={filters.race}
              onChange={(e) => handleChange('race', e.target.value)}
              placeholder="種族を入力"
              className="sp-input text-sm"
            />
          </div>
        )}
      </div>

      <div>
        <button type="button" onClick={() => toggleSection('cost')} className={sectionToggle}>
          <span className="text-sm font-bold text-[var(--sp-ink)]">コスト</span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--sp-muted)] transition-transform ${
              expandedSections.has('cost') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.has('cost') && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={filters.costMin}
                onChange={(e) => handleChange('costMin', parseInt(e.target.value) || 0)}
                className="sp-input w-20 py-1.5 text-sm"
              />
              <span className="text-sm text-[var(--sp-muted)]">～</span>
              <input
                type="number"
                min="0"
                value={filters.costMax}
                onChange={(e) => handleChange('costMax', parseInt(e.target.value) || 15)}
                className="sp-input w-20 py-1.5 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <button type="button" onClick={() => toggleSection('power')} className={sectionToggle}>
          <span className="text-sm font-bold text-[var(--sp-ink)]">パワー</span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--sp-muted)] transition-transform ${
              expandedSections.has('power') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.has('power') && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={POWER_FILTER_MIN}
                max={POWER_FILTER_MAX}
                value={filters.powerMin}
                onChange={(e) =>
                  handleChange(
                    'powerMin',
                    Math.min(
                      POWER_FILTER_MAX,
                      Math.max(POWER_FILTER_MIN, parseInt(e.target.value, 10) || POWER_FILTER_MIN)
                    )
                  )
                }
                className="sp-input w-24 py-1.5 text-sm"
              />
              <span className="text-sm text-[var(--sp-muted)]">～</span>
              <input
                type="number"
                min={POWER_FILTER_MIN}
                max={POWER_FILTER_MAX}
                value={filters.powerMax}
                onChange={(e) =>
                  handleChange(
                    'powerMax',
                    Math.min(
                      POWER_FILTER_MAX,
                      Math.max(POWER_FILTER_MIN, parseInt(e.target.value, 10) || POWER_FILTER_MAX)
                    )
                  )
                }
                className="sp-input w-24 py-1.5 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <button type="button" onClick={() => toggleSection('unique')} className={sectionToggle}>
          <span className="text-sm font-bold text-[var(--sp-ink)]">その他</span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--sp-muted)] transition-transform ${
              expandedSections.has('unique') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.has('unique') && (
          <div className="px-4 py-3">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.isUnique === true}
                onChange={(e) => handleChange('isUnique', e.target.checked ? true : null)}
                className={radioClass}
              />
              <span className="text-sm text-[var(--sp-parchment)]">ユニークカードのみ</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
