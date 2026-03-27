import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Sword, Plus, Gamepad2, LogOut } from 'lucide-react';
import CardSearchPage from './pages/CardSearchPage';
import DeckBuilder from './components/deck/DeckBuilder';
import { MatchmakingPage } from './pages/MatchmakingPage';
import { GamePageNew } from './pages/GamePageNew';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import LobbyPage from './pages/LobbyPage';
import { LoginPage } from './pages/LoginPage';
import { getCurrentUser, logout } from './lib/auth';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

/** 本番はログイン必須。開発時は UI / デバッグのため未ログインでもオンライン対戦フローに入れる */
function OnlineFlowRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  if (!user && !import.meta.env.DEV) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function Header() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-green-200 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6 flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <Sword className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="sp-display text-2xl font-bold text-[var(--sp-ink)]">Brave Grave</h1>
                <p className="text-xs text-[var(--sp-muted)]">カード検索</p>
              </div>
            </Link>

            <nav className="flex items-center gap-3 flex-wrap">
              <Link to="/" className="sp-nav-link">
                カード検索
              </Link>
              <Link to="/deck" className="sp-nav-pill sp-nav-pill--accent">
                <Plus className="h-4 w-4 text-green-600" />
                デッキ作成
              </Link>
              <Link to="/matchmaking" className="sp-nav-pill">
                <Gamepad2 className="h-4 w-4 text-slate-500" />
                オンライン対戦
              </Link>
            </nav>
          </div>

          {user && (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-[var(--sp-parchment)]">
                ユーザー: <span className="font-bold text-[var(--sp-ink)]">{user.user_id}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="sp-btn sp-btn--danger flex items-center gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
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
        className={`flex min-h-0 flex-1 flex-col ${deckRoute ? 'overflow-hidden' : 'overflow-y-auto'}`}
      >
        <Routes>
        <Route path="/" element={<CardSearchPage />} />
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
            <OnlineFlowRoute>
              <MatchmakingPage />
            </OnlineFlowRoute>
          }
        />
        <Route
          path="/create-room"
          element={
            <OnlineFlowRoute>
              <CreateRoomPage />
            </OnlineFlowRoute>
          }
        />
        <Route
          path="/join-room"
          element={
            <OnlineFlowRoute>
              <JoinRoomPage />
            </OnlineFlowRoute>
          }
        />
        <Route
          path="/lobby"
          element={
            <OnlineFlowRoute>
              <LobbyPage />
            </OnlineFlowRoute>
          }
        />
        <Route
          path="/game"
          element={
            <OnlineFlowRoute>
              <GamePageNew />
            </OnlineFlowRoute>
          }
        />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AppShellWithHeader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
