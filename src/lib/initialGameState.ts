import { GameState, CardInGame } from '../types/game';
import type { Card } from '../types/card';
import { applyCardInfoOverrides } from './cardInfoOverrides';

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Supabase の deck_cards 行（cards 結合済み）からゲーム用の山札を生成 */
export function cardInGameFromDeckCardRows(deckCards: { quantity: number; cards: Card; card_id: string }[]): CardInGame[] {
  const cards: CardInGame[] = [];
  deckCards?.forEach(dc => {
    for (let i = 0; i < dc.quantity; i++) {
      const card = applyCardInfoOverrides(dc.cards as Card);
      cards.push({
        ...card,
        type: card.card_type,
        ability: card.effect_text,
        civilization: card.race || 'なし',
        rarity: card.rarity || 'C',
        instanceId: `${dc.card_id}_${Date.now()}_${Math.random()}`
      });
    }
  });
  return shuffleArray(cards);
}

export function buildInitialGameState(
  p1: { playerId: string; deckId: string; deckPile: CardInGame[] },
  p2: { playerId: string; deckId: string; deckPile: CardInGame[] },
  startingPlayer: 1 | 2
): GameState {
  const player1Deck = p1.deckPile;
  const player2Deck = p2.deckPile;

  return {
    player1: {
      playerId: p1.playerId,
      deckId: p1.deckId,
      deck: player1Deck.slice(10),
      hand: player1Deck.slice(0, 4),
      mana: [],
      battle: [],
      graveyard: [],
      shields: player1Deck.slice(4, 10)
    },
    player2: {
      playerId: p2.playerId,
      deckId: p2.deckId,
      deck: player2Deck.slice(10),
      hand: player2Deck.slice(0, 4),
      mana: [],
      battle: [],
      graveyard: [],
      shields: player2Deck.slice(4, 10)
    },
    currentTurn: 1,
    activePlayer: startingPlayer,
    startingPlayer
  };
}
