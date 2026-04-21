/** public/card_illustrations/ に「カード名」と同じファイル名（.jpg 推奨、なければ .png）で置く */

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

/**
 * 表示用の最初の画像 URL。
 * - 実 URL（http/https・プレースホルダ以外）または先頭が / のパスはそのまま
 * - それ以外はローカル `/card_illustrations/<URLエンコードしたカード名>.jpg`
 */
export function getCardImageSrc(card: { name: string; image_url?: string | null }): string {
  const raw = (card.image_url || '').trim();
  if (raw.startsWith('/')) return raw;
  if (isUsableRemoteImageUrl(raw)) return raw;
  return `/card_illustrations/${encodeURIComponent(card.name)}.jpg`;
}
