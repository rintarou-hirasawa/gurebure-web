import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { useDeck } from '../hooks/useDeck';

/** 一人回し: デッキ二つを選んで開始 */
export function SoloSetupPage() {
  const navigate = useNavigate();
  const { decks, loading } = useDeck();

  const [deck1Id, setDeck1Id] = useState('');
  const [deck2Id, setDeck2Id] = useState('');

  const start = () => {
    if (!deck1Id || !deck2Id) return;
    const q = new URLSearchParams({ deck1: deck1Id, deck2: deck2Id });
    navigate(`/game/solo?${q.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[var(--sp-bg)]">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <button
          type="button"
          onClick={() => navigate('/battle')}
          className="mb-6 flex items-center gap-2 text-[var(--sp-parchment)] transition-colors hover:text-[var(--sp-brass)]"
        >
          <ArrowLeft size={20} />
          <span>対戦表示に戻る</span>
        </button>

        <h1 className="sp-display mb-2 text-2xl font-semibold text-[var(--sp-ink)] sm:text-3xl">一人回し</h1>
        <p className="mb-8 text-sm text-[var(--sp-muted)] sm:text-base">
          プレイヤー1・プレイヤー2のデッキを選びます。同じデッキを二回選んでもかまいません。開始後はターン終了のたびに操作側が切り替わります。
        </p>

        {loading ? (
          <p className="text-[var(--sp-muted)]">デッキ一覧を読み込み中…</p>
        ) : decks.length === 0 ? (
          <div className="rounded-xl border border-[var(--sp-border)] bg-[var(--sp-panel)] p-6 text-center">
            <p className="mb-4 text-[var(--sp-parchment)]">デッキがありません。先にデッキを作成してください。</p>
            <button type="button" className="sp-btn sp-btn--primary rounded-lg px-4 py-2" onClick={() => navigate('/deck')}>
              デッキ作成へ
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--sp-ink)]">プレイヤー1のデッキ</span>
              <select
                className="w-full rounded-lg border border-green-300 bg-white px-3 py-3 text-[var(--sp-ink)] shadow-sm"
                value={deck1Id}
                onChange={e => setDeck1Id(e.target.value)}
              >
                <option value="">選んでください</option>
                {decks.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}（{d.card_count ?? 0}枚）
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--sp-ink)]">プレイヤー2のデッキ</span>
              <select
                className="w-full rounded-lg border border-green-300 bg-white px-3 py-3 text-[var(--sp-ink)] shadow-sm"
                value={deck2Id}
                onChange={e => setDeck2Id(e.target.value)}
              >
                <option value="">選んでください</option>
                {decks.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}（{d.card_count ?? 0}枚）
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              disabled={!deck1Id || !deck2Id}
              onClick={start}
              className="sp-btn sp-btn--primary flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-5 w-5" />
              対戦をはじめる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
