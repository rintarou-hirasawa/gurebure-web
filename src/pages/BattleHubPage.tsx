import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, UserCircle2 } from 'lucide-react';

/** 対戦表示トップ: オンライン対戦 / 一人回し */
export function BattleHubPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--sp-bg)]">
      <div className="container mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-[var(--sp-parchment)] transition-colors hover:text-[var(--sp-brass)]"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>

        <div className="mx-auto max-w-2xl">
          <h1 className="sp-display mb-2 text-center text-3xl font-semibold text-[var(--sp-ink)] sm:text-4xl">
            対戦表示
          </h1>
          <p className="mb-8 text-center text-sm text-[var(--sp-muted)]">プレイ形式を選んでください</p>

          <div className="grid gap-5">
            <button
              type="button"
              onClick={() => navigate('/battle/online')}
              className="sp-panel sp-panel--elevated rounded-xl p-7 text-left transition-all hover:border-green-200"
            >
              <div className="mb-3 flex items-center justify-center gap-3">
                <Gamepad2 size={32} className="text-green-600" />
                <h2 className="text-xl font-semibold text-[var(--sp-ink)] sm:text-2xl">オンライン対戦</h2>
              </div>
              <p className="text-center text-sm text-[var(--sp-muted)] sm:text-base">
                部屋を作成・検索してネットワーク対戦を行います
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/battle/solo')}
              className="sp-panel sp-panel--elevated rounded-xl p-7 text-left transition-all hover:border-green-200"
            >
              <div className="mb-3 flex items-center justify-center gap-3">
                <UserCircle2 size={32} className="text-slate-600" />
                <h2 className="text-xl font-semibold text-[var(--sp-ink)] sm:text-2xl">一人回し</h2>
              </div>
              <p className="text-center text-sm text-[var(--sp-muted)] sm:text-base">
                デッキを二つ選び、ターン交代で双方を同じ画面から操作します（相手の手札・シールドも常に表示）
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
