import { useEffect, useRef } from 'react';

/**
 * 対応ブラウザでは landscape にロックを試みる。
 * 多くの環境ではユーザー操作やフルスクリーンが必要で、失敗しても無視する。
 */
export function useScreenOrientationLock(enabled: boolean) {
  const lockedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (lockedRef.current) return;
    lockedRef.current = true;

    void (async () => {
      try {
        await screen.orientation?.lock?.('landscape-primary');
      } catch {
        /* 未対応・ポリシー・ジェスチャ不足など */
      }
    })();

    return () => {
      lockedRef.current = false;
      try {
        screen.orientation?.unlock();
      } catch {
        /* noop */
      }
    };
  }, [enabled]);
}
