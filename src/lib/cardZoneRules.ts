import type { CardInGame } from '../types/game';
import type { Zone } from '../types/game';

/**
 * 呪文カードか（type / card_type のいずれかに「呪文」を含む）
 * モンスター・装備・フィールド・マテリアル・クリーチャー等は BZ へ、その他非呪文も従来どおり BZ。
 */
export function isSpellTypeCard(card: CardInGame): boolean {
  const raw = `${card.type ?? ''} ${card.card_type ?? ''}`;
  return raw.includes('呪文');
}

/** 「バトルゾーンに出す」意図の移動。呪文のみ墓地へ送る。 */
export function resolveBattlePlayDestination(card: CardInGame, requestedToZone: Zone): Zone {
  if (requestedToZone === 'battle' && isSpellTypeCard(card)) return 'graveyard';
  return requestedToZone;
}
