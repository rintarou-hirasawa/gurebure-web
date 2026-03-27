import { useState, useEffect, useRef } from 'react';
import { Trash2, Eye, Save, FolderX } from 'lucide-react';
import { DeckStats } from '../../types/deck';

interface DeckHeaderProps {
  deckName: string;
  stats: DeckStats;
  onNameChange: (name: string) => void;
  onClear: () => void;
  onOpenPreview: () => void;
  onSaveDeck: () => void | Promise<void>;
  onDeleteDeck?: () => void;
}

export default function DeckHeader({
  deckName,
  stats,
  onNameChange,
  onClear,
  onOpenPreview,
  onSaveDeck,
  onDeleteDeck,
}: DeckHeaderProps) {
  const [draftName, setDraftName] = useState(deckName);
  const onNameChangeRef = useRef(onNameChange);
  onNameChangeRef.current = onNameChange;

  /** deckId 変更時は親の key で再マウントされ初期値が入る。ここではサーバー同期で draft を上書きしない（入力中の上書き防止）。 */
  useEffect(() => {
    const t = setTimeout(() => {
      const next = draftName.trim();
      const current = (deckName ?? '').trim();
      if (next === current) return;
      void onNameChangeRef.current(next);
    }, 400);
    return () => clearTimeout(t);
  }, [draftName, deckName]);

  const flushNameThen = async (action: () => void | Promise<void>) => {
    const next = draftName.trim();
    const current = (deckName ?? '').trim();
    if (next !== current) {
      await Promise.resolve(onNameChangeRef.current(next));
    }
    await Promise.resolve(action());
  };

  return (
    <div className="shrink-0 border-b border-[var(--sp-border)] bg-[var(--sp-panel)] text-[var(--sp-ink)]">
      <div className="container mx-auto px-2 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="sp-display text-lg font-semibold tracking-tight text-[var(--sp-ink)] sm:text-2xl">
              デッキ作成
            </div>
            <p className="mt-1 text-xs text-[var(--sp-muted)] sm:text-sm">
              カードは追加時に自動保存されます
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {onDeleteDeck && (
              <button
                type="button"
                onClick={onDeleteDeck}
                className="sp-btn sp-btn--ghost flex items-center gap-1 px-2 py-1.5 text-xs text-[var(--sp-rust)] sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
                title="このデッキを削除"
              >
                <FolderX className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">デッキ削除</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClear}
              className="sp-btn sp-btn--danger flex items-center gap-1 px-2 py-1.5 text-xs sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
              title="全削除"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">全削除</span>
            </button>
            <button
              type="button"
              onClick={onOpenPreview}
              className="sp-btn flex items-center gap-1 px-3 py-2 text-sm font-medium sm:gap-2 sm:px-4 sm:py-2.5 sm:text-base"
              title="メインカードの並びを確認"
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>デッキ確認</span>
            </button>
            <button
              type="button"
              onClick={() => void flushNameThen(onSaveDeck)}
              className="sp-btn sp-btn--primary flex items-center gap-1 px-3 py-2 text-sm font-medium sm:gap-2 sm:px-5 sm:py-2.5 sm:text-base"
              title="デッキを保存（ルール確認・一覧の更新）"
            >
              <Save className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>保存</span>
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:mt-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <label className="whitespace-nowrap text-xs text-[var(--sp-muted)] sm:text-sm">デッキ名:</label>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="sp-input flex-1 text-sm sm:w-48 sm:flex-none"
              placeholder="デッキ名を入力"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
            <div
              className={`rounded border border-[var(--sp-border)] bg-zinc-100 px-2 py-1 sm:px-3 sm:py-1.5 ${
                stats.mainDeckCount === 40
                  ? 'ring-2 ring-[var(--sp-brass)]'
                  : stats.mainDeckCount > 40
                    ? 'ring-2 ring-[var(--sp-rust)]'
                    : ''
              }`}
            >
              <span className="text-[var(--sp-muted)]">メイン:</span>{' '}
              <span className="font-bold text-[var(--sp-ink)]">{stats.mainDeckCount}</span>
              <span className="text-[var(--sp-muted)]"> / 40</span>
            </div>
            <div className="rounded border border-[var(--sp-border)] bg-zinc-100 px-2 py-1 sm:px-3 sm:py-1.5">
              <span className="text-[var(--sp-muted)]">ユニーク:</span>{' '}
              <span className="font-bold text-[var(--sp-ink)]">{stats.uniqueCount}</span>
              <span className="text-[var(--sp-muted)]"> 枚</span>
            </div>
            {stats.mainDeckCount > 0 && stats.uniqueCount < 1 && (
              <span className="rounded border border-green-300 bg-green-100 px-2 py-1 text-green-900">
                ユニークを1枚入れてください
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
