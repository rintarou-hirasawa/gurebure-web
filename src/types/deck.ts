import { Card } from './card';

export interface Deck {
  id: string;
  name: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  card_count?: number;
}

export interface DeckCard {
  id: string;
  deck_id: string;
  card_id: string;
  quantity: number;
  created_at: string;
  card?: Card;
}

export interface DeckWithCards extends Deck {
  deck_cards: DeckCard[];
}

export interface DeckStats {
  totalCards: number;
  mainDeckCount: number;
  grCount: number;
  superGrCount: number;
  specialCards: number;
  /** ユニークカードの枚数（デッキ内合計） */
  uniqueCount: number;
}
