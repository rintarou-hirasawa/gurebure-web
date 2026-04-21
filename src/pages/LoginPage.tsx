import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register, signInWithGoogle, takePostLoginRedirectPath } from '../lib/auth';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/** OAuth コールバック失敗時、URL の ?error / #error を読んで表示し、クエリを消す */
function readOAuthCallbackError(search: string, hash: string): string | null {
  const q = new URLSearchParams(search);
  let err = q.get('error');
  let desc = q.get('error_description');
  if (!err && !desc && hash) {
    const h = hash.startsWith('#') ? hash.slice(1) : hash;
    const hq = new URLSearchParams(h);
    err = hq.get('error');
    desc = hq.get('error_description');
  }
  if (!err && !desc) return null;
  const raw = (desc || err || '').replace(/\+/g, ' ');
  let message: string;
  try {
    message = decodeURIComponent(raw);
  } catch {
    message = raw;
  }
  if (message.includes('Unable to exchange external code')) {
    return (
      'Google ログインのトークン交換に失敗しました。' +
      'Supabase の「Sign In / Providers → Google」の Client ID / Client Secret が Google Cloud の OAuth クライアントと一致しているか確認してください。' +
      '同じブラウザで「Googleで続ける」からやり直すか、シークレットウィンドウで試してください。' +
      'それでもダメなら、下の ID / パスワードでログインできます。'
    );
  }
  return message || 'ログインに失敗しました';
}

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, refreshUser } = useAuth();

  useEffect(() => {
    const oauthMsg = readOAuthCallbackError(location.search, location.hash);
    if (oauthMsg) {
      setError(oauthMsg);
      navigate('/login', { replace: true });
    }
  }, [location.search, location.hash, navigate]);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(takePostLoginRedirectPath(), { replace: true });
    }
  }, [authLoading, user, navigate]);

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
      await refreshUser();
      // 遷移は user 更新後の useEffect（takePostLoginRedirectPath）に任せる
    } else {
      setError(result.error || '処理に失敗しました');
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    setGoogleLoading(false);
    if (err) {
      setError(err);
    }
  };

  const oauthReturning = new URLSearchParams(location.search).has('code');

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[var(--sp-bg)] p-4 text-sm text-[var(--sp-muted)]">
        <span>{oauthReturning ? 'Google ログインを確定しています…' : '読み込み中…'}</span>
        {oauthReturning && (
          <span className="max-w-sm text-center text-xs text-[var(--sp-muted)]">
            認証コードの検証と Supabase への接続のため、数秒かかることがあります。
          </span>
        )}
      </div>
    );
  }

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

        <div className="mb-6">
          <button
            type="button"
            onClick={() => void handleGoogle()}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? 'Google に移動中…' : 'Googleで続ける'}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--sp-border)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--sp-panel)] px-2 text-[var(--sp-muted)]">または ID / パスワード</span>
          </div>
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
            disabled={loading || googleLoading}
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
