import { useNavigate } from 'react-router-dom';
import { Users, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/** 従来の「オンライン対戦」部屋作成・検索メニュー */
export function OnlineBattleMenuPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const devWithoutLogin = import.meta.env.DEV && !user;

  return (
    <div className="min-h-screen bg-[var(--sp-bg)]">
      <div className="container mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate('/battle')}
          className="mb-6 flex items-center gap-2 text-[var(--sp-parchment)] transition-colors hover:text-[var(--sp-brass)]"
        >
          <ArrowLeft size={20} />
          <span>対戦表示に戻る</span>
        </button>

        {devWithoutLogin && (
          <div
            className="mx-auto mb-6 max-w-2xl rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-sm text-green-950"
            role="status"
          >
            <strong className="font-semibold text-green-800">開発モード</strong>
            ：ログインなしでこの画面を表示しています。本番ビルドではログインが必要です。部屋作成・参加でデッキが必要な場合はログインしてください。
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          <h1 className="sp-display mb-8 text-center text-4xl font-semibold text-[var(--sp-ink)]">
            オンライン対戦
          </h1>

          <div className="grid gap-6">
            <button
              type="button"
              onClick={() => navigate('/create-room')}
              className="sp-panel sp-panel--elevated rounded-xl p-8 text-left transition-all hover:border-green-200"
            >
              <div className="mb-3 flex items-center justify-center gap-4">
                <Users size={32} className="text-green-600" />
                <h2 className="text-2xl font-semibold text-[var(--sp-ink)]">部屋を作成</h2>
              </div>
              <p className="text-center text-[var(--sp-muted)]">あいことばを設定して対戦部屋を作成します</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/join-room')}
              className="sp-panel sp-panel--elevated rounded-xl p-8 text-left transition-all hover:border-green-200"
            >
              <div className="mb-3 flex items-center justify-center gap-4">
                <Search size={32} className="text-slate-500" />
                <h2 className="text-2xl font-semibold text-[var(--sp-ink)]">部屋を検索</h2>
              </div>
              <p className="text-center text-[var(--sp-muted)]">あいことばを入力して部屋に参加します</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/deck')}
              className="sp-btn w-full justify-center rounded-xl py-6 text-lg font-medium"
            >
              デッキ編集に戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
