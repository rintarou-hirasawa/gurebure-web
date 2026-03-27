/** 未入力デッキの一覧・確認用表示名（DB は空文字のまま） */
export const DEFAULT_DECK_DISPLAY_NAME = '新しいデッキ';

export function displayDeckName(name: string | null | undefined): string {
  const t = (name ?? '').trim();
  return t === '' ? DEFAULT_DECK_DISPLAY_NAME : t;
}
