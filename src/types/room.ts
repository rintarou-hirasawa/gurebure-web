export interface Room {
  id: string;
  password: string;
  owner_id: string;
  status: 'lobby' | 'in_game';
  created_at: string;
  updated_at: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  player_id: string;
  deck_id: string | null;
  role: 'participant' | 'player1' | 'player2' | 'spectator';
  joined_at: string;
}

export interface GameMatch {
  id: string;
  room_id: string;
  player1_id: string;
  player2_id: string;
  player1_deck_id: string;
  player2_deck_id: string;
  status: 'active' | 'finished';
  current_turn: number;
  active_player: 1 | 2;
  game_state: any;
  game_log: GameLogEntry[];
  created_at: string;
  updated_at: string;
}

export interface GameLogEntry {
  timestamp: string;
  player: string;
  action: string;
  details?: string;
}
