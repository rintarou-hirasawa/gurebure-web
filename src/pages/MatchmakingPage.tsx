import { Navigate } from 'react-router-dom';

/** 旧URL互換: オンラインメニューへ */
export function MatchmakingPage() {
  return <Navigate to="/battle/online" replace />;
}
