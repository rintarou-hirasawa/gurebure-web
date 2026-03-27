import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Room, RoomParticipant } from '../types/room';
import { Users, ArrowLeft, Play } from 'lucide-react';

export default function LobbyPage() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const playerId = localStorage.getItem('playerId');
  const isOwner = room?.owner_id === playerId;

  useEffect(() => {
    if (!roomId || !playerId) {
      navigate('/matchmaking');
      return;
    }

    loadRoomData();

    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'room_participants', filter: `room_id=eq.${roomId}` },
        (payload) => {
          console.log('Participants changed:', payload);
          loadRoomData();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          console.log('Room changed:', payload);
          loadRoomData();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'game_matches', filter: `room_id=eq.${roomId}` },
        (payload) => {
          console.log('Match changed:', payload);
          loadRoomData();
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      loadRoomData();
    }, 2000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [roomId]);

  const loadRoomData = async () => {
    try {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      setRoom(roomData);

      const { data: participantsData, error: participantsError } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', roomId)
        .order('joined_at', { ascending: true });

      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);

      if (roomData.status === 'in_game') {
        const { data: matches } = await supabase
          .from('game_matches')
          .select('*')
          .eq('room_id', roomId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1);

        if (matches && matches.length > 0) {
          navigate(`/game?match=${matches[0].id}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlayerSelection = (participantPlayerId: string) => {
    if (!isOwner) return;

    setSelectedPlayers(prev => {
      if (prev.includes(participantPlayerId)) {
        return prev.filter(id => id !== participantPlayerId);
      } else if (prev.length < 2) {
        return [...prev, participantPlayerId];
      }
      return prev;
    });
  };

  const handleStartMatch = async () => {
    if (!isOwner || selectedPlayers.length !== 2) return;

    try {
      const player1Data = participants.find(p => p.player_id === selectedPlayers[0]);
      const player2Data = participants.find(p => p.player_id === selectedPlayers[1]);

      if (!player1Data?.deck_id || !player2Data?.deck_id) {
        setError('両プレイヤーのデッキ情報が見つかりません');
        return;
      }

      await supabase
        .from('rooms')
        .update({ status: 'in_game' })
        .eq('id', roomId);

      const { data: match, error: matchError } = await supabase
        .from('game_matches')
        .insert({
          room_id: roomId,
          player1_id: selectedPlayers[0],
          player2_id: selectedPlayers[1],
          player1_deck_id: player1Data.deck_id,
          player2_deck_id: player2Data.deck_id,
          status: 'active',
          game_state: {},
          game_log: []
        })
        .select()
        .single();

      if (matchError) throw matchError;

      await supabase
        .from('room_participants')
        .update({ role: 'player1' })
        .eq('player_id', selectedPlayers[0])
        .eq('room_id', roomId);

      await supabase
        .from('room_participants')
        .update({ role: 'player2' })
        .eq('player_id', selectedPlayers[1])
        .eq('room_id', roomId);

      await supabase
        .from('room_participants')
        .update({ role: 'spectator' })
        .neq('player_id', selectedPlayers[0])
        .neq('player_id', selectedPlayers[1])
        .eq('room_id', roomId);

      navigate(`/game?match=${match.id}`);
    } catch (err: any) {
      setError(err.message || 'マッチの開始に失敗しました');
    }
  };

  /** 開発用: 参加者1人・同一デッキで両側を埋め、対戦画面まで進める */
  const handleSoloDevStart = async () => {
    if (!import.meta.env.DEV || !isOwner) return;
    if (participants.length !== 1) {
      setError('一人対戦は参加者が1人のときのみ使えます');
      return;
    }

    const only = participants[0];
    if (!only.deck_id) {
      setError('デッキ情報が見つかりません');
      return;
    }

    const pid = only.player_id;

    try {
      setError('');

      await supabase.from('rooms').update({ status: 'in_game' }).eq('id', roomId);

      const { data: match, error: matchError } = await supabase
        .from('game_matches')
        .insert({
          room_id: roomId,
          player1_id: pid,
          player2_id: pid,
          player1_deck_id: only.deck_id,
          player2_deck_id: only.deck_id,
          status: 'active',
          active_player: 1,
          current_turn: 1,
          game_state: {},
          game_log: []
        })
        .select()
        .single();

      if (matchError) throw matchError;

      await supabase
        .from('room_participants')
        .update({ role: 'player1' })
        .eq('player_id', pid)
        .eq('room_id', roomId);

      navigate(`/game?match=${match.id}`);
    } catch (err: any) {
      setError(err.message || '一人対戦の開始に失敗しました');
    }
  };

  const handleLeaveRoom = async () => {
    if (!playerId) return;

    try {
      await supabase
        .from('room_participants')
        .delete()
        .eq('room_id', roomId)
        .eq('player_id', playerId);

      if (isOwner) {
        await supabase
          .from('rooms')
          .delete()
          .eq('id', roomId);
      }

      window.location.href = '/matchmaking';
    } catch (err: any) {
      setError(err.message || '部屋の退出に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--sp-bg)]">
        <div className="text-xl text-[var(--sp-parchment)]">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--sp-bg)]">
      <div className="container mx-auto px-4 py-8">
        <button
          type="button"
          onClick={handleLeaveRoom}
          className="mb-6 flex items-center gap-2 text-[var(--sp-parchment)] transition-colors hover:text-[var(--sp-rust)]"
        >
          <ArrowLeft size={20} />
          <span>部屋を退出</span>
        </button>

        <div className="mx-auto max-w-4xl">
          <div className="sp-panel sp-panel--elevated mb-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="sp-display text-3xl font-semibold text-[var(--sp-ink)]">待機ロビー</h1>
              <div className="flex items-center gap-2 text-[var(--sp-muted)]">
                <Users size={20} className="text-green-600" />
                <span>{participants.length}人</span>
              </div>
            </div>

            {room && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="mb-1 text-sm text-[var(--sp-muted)]">あいことば</div>
                <div className="text-2xl font-bold text-[var(--sp-ink)]">{room.password}</div>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
                {error}
              </div>
            )}

            {isOwner && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50/90 p-4">
                <div className="mb-2 text-sm font-medium text-green-800">部屋の作成者</div>
                <div className="text-[var(--sp-ink)]">
                  対戦させたい2人のプレイヤーを選択してください
                </div>
                {import.meta.env.DEV && participants.length === 1 && (
                  <p className="mt-3 rounded-md border border-green-200 bg-green-50/80 px-3 py-2 text-sm text-green-900">
                    開発モード: 参加者が自分だけのとき、下の「一人で対戦開始」から対戦画面へ進めます（両プレイヤー同じデッキ・ターン交代で操作）。
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="sp-panel sp-panel--elevated mb-6 p-6">
            <h2 className="mb-4 text-xl font-semibold text-[var(--sp-ink)]">参加者リスト</h2>

            <div className="space-y-3">
              {participants.map((participant) => {
                const isSelected = selectedPlayers.includes(participant.player_id);
                const isCurrentPlayer = participant.player_id === playerId;

                return (
                  <div
                    key={participant.id}
                    onClick={() => handleTogglePlayerSelection(participant.player_id)}
                    className={`rounded-lg border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-green-400 bg-green-50'
                        : 'border-green-200 bg-green-50/80'
                    } ${isOwner ? 'cursor-pointer hover:border-green-300' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[var(--sp-ink)]">
                          {participant.player_id.substring(0, 20)}...
                          {isCurrentPlayer && (
                            <span className="ml-2 text-green-600">(あなた)</span>
                          )}
                          {participant.player_id === room?.owner_id && (
                            <span className="ml-2 text-[var(--sp-parchment)]">(部屋主)</span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="font-semibold text-green-700">選択中</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {isOwner && (
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleStartMatch}
                disabled={selectedPlayers.length !== 2}
                className="sp-btn sp-btn--primary flex w-full items-center justify-center gap-2 py-4 text-base font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play size={20} />
                対戦を開始 ({selectedPlayers.length}/2人選択中)
              </button>
              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={handleSoloDevStart}
                  disabled={participants.length !== 1}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-300 bg-green-100 py-3 font-medium text-green-950 transition-colors hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play size={18} />
                  一人で対戦開始（開発・参加者1人のみ）
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
