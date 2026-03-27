/*
  # Create Decks Tables

  1. New Tables
    - `decks`
      - `id` (uuid, primary key) - Unique identifier for the deck
      - `name` (text) - Name of the deck
      - `user_id` (uuid) - Owner of the deck (for future auth)
      - `created_at` (timestamptz) - When the deck was created
      - `updated_at` (timestamptz) - When the deck was last updated
    
    - `deck_cards`
      - `id` (uuid, primary key) - Unique identifier for the deck card entry
      - `deck_id` (uuid, foreign key) - References decks table
      - `card_id` (uuid, foreign key) - References cards table
      - `quantity` (integer) - Number of this card in the deck
      - `created_at` (timestamptz) - When the card was added to deck

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (for now, since no auth yet)
    
  3. Indexes
    - Add index on deck_cards(deck_id) for faster lookups
    - Add unique constraint on deck_cards(deck_id, card_id)
*/

-- Create decks table
CREATE TABLE IF NOT EXISTS decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'New Deck',
  user_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deck_cards table
CREATE TABLE IF NOT EXISTS deck_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 4),
  created_at timestamptz DEFAULT now(),
  UNIQUE(deck_id, card_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deck_cards_deck_id ON deck_cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_deck_cards_card_id ON deck_cards(card_id);

-- Enable RLS
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (temporary until auth is added)
CREATE POLICY "Anyone can view decks"
  ON decks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create decks"
  ON decks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update decks"
  ON decks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete decks"
  ON decks FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can view deck cards"
  ON deck_cards FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add cards to decks"
  ON deck_cards FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update deck cards"
  ON deck_cards FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can remove cards from decks"
  ON deck_cards FOR DELETE
  TO public
  USING (true);