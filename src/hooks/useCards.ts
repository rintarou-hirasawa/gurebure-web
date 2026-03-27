import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card, SearchFilters, POWER_FILTER_MIN, POWER_FILTER_MAX } from '../types/card';

export function useCards(filters: SearchFilters) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, [filters]);

  async function fetchCards() {
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

      let list = data || [];

      if (filters.raceComplexity === 'multi') {
        list = list.filter(c => c.race && c.race.includes('/'));
      } else if (filters.raceComplexity === 'mono') {
        list = list.filter(c => !c.race || !c.race.includes('/'));
      }

      setCards(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  }

  return { cards, loading, error };
}
