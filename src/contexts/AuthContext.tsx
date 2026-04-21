import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import {
  ensurePublicUserRow,
  isAuthBypassEnabled,
  loadUserFromStorageAndSession,
  type User,
} from '../lib/auth';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const u = await loadUserFromStorageAndSession();
      setUser(u);
    } catch (e) {
      console.error('refreshUser', e);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await refreshUser();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  useEffect(() => {
    if (isAuthBypassEnabled()) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('currentUser');
        setUser(null);
        return;
      }
      if (session?.user) {
        try {
          const u = await ensurePublicUserRow(session.user);
          setUser(u);
        } catch (e) {
          console.error('onAuthStateChange ensurePublicUserRow', e);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const logoutUser = useCallback(async () => {
    if (isAuthBypassEnabled()) {
      return;
    }
    localStorage.removeItem('currentUser');
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, refreshUser, logoutUser }),
    [user, loading, refreshUser, logoutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth は AuthProvider 内で使ってください');
  }
  return ctx;
}
