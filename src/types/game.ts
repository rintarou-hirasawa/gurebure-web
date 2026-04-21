import { Card } from './card';

export type Zone = 'deck' | 'hand' | 'mana' | 'battle' | 'graveyard' | 'shields';

/** 山札確認エリアからの移動先（オンライン対戦・山札操作） */
export type DeckRevealDestination = 'battle' | 'mana' | 'graveyard' | 'shields' | 'deckTop' | 'deckBottom';

export interface CardInGame extends Card {
  instanceId: string;
  tapped?: boolean;
  /** 山札確認で裏向きのとき true（画像は裏面表示） */
  faceDown?: boolean;
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
  /** 山札から確認中のカード（オンライン対戦の山札操作） */
  deckReveal?: CardInGame[];
  /** 一枚ずつ確認モード（移動後に次の1枚を自動でめくる） */
  deckRevealOneByOne?: boolean;
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
