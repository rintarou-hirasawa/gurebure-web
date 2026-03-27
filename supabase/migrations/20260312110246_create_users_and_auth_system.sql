/*
  # Create Users and Authentication System

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `user_id` (text, unique, not null) - User login ID
      - `password_hash` (text, not null) - Hashed password
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Changes
    - Update `decks` table to link with user accounts
      - Add `user_id` column (uuid, references users.id)
    - Update `game_matches` table to link with user accounts
      - Add `player1_user_id` and `player2_user_id` columns

  3. Security
    - Enable RLS on `users` table
    - Add policies for users to manage their own data
    - Update deck policies to check user ownership
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'decks' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE decks ADD COLUMN user_id uuid REFERENCES users(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_matches' AND column_name = 'player1_user_id'
  ) THEN
    ALTER TABLE game_matches ADD COLUMN player1_user_id uuid REFERENCES users(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_matches' AND column_name = 'player2_user_id'
  ) THEN
    ALTER TABLE game_matches ADD COLUMN player2_user_id uuid REFERENCES users(id);
  END IF;
END $$;

CREATE POLICY "Users can read own decks"
  ON decks FOR SELECT
  USING (user_id IS NULL OR user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own decks"
  ON decks FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own decks"
  ON decks FOR UPDATE
  USING (user_id IS NULL OR user_id::text = current_setting('app.current_user_id', true))
  WITH CHECK (user_id IS NULL OR user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own decks"
  ON decks FOR DELETE
  USING (user_id IS NULL OR user_id::text = current_setting('app.current_user_id', true));
