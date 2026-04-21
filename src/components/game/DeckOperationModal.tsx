import { useEffect, useMemo, useState } from 'react';
import { Info, X } from 'lucide-react';
import type { CardInGame, DeckRevealDestination } from '../../types/game';
import { CardImage } from '../CardImage';

type OperationMode = 'multi' | 'oneByOne' | 'shuffle';

export interface DeckOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckCount: number;
  deckReveal: CardInGame[] | undefined;
  deckRevealOneByOne: boolean | undefined;
  onShuffle: () => void;
  onRevealMulti: (params: { count: number; fromTop: boolean; faceUp: boolean }) => void;
  onStartOneByOne: () => void;
  onMoveRevealToZone: (cardIds: string[], destination: DeckRevealDestination) => void;
  /** 山札確認中のカードのテキスト詳細 */
  onOpenCardDetail?: (card: CardInGame) => void;
}

const CARD_BACK_SRC = '/placeholder-card.svg';

export function DeckOperationModal({
  isOpen,
  onClose,
  deckCount,
  deckReveal,
  deckRevealOneByOne,
  onShuffle,
  onRevealMulti,
  onStartOneByOne,
  onMoveRevealToZone,
  onOpenCardDetail
}: DeckOperationModalProps) {
  const [operation, setOperation] = useState<OperationMode>('multi');
  const [fromTop, setFromTop] = useState(true);
  const [faceUp, setFaceUp] = useState(true);
  const [count, setCount] = useState(1);

  const reveal = deckReveal ?? [];
  const inRevealPhase = reveal.length > 0;

  const countOptions = useMemo(() => {
    const n = Math.max(0, deckCount);
    return Array.from({ length: n }, (_, i) => i + 1);
  }, [deckCount]);

  const revealKey = useMemo(() => reveal.map(c => c.instanceId).join(','), [reveal]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAllApplied, setSelectAllApplied] = useState(false);

  useEffect(() => {
    if (!inRevealPhase) return;
    const ids = reveal.map(c => c.instanceId);
    if (ids.length === 0) return;
    setSelectedIds(new Set([ids[0]!]));
    setSelectAllApplied(false);
  }, [inRevealPhase, revealKey]);

  useEffect(() => {
    if (!inRevealPhase) {
      setCount(1);
      setOperation('multi');
      setFromTop(true);
      setFaceUp(true);
    }
  }, [inRevealPhase]);

  if (!isOpen) return null;

  const segBtn = (active: boolean) =>
    `flex-1 rounded-lg border px-2 py-2 text-center text-xs font-semibold sm:text-sm ${
      active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-800'
    }`;

  const destBtn = (className: string) =>
    `rounded-lg px-2 py-2.5 text-center text-xs font-bold shadow-sm sm:text-sm ${className}`;

  const handleCardTap = (id: string) => {
    if (selectAllApplied) {
      setSelectedIds(prev => {
        const n = new Set(prev);
        if (n.has(id)) n.delete(id);
        else n.add(id);
        return n;
      });
    } else {
      setSelectedIds(new Set([id]));
    }
  };

  const handleSelectAllRemaining = () => {
    setSelectAllApplied(true);
    setSelectedIds(new Set(reveal.map(c => c.instanceId)));
  };

  const moveSelected = (destination: DeckRevealDestination) => {
    const ids = [...selectedIds].filter(id => reveal.some(c => c.instanceId === id));
    if (ids.length === 0) return;
    onMoveRevealToZone(ids, destination);
  };

  const menuExecute = () => {
    if (operation === 'shuffle') {
      onShuffle();
      return;
    }
    if (operation === 'oneByOne') {
      onStartOneByOne();
      return;
    }
    const n = Math.min(count, Math.max(0, deckCount));
    if (n <= 0) return;
    onRevealMulti({ count: n, fromTop, faceUp });
  };

  /** 確認中カードの表示 */
  const renderRevealCard = (card: CardInGame) => {
    const selected = selectedIds.has(card.instanceId);
    return (
      <div
        key={card.instanceId}
        className="relative shrink-0"
        style={{ width: 72, aspectRatio: '63 / 88' }}
      >
        {onOpenCardDetail && (
          <button
            type="button"
            title="カード詳細"
            className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-500/90 bg-white text-green-700 shadow-md hover:bg-slate-50"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCardDetail(card);
            }}
          >
            <Info className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        )}
        <button
          type="button"
          onClick={() => handleCardTap(card.instanceId)}
          className={`relative h-full w-full overflow-hidden rounded-md border-2 transition ${
            selected ? 'border-blue-600 ring-2 ring-blue-400' : 'border-transparent opacity-95'
          }`}
        >
          {card.faceDown ? (
            <img src={CARD_BACK_SRC} alt="" className="h-full w-full object-cover" />
          ) : (
            <CardImage card={card} className="h-full w-full object-cover" />
          )}
        </button>
      </div>
    );
  };

  if (inRevealPhase) {
    const total = reveal.length;
    const sel = selectedIds.size;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3">
        <div
          className="sp-modal-surface relative max-h-[92vh] w-full max-w-md overflow-hidden rounded-2xl p-4 shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            className="absolute right-3 top-3 rounded-full p-1 text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="pr-10 text-lg font-bold text-[var(--sp-ink)]">山札操作 ({deckCount}枚)</h2>
          <p className="mt-1 text-sm text-[var(--sp-muted)]">カードをタップして選択（複数は「残りを全て選択」後）</p>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSelectAllRemaining}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
            >
              残りを全て選択
            </button>
          </div>

          <div className="mt-2 max-h-[28vh] overflow-x-auto overflow-y-hidden pb-2">
            <div className="flex gap-2">{reveal.map(renderRevealCard)}</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" className={destBtn('bg-sky-200 text-sky-950 hover:bg-sky-300')} onClick={() => moveSelected('battle')}>
              バトルへ
            </button>
            <button type="button" className={destBtn('bg-emerald-200 text-emerald-950 hover:bg-emerald-300')} onClick={() => moveSelected('mana')}>
              マナへ
            </button>
            <button type="button" className={destBtn('bg-rose-200 text-rose-950 hover:bg-rose-300')} onClick={() => moveSelected('graveyard')}>
              墓地へ
            </button>
            <button type="button" className={destBtn('bg-amber-200 text-amber-950 hover:bg-amber-300')} onClick={() => moveSelected('shields')}>
              シールドへ
            </button>
            <button type="button" className={destBtn('border border-slate-300 bg-white text-slate-800 hover:bg-slate-50')} onClick={() => moveSelected('deckTop')}>
              山札の上へ
            </button>
            <button type="button" className={destBtn('border border-slate-300 bg-white text-slate-800 hover:bg-slate-50')} onClick={() => moveSelected('deckBottom')}>
              山札の下へ
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-[var(--sp-muted)]">
            選択 {sel}/{total} — 移動先のボタンを押すと実行されます
          </p>
        </div>
      </div>
    );
  }

  /** メニュー（複数枚 / 一枚ずつ / シャッフル） */
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3">
      <div
        className="sp-modal-surface relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl p-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full p-1 text-slate-500 hover:bg-slate-100"
          onClick={onClose}
          aria-label="閉じる"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="pr-10 text-lg font-bold text-[var(--sp-ink)]">山札操作 ({deckCount}枚)</h2>
        <p className="mt-1 text-sm text-[var(--sp-muted)]">
          {operation === 'multi' ? '方向と枚数を選択してください' : operation === 'oneByOne' ? '一枚ずつ山札の上からめくります' : '山札をシャッフルします'}
        </p>

        <p className="mb-2 mt-4 text-sm font-semibold text-[var(--sp-ink)]">操作を選択</p>
        <div className="flex gap-1">
          <button type="button" className={segBtn(operation === 'multi')} onClick={() => setOperation('multi')}>
            複数枚を確認
          </button>
          <button type="button" className={segBtn(operation === 'oneByOne')} onClick={() => setOperation('oneByOne')}>
            一枚ずつ確認
          </button>
          <button type="button" className={segBtn(operation === 'shuffle')} onClick={() => setOperation('shuffle')}>
            シャッフル
          </button>
        </div>

        {operation === 'multi' && (
          <>
            <p className="mb-2 mt-4 text-sm font-semibold text-[var(--sp-ink)]">方向</p>
            <div className="flex gap-2">
              <button type="button" className={segBtn(fromTop)} onClick={() => setFromTop(true)}>
                上から
              </button>
              <button type="button" className={segBtn(!fromTop)} onClick={() => setFromTop(false)}>
                下から
              </button>
            </div>

            <p className="mb-2 mt-4 text-sm font-semibold text-[var(--sp-ink)]">枚数</p>
            <select
              value={Math.min(count, deckCount) || 1}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[var(--sp-ink)]"
            >
              {countOptions.map(n => (
                <option key={n} value={n}>
                  {n}枚
                </option>
              ))}
            </select>

            <p className="mb-2 mt-4 text-sm font-semibold text-[var(--sp-ink)]">確認方法</p>
            <div className="flex gap-2">
              <button type="button" className={segBtn(faceUp)} onClick={() => setFaceUp(true)}>
                表向きで確認
              </button>
              <button type="button" className={segBtn(!faceUp)} onClick={() => setFaceUp(false)}>
                裏向きのまま
              </button>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={menuExecute}
          disabled={deckCount <= 0}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-center text-base font-bold text-white hover:bg-blue-700 disabled:opacity-40"
        >
          実行
        </button>
      </div>
    </div>
  );
}
