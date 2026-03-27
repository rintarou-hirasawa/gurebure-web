import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../lib/auth';
import { LogIn, UserPlus } from 'lucide-react';

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!userId.trim() || !password.trim()) {
      setError('ユーザーIDとパスワードを入力してください');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError('パスワードは4文字以上で入力してください');
      setLoading(false);
      return;
    }

    const result = isRegister
      ? await register(userId, password)
      : await login(userId, password);

    setLoading(false);

    if (result.success) {
      navigate('/matchmaking');
    } else {
      setError(result.error || '処理に失敗しました');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--sp-bg)] p-4">
      <div className="sp-panel sp-panel--elevated w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="sp-display mb-2 text-3xl font-semibold text-[var(--sp-ink)]">
            デュエルマスターズ TCG
          </h1>
          <p className="text-[var(--sp-muted)]">
            {isRegister ? 'アカウント新規登録' : 'ログイン'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--sp-parchment)]">
              ユーザーID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="sp-input"
              placeholder="ユーザーIDを入力"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--sp-parchment)]">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="sp-input"
              placeholder="パスワードを入力"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="sp-btn sp-btn--primary w-full justify-center py-3 text-base font-bold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              '処理中...'
            ) : isRegister ? (
              <>
                <UserPlus size={20} />
                新規登録
              </>
            ) : (
              <>
                <LogIn size={20} />
                ログイン
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="font-medium text-green-700 hover:text-green-900 transition-colors"
          >
            {isRegister
              ? 'すでにアカウントをお持ちの方はこちら'
              : '新規アカウント登録はこちら'}
          </button>
        </div>
      </div>
    </div>
  );
}
