/*
  # Create Game and Matchmaking Tables

  1. New Tables
    - `game_rooms`
      - `id` (uuid, primary key) - Unique game room identifier
      - `player1_id` (text) - First player's session ID
      - `player2_id` (text, nullable) - Second player's session ID
      - `player1_deck_id` (uuid, nullable) - Player 1's deck
      - `player2_deck_id` (uuid, nullable) - Player 2's deck
      - `status` (text) - Game status: waiting, active, finished
      - `current_turn` (integer) - Current turn number
      - `active_player` (integer) - Which player's turn (1 or 2)
      - `game_state` (jsonb) - Complete game state
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `matchmaking_queue`
      - `id` (uuid, primary key)
      - `player_id` (text) - Player session ID
      - `deck_id` (uuid) - Selected deck for match
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Allow anyone to read game rooms
    - Allow anyone to insert/update game rooms (for matchmaking)
    - Allow anyone to join matchmaking queue
*/

CREATE TABLE IF NOT EXISTS game_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id text NOT NULL,
  player2_id text,
  player1_deck_id uuid,
  player2_deck_id uuid,
  status text NOT NULL DEFAULT 'waiting',
  current_turn integer NOT NULL DEFAULT 1,
  active_player integer NOT NULL DEFAULT 1,
  game_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text NOT NULL,
  deck_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view game rooms"
  ON game_rooms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create game rooms"
  ON game_rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update game rooms"
  ON game_rooms FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view matchmaking queue"
  ON matchmaking_queue FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join matchmaking queue"
  ON matchmaking_queue FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can leave matchmaking queue"
  ON matchmaking_queue FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_players ON game_rooms(player1_id, player2_id);
CREATE INDEX IF NOT EXISTS idx_matchmaking_created ON matchmaking_queue(created_at);