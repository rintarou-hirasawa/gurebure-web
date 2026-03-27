import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { GameRoom, GameState, CardInGame, Zone } from '../types/game';
import { Card } from '../types/card';

export function useGameState(gameRoomId: string, playerId: string) {
  const [gameRoom, setGameRoom] = useState<GameRoom | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerNumber, setPlayerNumber] = useState<1 | 2 | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameRoom();
    const cleanup = subscribeToGameUpdates();
    return cleanup;
  }, [gameRoomId]);

  const loadGameRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('id', gameRoomId)
        .single();

      if (error) throw error;

      const room = data as GameRoom;
      setGameRoom(room);

      const pNum = room.player1_id === playerId ? 1 : 2;
      setPlayerNumber(pNum);

      if (Object.keys(room.game_state).length === 0) {
        await initializeGameState(room, pNum);
      } else {
        setGameState(room.game_state);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load game room:', err);
      setLoading(false);
    }
  };

  const initializeGameState = async (room: GameRoom, pNum: 1 | 2) => {
    try {
      const player1DeckId = room.player1_deck_id;
      const player2DeckId = room.player2_deck_id;

      if (!player1DeckId || !player2DeckId) return;

      const { data: deck1Cards } = await supabase
        .from('deck_cards')
        .select(`
          quantity,
          card:card_id (*)
        `)
        .eq('deck_id', player1DeckId);

      const { data: deck2Cards } = await supabase
        .from('deck_cards')
        .select(`
          quantity,
          card:card_id (*)
        `)
        .eq('deck_id', player2DeckId);

      const createDeck = (deckCards: any[]): CardInGame[] => {
        const cards: CardInGame[] = [];
        deckCards?.forEach((dc) => {
          const card = dc.card;
          if (!card) return;
          for (let i = 0; i < dc.quantity; i++) {
            cards.push({
              ...card,
              instanceId: `${card.id}-${Math.random().toString(36).substr(2, 9)}`
            });
          }
        });
        return shuffleArray(cards);
      };

      const player1Deck = createDeck(deck1Cards || []);
      const player2Deck = createDeck(deck2Cards || []);

      const initialState: GameState = {
        player1: {
          playerId: room.player1_id,
          deckId: player1DeckId,
          deck: player1Deck.slice(5),
          hand: player1Deck.slice(0, 5),
          mana: [],
          battle: [],
          graveyard: []
        },
        player2: {
          playerId: room.player2_id!,
          deckId: player2DeckId,
          deck: player2Deck.slice(5),
          hand: player2Deck.slice(0, 5),
          mana: [],
          battle: [],
          graveyard: []
        },
        currentTurn: 1,
        activePlayer: room.active_player,
        startingPlayer: room.active_player
      };

      await supabase
        .from('game_rooms')
        .update({ game_state: initialState })
        .eq('id', gameRoomId);

      setGameState(initialState);
    } catch (err) {
      console.error('Failed to initialize game state:', err);
    }
  };

  const subscribeToGameUpdates = () => {
    const channel = supabase
      .channel(`game:${gameRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${gameRoomId}`
        },
        (payload) => {
          const room = payload.new as GameRoom;
          setGameRoom(room);
          setGameState(room.game_state);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateGameState = useCallback(async (newState: Partial<GameState>) => {
    if (!gameState) return;

    const updatedState = { ...gameState, ...newState };

    try {
      await supabase
        .from('game_rooms')
        .update({
          game_state: updatedState,
          updated_at: new Date().toISOString()
        })
        .eq('id', gameRoomId);

      setGameState(updatedState);
    } catch (err) {
      console.error('Failed to update game state:', err);
    }
  }, [gameState, gameRoomId]);

  const moveCard = useCallback((
    card: CardInGame,
    fromZone: Zone,
    toZone: Zone,
    fromPlayer: 1 | 2,
    toPlayer: 1 | 2
  ) => {
    if (!gameState) return;

    const newState = { ...gameState };
    const fromPlayerState = fromPlayer === 1 ? newState.player1 : newState.player2;
    const toPlayerState = toPlayer === 1 ? newState.player1 : newState.player2;

    fromPlayerState[fromZone] = fromPlayerState[fromZone].filter(
      c => c.instanceId !== card.instanceId
    );

    toPlayerState[toZone] = [...toPlayerState[toZone], card];

    updateGameState(newState);
  }, [gameState, updateGameState]);

  const endTurn = useCallback(async () => {
    if (!gameRoom || !gameState) return;

    const nextPlayer = gameRoom.active_player === 1 ? 2 : 1;
    const nextTurn = gameRoom.current_turn + (nextPlayer === 1 ? 1 : 0);

    await supabase
      .from('game_rooms')
      .update({
        active_player: nextPlayer,
        current_turn: nextTurn
      })
      .eq('id', gameRoomId);
  }, [gameRoom, gameState, gameRoomId]);

  return {
    gameRoom,
    gameState,
    playerNumber,
    loading,
    moveCard,
    endTurn,
    updateGameState
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
