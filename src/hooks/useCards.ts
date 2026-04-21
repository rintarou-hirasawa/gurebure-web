import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { applyCardInfoOverrides } from '../lib/cardInfoOverrides';
import { Card, SearchFilters, POWER_FILTER_MIN, POWER_FILTER_MAX } from '../types/card';

function formatFetchError(err: unknown): string {
  if (err && typeof err === 'object' && err !== null && 'message' in err) {
    const e = err as {
      message: string;
      details?: string;
      hint?: string;
      code?: string;
    };
    const parts = [e.message];
    if (e.code) parts.push(`code: ${e.code}`);
    if (e.details) parts.push(e.details);
    if (e.hint) parts.push(`hint: ${e.hint}`);
    return parts.join(' — ');
  }
  if (err instanceof Error) return err.message;
  return 'Failed to fetch cards';
}

export function useCards(filters: SearchFilters) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('cards').select('*');

      if (filters.searchText) {
        query = query.ilike('name', `%${filters.searchText}%`);
      }

      if (filters.cardType) {
        query = query.eq('card_type', filters.cardType);
      }

      if (filters.expansion) {
        query = query.eq('expansion', filters.expansion);
      }

      if (filters.race) {
        query = query.ilike('race', `%${filters.race}%`);
      }

      if (filters.costMin > 0) {
        query = query.gte('cost', filters.costMin);
      }

      if (filters.costMax < 15) {
        query = query.lte('cost', filters.costMax);
      }

      if (filters.powerMin > POWER_FILTER_MIN) {
        query = query.gte('power', filters.powerMin);
      }

      if (filters.powerMax < POWER_FILTER_MAX) {
        query = query.lte('power', filters.powerMax);
      }

      if (filters.isUnique === true) {
        query = query.eq('is_unique', true);
      } else if (filters.isUnique === false) {
        query = query.eq('is_unique', false);
      }

      query = query.order('cost', { ascending: true }).order('name', { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      let list = ((data || []) as Card[]).map(applyCardInfoOverrides);

      if (filters.raceComplexity === 'multi') {
        list = list.filter(c => c.race && c.race.includes('/'));
      } else if (filters.raceComplexity === 'mono') {
        list = list.filter(c => !c.race || !c.race.includes('/'));
      }

      setCards(list);
    } catch (err: unknown) {
      setError(formatFetchError(err));
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fetchCards();
    }, 280);
    return () => window.clearTimeout(t);
  }, [fetchCards]);

  return { cards, loading, error };
}
