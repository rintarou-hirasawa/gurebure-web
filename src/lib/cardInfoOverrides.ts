import type { Card } from '../types/card';

/**
 * DB の `cards.name` をキーに、表示用に上書きするフィールドだけを書く。
 * Supabase の値より優先される（マイグレーションを待たずに文言修正などに使える）。
 *
 * 画像は cardImageManifest.ts の CARD_IMAGE_MANIFEST を参照。
 */
export type CardInfoOverride = Partial<Omit<Card, 'id' | 'name'>>;

export const CARD_INFO_OVERRIDES: Record<string, CardInfoOverride> = {
  // 例:
  // '墓起こし': { effect_text: '・墓地からモンスター1体を場に出す。', cost: 1 },
};

export function applyCardInfoOverrides<C extends Card>(card: C): C {
  const o = CARD_INFO_OVERRIDES[card.name];
  if (!o) return card;
  return { ...card, ...o };
}
