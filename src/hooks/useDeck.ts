import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Deck, DeckCard, DeckStats } from '../types/deck';
import { Card } from '../types/card';
import { useAuth } from '../contexts/AuthContext';

export function useDeck(deckId?: string | null) {
  const { user: authUser } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** 連打で同一チェックより先に複数回 add が走るのを防ぐ */
  const addCardMutexRef = useRef(false);

  useEffect(() => {
    if (deckId) {
      loadDeck();
    } else {
      loadAllDecks();
    }
  }, [deckId, authUser?.id]);

  const loadAllDecks = async () => {
    try {
      setLoading(true);
      const user = authUser;

      const query = supabase
        .from('decks')
        .select(`
          *,
          deck_cards(quantity)
        `)
        .order('updated_at', { ascending: false });

      if (user) {
        query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const decksWithCount = (data || []).map(d => ({
        ...d,
        card_count: d.deck_cards.reduce((sum: number, dc: any) => sum + dc.quantity, 0)
      }));

      setDecks(decksWithCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  const loadDeck = async () => {
    if (!deckId) return;

    try {
      setLoading(true);
      const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .select('*')
        .eq('id', deckId)
        .maybeSingle();

      if (deckError) throw deckError;

      const { data: cardsData, error: cardsError } = await supabase
        .from('deck_cards')
        .select(`
          *,
          card:cards(*)
        `)
        .eq('deck_id', deckId)
        .order('created_at', { ascending: true });

      if (cardsError) throw cardsError;

      setDeck(deckData);
      setDeckCards(cardsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck');
    } finally {
      setLoading(false);
    }
  };

  const createDeck = async (name: string = ''): Promise<string | null> => {
    try {
      const user = authUser;
      if (!user) {
        setError('デッキを保存するにはログインが必要です');
        return null;
      }

      const { data: existingDecks } = await supabase
        .from('decks')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (existingDecks && existingDecks.length >= 6) {
        const oldestDeck = existingDecks[0];
        await supabase.from('deck_cards').delete().eq('deck_id', oldestDeck.id);
        await supabase.from('decks').delete().eq('id', oldestDeck.id);
      }

      const trimmed = name.trim();
      const { data, error } = await supabase
        .from('decks')
        .insert({ name: trimmed, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deck');
      return null;
    }
  };

  const updateDeckName = useCallback(
    async (name: string) => {
      if (!deckId) return;

      const trimmed = name.trim();
      try {
        const { error } = await supabase
          .from('decks')
          .update({ name: trimmed, updated_at: new Date().toISOString() })
          .eq('id', deckId);

        if (error) throw error;
        setDeck(prev => (prev ? { ...prev, name: trimmed } : null));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update deck name');
      }
    },
    [deckId]
  );

  const addCardToDeck = async (card: Card) => {
    if (!deckId) return;
    if (addCardMutexRef.current) return;
    addCardMutexRef.current = true;

    try {
      setError(null);

      const stats = calculateStats();
      if (stats.totalCards >= 40) {
        setError('デッキは40枚までです');
        return;
      }

      if (card.is_unique) {
        const anyUniqueRow = deckCards.find(dc => dc.card_id === card.id);
        if (anyUniqueRow && anyUniqueRow.quantity >= 1) {
          setError('ユニークカードはデッキに1枚までです');
          return;
        }
      } else {
        const existingNonU = deckCards.find(dc => dc.card_id === card.id);
        if (existingNonU && existingNonU.quantity >= 4) {
          setError('カードは最大4枚までです');
          return;
        }
      }

      const existing = deckCards.find(dc => dc.card_id === card.id);

      if (existing) {
        if (card.is_unique) {
          setError('ユニークカードはデッキに1枚までです');
          return;
        }
        const { error } = await supabase
          .from('deck_cards')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);

        if (error) throw error;

        setDeckCards(prev =>
          prev.map(dc =>
            dc.id === existing.id ? { ...dc, quantity: dc.quantity + 1 } : dc
          )
        );
      } else {
        const { data, error } = await supabase
          .from('deck_cards')
          .insert({ deck_id: deckId, card_id: card.id, quantity: 1 })
          .select(`
            *,
            card:cards(*)
          `)
          .single();

        if (error) throw error;
        setDeckCards(prev => [...prev, data]);
      }

      await supabase
        .from('decks')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', deckId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card');
    } finally {
      addCardMutexRef.current = false;
    }
  };

  const removeCardFromDeck = async (deckCardId: string) => {
    if (!deckId) return;

    try {
      const deckCard = deckCards.find(dc => dc.id === deckCardId);
      if (!deckCard) return;

      if (deckCard.quantity > 1) {
        const { error } = await supabase
          .from('deck_cards')
          .update({ quantity: deckCard.quantity - 1 })
          .eq('id', deckCardId);

        if (error) throw error;

        setDeckCards(prev =>
          prev.map(dc =>
            dc.id === deckCardId ? { ...dc, quantity: dc.quantity - 1 } : dc
          )
        );
      } else {
        const { error } = await supabase
          .from('deck_cards')
          .delete()
          .eq('id', deckCardId);

        if (error) throw error;

        setDeckCards(prev => prev.filter(dc => dc.id !== deckCardId));
      }

      await supabase
        .from('decks')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', deckId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove card');
    }
  };

  const clearDeck = async () => {
    if (!deckId) return;

    try {
      const { error } = await supabase
        .from('deck_cards')
        .delete()
        .eq('deck_id', deckId);

      if (error) throw error;

      setDeckCards([]);

      await supabase
        .from('decks')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', deckId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear deck');
    }
  };

  /**
   * デッキを削除。戻り値で親が URL 切り替えや新規作成を判断する。
   */
  const deleteDeck = async (
    targetId: string
  ): Promise<{ ok: boolean; wasCurrent: boolean; nextDeckId: string | null }> => {
    const user = authUser;
    if (!user) {
      setError('デッキを削除するにはログインが必要です');
      return { ok: false, wasCurrent: false, nextDeckId: null };
    }

    try {
      setError(null);
      await supabase.from('deck_cards').delete().eq('deck_id', targetId);
      const { error: delErr } = await supabase
        .from('decks')
        .delete()
        .eq('id', targetId)
        .eq('user_id', user.id);

      if (delErr) throw delErr;

      const { data: remaining, error: listErr } = await supabase
        .from('decks')
        .select(`
          *,
          deck_cards(quantity)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (listErr) throw listErr;

      const nextList = (remaining || []).map((d: any) => ({
        ...d,
        card_count: d.deck_cards.reduce((sum: number, dc: any) => sum + dc.quantity, 0),
      }));
      setDecks(nextList);

      const wasCurrent = deckId === targetId;
      if (wasCurrent) {
        setDeck(null);
        setDeckCards([]);
      }

      const nextDeckId = nextList[0]?.id ?? null;
      return { ok: true, wasCurrent, nextDeckId };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'デッキの削除に失敗しました');
      return { ok: false, wasCurrent: false, nextDeckId: null };
    }
  };

  /** カードは都度保存済み。ルール確認後に updated_at を更新し一覧を更新する。 */
  const saveDeckExplicitly = async (): Promise<{ ok: boolean }> => {
    if (!deckId) {
      setError('デッキが選択されていません');
      return { ok: false };
    }
    try {
      setError(null);
      const { error: upErr } = await supabase
        .from('decks')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', deckId);
      if (upErr) throw upErr;
      setDeck(prev =>
        prev ? { ...prev, updated_at: new Date().toISOString() } : null
      );
      await loadAllDecks();
      return { ok: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存の記録に失敗しました');
      return { ok: false };
    }
  };

  const calculateStats = (): DeckStats => {
    let totalCards = 0;
    let grCount = 0;
    let superGrCount = 0;
    let uniqueCount = 0;

    deckCards.forEach(dc => {
      totalCards += dc.quantity;
      if (dc.card?.rarity === 'GR') {
        grCount += dc.quantity;
      }
      if (dc.card?.rarity === '超GR') {
        superGrCount += dc.quantity;
      }
      if (dc.card?.is_unique) {
        uniqueCount += dc.quantity;
      }
    });

    return {
      totalCards,
      mainDeckCount: totalCards,
      grCount,
      superGrCount,
      specialCards: 0,
      uniqueCount,
    };
  };

  return {
    decks,
    deck,
    deckCards,
    loading,
    error,
    createDeck,
    updateDeckName,
    addCardToDeck,
    removeCardFromDeck,
    clearDeck,
    calculateStats,
    refreshDeck: loadDeck,
    refreshDecks: loadAllDecks,
    saveDeckExplicitly,
    deleteDeck,
  };
}
