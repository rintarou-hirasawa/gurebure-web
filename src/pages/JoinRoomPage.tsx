import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { useDeck } from '../hooks/useDeck';
import { useAuth } from '../contexts/AuthContext';

export default function JoinRoomPage() {
  const [password, setPassword] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { decks, refreshDecks } = useDeck();

  useEffect(() => {
    if (user) {
      refreshDecks();
    }
  }, [user]);

  const handleJoinRoom = async () => {
    if (!password.trim()) {
      setError('あいことばを入力してください');
      return;
    }

    if (!selectedDeckId) {
      setError('デッキを選択してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: rooms, error: searchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('password', password.trim())
        .eq('status', 'lobby')
        .order('created_at', { ascending: false })
        .limit(1);

      if (searchError) throw searchError;

      if (!rooms || rooms.length === 0) {
        setError('部屋が見つかりません');
        setLoading(false);
        return;
      }

      const room = rooms[0];
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('playerId', playerId);
      localStorage.setItem('selectedDeckId', selectedDeckId);

      const { error: participantError } = await supabase
        .from('room_participants')
        .insert({
          room_id: room.id,
          player_id: playerId,
          role: 'participant',
          deck_id: selectedDeckId
        });

      if (participantError) throw participantError;

      navigate(`/lobby?room=${room.id}`);
    } catch (err: any) {
      setError(err.message || '部屋への参加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--sp-bg)]">
      <div className="container mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate('/matchmaking')}
          className="mb-6 flex items-center gap-2 text-[var(--sp-parchment)] transition-colors hover:text-[var(--sp-brass)]"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>

        <div className="sp-panel sp-panel--elevated mx-auto max-w-md p-8">
          <h1 className="sp-display mb-6 text-center text-3xl font-semibold text-[var(--sp-ink)]">
            部屋を検索
          </h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block font-medium text-[var(--sp-parchment)]">デッキを選択</label>
            {decks.length === 0 ? (
              <p className="text-[var(--sp-muted)]">保存されたデッキがありません</p>
            ) : (
              <select
                value={selectedDeckId || ''}
                onChange={(e) => setSelectedDeckId(e.target.value)}
                className="sp-input w-full px-4 py-3"
                disabled={loading}
              >
                <option value="">デッキを選択してください</option>
                {decks.map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    {deck.name} ({deck.card_count || 0}枚)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-medium text-[var(--sp-parchment)]">あいことば</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="部屋のあいことばを入力"
              className="sp-input px-4 py-3"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-[var(--sp-muted)]">
              部屋の作成者から共有されたあいことばを入力してください
            </p>
          </div>

          <button
            type="button"
            onClick={handleJoinRoom}
            disabled={loading || !password.trim() || !selectedDeckId}
            className="sp-btn sp-btn--primary w-full justify-center py-3 text-base font-bold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '検索中...' : '部屋に参加'}
          </button>
        </div>
      </div>
    </div>
  );
}
