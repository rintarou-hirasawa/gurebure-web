/*
  # Update Cards Table Schema for Brave Grave

  1. Changes
    - Drop old cards table
    - Create new cards table with updated structure:
      - Remove: rarity, attribute, attack, defense, flavor_text, level
      - Add: card_type (モンスター/呪文/装具), cost, power (nullable), abilities (array), race (種族)
      - Keep: id, name, effect_text, image_url, created_at
  
  2. Security
    - Enable RLS on new cards table
    - Add policy for public read access
*/

DROP TABLE IF EXISTS cards;

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  card_type text NOT NULL,
  cost integer NOT NULL DEFAULT 0,
  power integer,
  race text,
  abilities text[],
  effect_text text NOT NULL,
  image_url text NOT NULL,
  set_number text DEFAULT '1',
  is_unique boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cards are publicly readable"
  ON cards FOR SELECT
  TO anon
  USING (true);