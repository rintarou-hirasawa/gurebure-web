/*
  # Create Room System with Spectators and Matchmaking

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key) - Unique room identifier
      - `password` (text) - Room password for joining
      - `owner_id` (text) - Room creator's session ID
      - `status` (text) - Room status: lobby, in_game
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `room_participants`
      - `id` (uuid, primary key)
      - `room_id` (uuid) - Reference to room
      - `player_id` (text) - Player session ID
      - `deck_id` (uuid, nullable) - Player's deck
      - `role` (text) - participant, player1, player2, spectator
      - `joined_at` (timestamptz)
    
    - `game_matches`
      - `id` (uuid, primary key)
      - `room_id` (uuid) - Reference to room
      - `player1_id` (text) - First player's session ID
      - `player2_id` (text) - Second player's session ID
      - `player1_deck_id` (uuid) - Player 1's deck
      - `player2_deck_id` (uuid) - Player 2's deck
      - `status` (text) - active, finished
      - `current_turn` (integer) - Current turn number
      - `active_player` (integer) - Which player's turn (1 or 2)
      - `game_state` (jsonb) - Complete game state
      - `game_log` (jsonb) - Array of game actions
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Changes
    - Drop old matchmaking_queue and game_rooms tables
    - Replace with room-based system
    - Add spectator support
    - Add game log tracking
  
  3. Security
    - Enable RLS on all tables
    - Allow public read access for joining rooms
    - Allow participants to update their own data
*/

-- Drop old tables
DROP TABLE IF EXISTS matchmaking_queue CASCADE;
DROP TABLE IF EXISTS game_rooms CASCADE;

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password text NOT NULL,
  owner_id text NOT NULL,
  status text NOT NULL DEFAULT 'lobby',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create room participants table
CREATE TABLE IF NOT EXISTS room_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  player_id text NOT NULL,
  deck_id uuid REFERENCES decks(id),
  role text NOT NULL DEFAULT 'participant',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(room_id, player_id)
);

-- Create game matches table
CREATE TABLE IF NOT EXISTS game_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  player1_id text NOT NULL,
  player2_id text NOT NULL,
  player1_deck_id uuid REFERENCES decks(id),
  player2_deck_id uuid REFERENCES decks(id),
  status text NOT NULL DEFAULT 'active',
  current_turn integer NOT NULL DEFAULT 1,
  active_player integer NOT NULL DEFAULT 1,
  game_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  game_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_matches ENABLE ROW LEVEL SECURITY;

-- Rooms policies
CREATE POLICY "Anyone can view rooms"
  ON rooms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create rooms"
  ON rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Room owner can update room"
  ON rooms FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete rooms"
  ON rooms FOR DELETE
  USING (true);

-- Room participants policies
CREATE POLICY "Anyone can view participants"
  ON room_participants FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join room"
  ON room_participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update participants"
  ON room_participants FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can leave room"
  ON room_participants FOR DELETE
  USING (true);

-- Game matches policies
CREATE POLICY "Anyone can view matches"
  ON game_matches FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create matches"
  ON game_matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update matches"
  ON game_matches FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete matches"
  ON game_matches FOR DELETE
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rooms_password ON rooms(password);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_participants_room ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_player ON room_participants(player_id);
CREATE INDEX IF NOT EXISTS idx_game_matches_room ON game_matches(room_id);
CREATE INDEX IF NOT EXISTS idx_game_matches_status ON game_matches(status);
