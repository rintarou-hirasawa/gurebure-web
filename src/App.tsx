import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Plus, Gamepad2, LogOut, LogIn } from 'lucide-react';
import { APP_TITLE_EN, APP_TITLE_JA } from './lib/branding';
import CardSearchPage from './pages/CardSearchPage';
import DeckBuilder from './components/deck/DeckBuilder';
import { MatchmakingPage } from './pages/MatchmakingPage';
import { GamePageNew } from './pages/GamePageNew';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import LobbyPage from './pages/LobbyPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { POST_LOGIN_REDIRECT_KEY } from './lib/auth';
import { OAuthCodeRootRedirect } from './components/OAuthCodeRootRedirect';

/** デッキ作成・オンライン対戦など、ログイン後に戻るパス（OAuth 後も保持するため sessionStorage） */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--sp-muted)]">
        読み込み中…
      </div>
    );
  }
  if (!user) {
    try {
      sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, location.pathname + location.search);
    } catch {
      /* ignore */
    }
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    void logoutUser().then(() => navigate('/login'));
  };

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-green-200/80 text-green-950'
        : 'text-[var(--sp-ink)] hover:bg-green-100'
    }`;

  return (
    <header className="relative z-30 shrink-0 border-b border-green-200 bg-green-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <Link to="/" className="min-w-0 flex-1 hover:opacity-90" onClick={() => setMenuOpen(false)}>
          <div className="sp-display truncate text-base font-bold leading-tight text-[var(--sp-ink)] sm:text-lg">
            {APP_TITLE_EN}
          </div>
          <div className="mt-0.5 truncate text-[10px] leading-tight text-[var(--sp-muted)] sm:text-xs">
            {APP_TITLE_JA}
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-green-300 bg-white text-green-900 shadow-sm transition-colors hover:bg-green-100"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        >
          {menuOpen ? <X className="h-6 w-6" strokeWidth={2} /> : <Menu className="h-6 w-6" strokeWidth={2} />}
        </button>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            aria-label="メニューを閉じる"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,20rem)] flex-col border-l border-green-200 bg-green-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-green-200 px-3 py-3">
              <span className="text-sm font-semibold text-[var(--sp-ink)]">メニュー</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-green-900 hover:bg-green-100"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
              <Link to="/" className={navLinkClass('/')} onClick={() => setMenuOpen(false)}>
                カード検索
              </Link>
              <Link to="/deck" className={navLinkClass('/deck')} onClick={() => setMenuOpen(false)}>
                <Plus className="h-4 w-4 shrink-0 text-green-700" />
                デッキ作成
              </Link>
              <Link to="/matchmaking" className={navLinkClass('/matchmaking')} onClick={() => setMenuOpen(false)}>
                <Gamepad2 className="h-4 w-4 shrink-0 text-slate-600" />
                オンライン対戦
              </Link>
            </nav>
            <div className="border-t border-green-200 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {user ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[var(--sp-muted)]">
                    ユーザー: <span className="font-semibold text-[var(--sp-ink)]">{user.user_id}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="sp-btn sp-btn--danger flex w-full items-center justify-center gap-2 text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    ログアウト
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="sp-btn sp-btn--primary flex w-full items-center justify-center gap-2 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

/** 対戦中はスマホで青ヘッダーを隠し、PC幅では従来どおり表示 */
function AppShellWithHeader() {
  const location = useLocation();
  const hideBlueHeaderOnMobileGame = location.pathname === '/game';

  const deckRoute = location.pathname === '/deck';

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-[var(--sp-bg)]">
      <div className={hideBlueHeaderOnMobileGame ? 'hidden shrink-0 lg:block' : 'shrink-0'}>
        <Header />
      </div>
      <main
        className={`flex min-h-0 flex-1 flex-col ${deckRoute ? 'overflow-y-auto overflow-x-hidden' : 'overflow-y-auto'}`}
      >
        <Routes>
        <Route
          path="/"
          element={
            <OAuthCodeRootRedirect>
              <CardSearchPage />
            </OAuthCodeRootRedirect>
          }
        />
        <Route
          path="/deck"
          element={
            <ProtectedRoute>
              <DeckBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matchmaking"
          element={
            <ProtectedRoute>
              <MatchmakingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-room"
          element={
            <ProtectedRoute>
              <CreateRoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-room"
          element={
            <ProtectedRoute>
              <JoinRoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lobby"
          element={
            <ProtectedRoute>
              <LobbyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GamePageNew />
            </ProtectedRoute>
          }
        />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AppShellWithHeader />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
