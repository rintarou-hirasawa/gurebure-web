import { Card } from './card';

export type Zone = 'deck' | 'hand' | 'mana' | 'battle' | 'graveyard' | 'shields';

export interface CardInGame extends Card {
  instanceId: string;
  tapped?: boolean;
}

export interface PlayerState {
  playerId: string;
  deckId: string;
  deck: CardInGame[];
  hand: CardInGame[];
  mana: CardInGame[];
  battle: CardInGame[];
  graveyard: CardInGame[];
  shields: CardInGame[];
}

export interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  currentTurn: number;
  activePlayer: 1 | 2;
  startingPlayer: 1 | 2;
  winner?: 1 | 2 | null;
  gameOver?: boolean;
}

export interface GameRoom {
  id: string;
  player1_id: string;
  player2_id: string | null;
  player1_deck_id: string | null;
  player2_deck_id: string | null;
  status: 'waiting' | 'active' | 'finished';
  current_turn: number;
  active_player: 1 | 2;
  game_state: GameState;
  created_at: string;
  updated_at: string;
}

export interface MatchmakingQueueEntry {
  id: string;
  player_id: string;
  deck_id: string;
  created_at: string;
}

export interface ZoneActionType {
  label: string;
  action: (selectedCards?: CardInGame[]) => void;
  requiresSelection?: boolean;
  multiSelect?: boolean;
}
