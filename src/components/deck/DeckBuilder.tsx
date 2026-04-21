import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { useDeck } from '../../hooks/useDeck';
import DeckHeader from './DeckHeader';
import DeckCardList from './DeckCardList';
import CardSearchForDeck from './CardSearchForDeck';
import DeckListModal from './DeckListModal';
import { displayDeckName } from '../../lib/deckName';

export default function DeckBuilder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const deckId = searchParams.get('id');
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(deckId);
  const [showDeckListModal, setShowDeckListModal] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);
  const [showDeckSelector, setShowDeckSelector] = useState(false);

  const {
    deck,
    deckCards,
    decks,
    loading,
    error,
    createDeck,
    updateDeckName,
    addCardToDeck,
    removeCardFromDeck,
    clearDeck,
    calculateStats,
    refreshDecks,
    saveDeckExplicitly,
    deleteDeck,
  } = useDeck(currentDeckId);

  useEffect(() => {
    if (!deckId) {
      initializeDeck();
    }
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = 'デッキ作成';
    return () => {
      document.title = prev;
    };
  }, []);

  const initializeDeck = async () => {
    const newDeckId = await createDeck();
    if (newDeckId) {
      setCurrentDeckId(newDeckId);
      setSearchParams({ id: newDeckId });
    }
  };

  const handleOpenPreview = () => {
    setShowDeckListModal(true);
  };

  const handleSaveDeck = async () => {
    const s = calculateStats();
    if (s.mainDeckCount > 0 && s.uniqueCount < 1) {
      window.alert('ユニークカードを1枚デッキに入れてください（種類ごと1枚のみ）');
      return;
    }
    const { ok } = await saveDeckExplicitly();
    if (!ok) return;
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 4000);
  };

  const handleClear = () => {
    if (confirm('デッキをクリアしますか?')) {
      clearDeck();
    }
  };

  const handleLoadDeck = (selectedDeckId: string) => {
    setCurrentDeckId(selectedDeckId);
    setSearchParams({ id: selectedDeckId });
    setShowDeckSelector(false);
  };

  const handleNewDeck = async () => {
    const newDeckId = await createDeck();
    if (newDeckId) {
      setCurrentDeckId(newDeckId);
      setSearchParams({ id: newDeckId });
    }
  };

  const handleDeleteDeck = async (targetId: string, deckName: string) => {
    if (!window.confirm(`デッキ「${deckName}」を削除しますか？元に戻せません。`)) return;
    const result = await deleteDeck(targetId);
    if (!result.ok) return;
    if (result.wasCurrent) {
      if (result.nextDeckId) {
        setCurrentDeckId(result.nextDeckId);
        setSearchParams({ id: result.nextDeckId });
      } else {
        const newId = await createDeck();
        if (newId) {
          setCurrentDeckId(newId);
          setSearchParams({ id: newId });
        } else {
          setCurrentDeckId(null);
          setSearchParams({});
        }
      }
    }
  };

  const stats = calculateStats();

  if (loading && !deck) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--sp-bg)]">
        <div className="text-[var(--sp-muted)]">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[var(--sp-bg)]">
      <DeckHeader
        key={currentDeckId ?? 'no-deck'}
        deckName={deck?.name ?? ''}
        stats={stats}
        onNameChange={updateDeckName}
        onClear={handleClear}
        onOpenPreview={handleOpenPreview}
        onSaveDeck={handleSaveDeck}
        onDeleteDeck={
          currentDeckId
            ? () => void handleDeleteDeck(currentDeckId, displayDeckName(deck?.name))
            : undefined
        }
      />

      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col overflow-hidden px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
        <div className="mb-1.5 mt-1.5 flex shrink-0 flex-wrap gap-2 sm:mb-2 sm:mt-2">
          <button
            type="button"
            onClick={() => {
              refreshDecks();
              setShowDeckSelector(!showDeckSelector);
            }}
            className="sp-btn sp-btn--primary px-3 py-2 text-sm font-semibold sm:px-4"
          >
            保存されたデッキ
          </button>
          <button
            type="button"
            onClick={handleNewDeck}
            className="sp-btn px-3 py-2 text-sm font-semibold sm:px-4"
          >
            新規デッキ作成
          </button>
        </div>

        {showDeckSelector && (
          <div className="sp-panel mb-2 max-h-[min(40vh,320px)] shrink-0 overflow-y-auto p-3 sm:p-4">
            <h3 className="mb-3 text-lg font-bold text-[var(--sp-ink)]">保存されたデッキ一覧</h3>
            {decks.length === 0 ? (
              <p className="text-[var(--sp-muted)]">保存されたデッキがありません</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {decks.map((d) => (
                  <div
                    key={d.id}
                    className={`sp-deck-picker-item flex items-stretch gap-2 rounded border p-3 text-left transition-colors ${
                      d.id === currentDeckId ? 'sp-deck-picker-item--active' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleLoadDeck(d.id)}
                      className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sp-brass)]"
                    >
                      <div className="font-bold text-[var(--sp-ink)]">{displayDeckName(d.name)}</div>
                      <div className="text-sm text-[var(--sp-muted)]">{d.card_count || 0}枚</div>
                    </button>
                    <button
                      type="button"
                      title="デッキを削除"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteDeck(d.id, displayDeckName(d.name));
                      }}
                      className="sp-btn-icon shrink-0 self-start rounded p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {saveNotice && (
          <div className="mb-1.5 flex shrink-0 animate-fade-in items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-2 text-sm text-green-900 sm:p-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden />
            <span>デッキを保存しました。カードの追加・削除は操作のたびに自動で反映されています。</span>
          </div>
        )}

        {error && (
          <div className="mb-1.5 shrink-0 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-800 sm:p-3">
            {error}
          </div>
        )}

        {/*
          モバイル: 縦 flex で「デッキ → カード追加」に残り高さを必ず割り当てる（grid + min-h だけだと検索側が高さ0になり非表示になる）。
          デスクトップ: 従来どおり 2 カラムグリッド。
        */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:grid lg:min-h-0 lg:grid-cols-2 lg:items-stretch lg:gap-4 lg:[grid-template-rows:minmax(0,1fr)]">
          <section className="flex max-h-[min(40vh,320px)] min-h-0 shrink-0 flex-col overflow-hidden rounded-lg border border-green-200 bg-white lg:max-h-none lg:min-h-0 lg:shrink">
            <div className="shrink-0 border-b border-green-100 bg-green-50/80 px-2 py-1.5 text-xs font-medium text-green-900 sm:px-3 sm:text-sm">
              デッキリスト（{stats.totalCards}枚）
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-1 sm:p-2">
              <div className="h-full min-h-0 w-full overflow-y-auto overscroll-contain">
                <DeckCardList
                  deckCards={deckCards}
                  onRemoveCard={removeCardFromDeck}
                  compact
                  showNames={false}
                />
              </div>
            </div>
          </section>

          <section className="flex min-h-[12rem] flex-1 flex-col overflow-hidden lg:min-h-0">
            <CardSearchForDeck onAddCard={addCardToDeck} className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" />
          </section>
        </div>
      </div>

      <DeckListModal
        isOpen={showDeckListModal}
        onClose={() => setShowDeckListModal(false)}
        deckName={displayDeckName(deck?.name)}
        deckCards={deckCards}
      />
    </div>
  );
}
