/** public/card_illustrations/ に画像を置く。詳細は cardImageManifest.ts */

import { CARD_IMAGE_MANIFEST } from './cardImageManifest';

const PLACEHOLDER_RE = /via\.placeholder|placehold\.co|dummyimage\.com/i;

function isPlaceholderHttpUrl(url: string): boolean {
  return PLACEHOLDER_RE.test(url);
}

/** DB の URL をそのまま使うべきか（実画像の http(s)） */
export function isUsableRemoteImageUrl(url: string | null | undefined): boolean {
  const u = (url || '').trim();
  if (!u) return false;
  if (!u.startsWith('http://') && !u.startsWith('https://')) return false;
  return !isPlaceholderHttpUrl(u);
}

function resolveManifestEntry(fileOrPath: string): string | null {
  const f = fileOrPath.trim();
  if (!f || f.includes('..')) return null;
  if (f.startsWith('/')) return f;
  if (f.startsWith('http://') || f.startsWith('https://')) return f;
  return `/card_illustrations/${f}`;
}

/** マニフェストにも個別画像もないカード用（public/image.png） */
export const DEFAULT_CARD_IMAGE_SRC = '/image.png';

/**
 * 表示用の最初の画像 URL。
 * - 実 URL（http/https・プレースホルダ以外）または先頭が / のパスはそのまま
 * - CARD_IMAGE_MANIFEST[カード名] があればそれを優先（ローカル完結用）
 * - それ以外は `/image.png`（public/image.png）
 */
export function getCardImageSrc(card: { name: string; image_url?: string | null }): string {
  const raw = (card.image_url || '').trim();
  if (raw.startsWith('/')) return raw;
  if (isUsableRemoteImageUrl(raw)) return raw;

  const mapped = CARD_IMAGE_MANIFEST[card.name];
  if (mapped) {
    const resolved = resolveManifestEntry(mapped);
    if (resolved) return resolved;
  }

  return DEFAULT_CARD_IMAGE_SRC;
}
