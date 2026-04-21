import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Supabase の Site URL が / のとき OAuth 後に /?code= に戻る。
 * カード検索と PKCE が競合しないよう、即 /login?code= へ寄せる（プレースホルダーは出さない）。
 */
export function OAuthCodeRootRedirect({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hasCode = new URLSearchParams(location.search).has('code');
  const shouldRedirect = location.pathname === '/' && hasCode;

  if (shouldRedirect) {
    return <Navigate to={`/login${location.search}${location.hash}`} replace />;
  }
  return <>{children}</>;
}
