/*
  # Create Cards Table for Brave Grave Card Game

  1. New Tables
    - `cards`
      - `id` (uuid, primary key) - Unique card identifier
      - `name` (text) - Card name
      - `card_type` (text) - Card type (e.g., Unit, Spell, Trap)
      - `rarity` (text) - Card rarity (Common, Rare, Super Rare, etc.)
      - `cost` (integer) - Card cost
      - `attack` (integer) - Attack value (nullable for non-unit cards)
      - `defense` (integer) - Defense value (nullable for non-unit cards)
      - `effect_text` (text) - Card effect description
      - `flavor_text` (text) - Flavor text (nullable)
      - `image_url` (text) - URL to card image
      - `attribute` (text) - Card attribute (Fire, Water, Earth, Wind, Light, Dark)
      - `level` (integer) - Card level
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `cards` table
    - Add policy for public read access (card data is public information)
*/

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  card_type text NOT NULL,
  rarity text NOT NULL,
  cost integer NOT NULL DEFAULT 0,
  attack integer,
  defense integer,
  effect_text text NOT NULL,
  flavor_text text,
  image_url text NOT NULL,
  attribute text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cards are publicly readable"
  ON cards FOR SELECT
  TO anon
  USING (true);