import { useState, useEffect } from 'react';

/** スマホ幅＋縦向きのときだけ全画面で横持ちを促す（対戦UIは横画面前提） */
export function useMatchPortraitNudge(enabled: boolean) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setShow(false);
      return;
    }
    const mq = window.matchMedia('(max-width: 767px) and (orientation: portrait)');
    const apply = () => setShow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [enabled]);

  return show;
}
