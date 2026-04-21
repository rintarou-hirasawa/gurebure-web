import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { supabase } from './supabase';

/** 未ログインで保護ページへ来たときの戻り先（Google OAuth の往復でも sessionStorage は残る） */
export const POST_LOGIN_REDIRECT_KEY = 'postLoginRedirect';

/** ログイン成功後の遷移先。保存がなければ /battle。オープンリダイレクト防止のため先頭 `/` のみ許可 */
export function takePostLoginRedirectPath(): string {
  try {
    const v = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    if (v && v.startsWith('/') && !v.startsWith('//')) return v;
  } catch {
    /* ignore */
  }
  return '/battle';
}

export interface User {
  id: string;
  user_id: string;
  created_at: string;
}

/** localhost / 127.0.0.1 または VITE_AUTH_BYPASS=true のときログイン不要（Google OAuth なしで開発） */
export function isAuthBypassEnabled(): boolean {
  if (import.meta.env.VITE_AUTH_BYPASS === 'false') return false;
  if (import.meta.env.VITE_AUTH_BYPASS === 'true') return true;
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
}

/** バイパス時の仮ユーザー（decks.user_id に保存する UUID。DB の FK 不要な運用向け） */
export const DEV_LOCAL_USER: User = {
  id: '00000000-0000-4000-8000-000000000001',
  user_id: 'local-dev',
  created_at: '1970-01-01T00:00:00.000Z',
};

function getStoredUser(): User | null {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/** Supabase セッション（Google 等）と localStorage（ID/パスワード）の両方を解決 */
export async function loadUserFromStorageAndSession(): Promise<User | null> {
  if (isAuthBypassEnabled()) {
    return DEV_LOCAL_USER;
  }

  if (typeof window !== 'undefined') {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('OAuth PKCE exchange', error);
        }
      } catch (e) {
        console.error('OAuth PKCE exchange', e);
      }
    }
  }

  const sessionResult = await Promise.race([
    supabase.auth.getSession(),
    new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 12000)),
  ]);
  if (sessionResult === 'timeout') {
    console.warn('auth.getSession() がタイムアウトしました。localStorage のユーザーを試します。');
    return getStoredUser();
  }
  const {
    data: { session },
  } = sessionResult;
  if (session?.user) {
    const u = await ensurePublicUserRow(session.user);
    if (u) return u;
  }
  return getStoredUser();
}

/** Google ログイン後: auth.users と対応する public.users を作成または取得 */
export async function ensurePublicUserRow(authUser: SupabaseAuthUser): Promise<User | null> {
  const { data: existing } = await supabase
    .from('users')
    .select('id, user_id, created_at')
    .eq('auth_user_id', authUser.id)
    .maybeSingle();

  if (existing) {
    const pub: User = {
      id: existing.id,
      user_id: existing.user_id,
      created_at: existing.created_at,
    };
    localStorage.setItem('currentUser', JSON.stringify(pub));
    return pub;
  }

  const email = authUser.email?.trim() ?? '';
  const metaName =
    (authUser.user_metadata?.full_name as string | undefined) ||
    (authUser.user_metadata?.name as string | undefined) ||
    '';
  let userId = email || metaName || `user_${authUser.id.slice(0, 8)}`;
  if (userId.length > 200) userId = userId.slice(0, 200);

  const insertRow = async (uid: string) => {
    return supabase
      .from('users')
      .insert({
        auth_user_id: authUser.id,
        user_id: uid,
        password_hash: null,
      })
      .select('id, user_id, created_at')
      .single();
  };

  let { data: inserted, error } = await insertRow(userId);

  if (error?.code === '23505') {
    const fallback = `${email || 'user'}_${authUser.id.slice(0, 8)}`;
    const retry = await insertRow(fallback);
    inserted = retry.data;
    error = retry.error;
  }

  if (error || !inserted) {
    console.error('ensurePublicUserRow', error);
    return null;
  }

  const pub: User = {
    id: inserted.id,
    user_id: inserted.user_id,
    created_at: inserted.created_at,
  };
  localStorage.setItem('currentUser', JSON.stringify(pub));
  return pub;
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  });
  if (error) return { error: error.message };
  return {};
}

export async function register(
  userId: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  const { data: existing } = await supabase.from('users').select('id').eq('user_id', userId).maybeSingle();

  if (existing) {
    return { success: false, error: 'このユーザーIDは既に使用されています' };
  }

  const passwordHash = await hashPassword(password);

  const { data, error } = await supabase
    .from('users')
    .insert({ user_id: userId, password_hash: passwordHash })
    .select('id, user_id, created_at')
    .single();

  if (error) {
    return { success: false, error: 'アカウント作成に失敗しました' };
  }

  const pub: User = { id: data.id, user_id: data.user_id, created_at: data.created_at };
  localStorage.setItem('currentUser', JSON.stringify(pub));
  return { success: true, user: pub };
}

export async function login(
  userId: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  const { data: user } = await supabase
    .from('users')
    .select('id, user_id, created_at, password_hash')
    .eq('user_id', userId)
    .maybeSingle();

  if (!user) {
    return { success: false, error: 'ユーザーIDまたはパスワードが間違っています' };
  }

  if (!user.password_hash) {
    return {
      success: false,
      error: 'このアカウントはGoogleログインです。「Googleで続ける」からログインしてください。',
    };
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return { success: false, error: 'ユーザーIDまたはパスワードが間違っています' };
  }

  const pub: User = {
    id: user.id,
    user_id: user.user_id,
    created_at: user.created_at,
  };
  localStorage.setItem('currentUser', JSON.stringify(pub));
  return { success: true, user: pub };
}

/** @deprecated 可能なら useAuth() を使う */
export function getCurrentUser(): User | null {
  return getStoredUser();
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
