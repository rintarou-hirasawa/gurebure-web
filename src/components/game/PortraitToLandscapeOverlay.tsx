import { RotateCw } from 'lucide-react';

type Props = {
  active: boolean;
};

export function PortraitToLandscapeOverlay({ active }: Props) {
  const tryLockLandscape = () => {
    void screen.orientation?.lock?.('landscape-primary').catch(() => {});
  };

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-slate-950/96 px-6 text-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="横画面でのプレイを推奨"
    >
      <RotateCw
        className="h-14 w-14 shrink-0 animate-spin text-green-400 [animation-duration:2.8s]"
        aria-hidden
      />
      <p className="max-w-sm text-base font-medium text-white leading-relaxed">
        対戦UIは横画面前提です。端末を横に向けてください。
      </p>
      <button
        type="button"
        onClick={tryLockLandscape}
        className="rounded-lg border border-green-500/70 bg-green-600/25 px-4 py-2.5 text-sm font-medium text-green-50 hover:bg-green-600/40 active:bg-green-600/50 touch-manipulation"
      >
        向きを固定する（対応ブラウザのみ）
      </button>
      <p className="max-w-xs text-xs text-slate-400">
        iPhone の Safari などでは向きの固定ができないことがあります。その場合は端末の回転ロックを解除して横にしてください。
      </p>
    </div>
  );
}
