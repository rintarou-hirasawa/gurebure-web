export interface Card {
  id: string;
  name: string;
  card_type: string;
  type?: string;
  cost: number;
  power: number | null;
  race: string | null;
  civilization?: string;
  rarity?: string;
  abilities: string[];
  effect_text: string;
  ability?: string;
  image_url: string;
  set_number: string;
  expansion?: string;
  is_unique: boolean;
  created_at: string;
}

export interface SearchFilters {
  searchText: string;
  cardType: string;
  race: string;
  expansion: string;
  costMin: number;
  costMax: number;
  powerMin: number;
  powerMax: number;
  isUnique: boolean | null;
  /** 種族テキストに「/」を含むか（複数種族 vs 単一） */
  raceComplexity: 'all' | 'multi' | 'mono';
}

/** パワー絞り込みの表示・既定レンジ（1000〜10000＝全範囲扱いでクエリしない） */
export const POWER_FILTER_MIN = 1000;
export const POWER_FILTER_MAX = 10000;

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  searchText: '',
  cardType: '',
  race: '',
  expansion: '',
  costMin: 0,
  costMax: 15,
  powerMin: POWER_FILTER_MIN,
  powerMax: POWER_FILTER_MAX,
  isUnique: null,
  raceComplexity: 'all',
};
