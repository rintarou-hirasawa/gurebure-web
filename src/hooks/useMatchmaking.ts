import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GameRoom, MatchmakingQueueEntry } from '../types/game';

export function useMatchmaking(playerId: string) {
  const [isSearching, setIsSearching] = useState(false);
  const [gameRoom, setGameRoom] = useState<GameRoom | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSearching) return;

    const channel = supabase
      .channel(`matchmaking-${playerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_rooms'
        },
        async (payload) => {
          const room = payload.new as GameRoom;
          if (
            (room.player1_id === playerId || room.player2_id === playerId) &&
            room.status === 'active'
          ) {
            await supabase
              .from('matchmaking_queue')
              .delete()
              .eq('player_id', playerId);

            setGameRoom(room);
            setIsSearching(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isSearching, playerId]);

  const joinQueue = async (deckId: string) => {
    try {
      setIsSearching(true);
      setError(null);

      const { data: existingQueue } = await supabase
        .from('matchmaking_queue')
        .select('*')
        .neq('player_id', playerId)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (existingQueue) {
        const opponent = existingQueue as MatchmakingQueueEntry;

        const startingPlayer = Math.random() < 0.5 ? 1 : 2;

        const { data: room, error: roomError } = await supabase
          .from('game_rooms')
          .insert({
            player1_id: opponent.player_id,
            player2_id: playerId,
            player1_deck_id: opponent.deck_id,
            player2_deck_id: deckId,
            status: 'active',
            active_player: startingPlayer,
            current_turn: 1,
            game_state: {}
          })
          .select()
          .single();

        if (roomError) throw roomError;

        await supabase
          .from('matchmaking_queue')
          .delete()
          .eq('id', opponent.id);

        setGameRoom(room as GameRoom);
        setIsSearching(false);
      } else {
        await supabase
          .from('matchmaking_queue')
          .insert({
            player_id: playerId,
            deck_id: deckId
          });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join queue');
      setIsSearching(false);
    }
  };

  const cancelQueue = async () => {
    try {
      await supabase
        .from('matchmaking_queue')
        .delete()
        .eq('player_id', playerId);

      setIsSearching(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel queue');
    }
  };

  return {
    isSearching,
    gameRoom,
    error,
    joinQueue,
    cancelQueue
  };
}
