/*
  # API ロール（anon / authenticated）への権限付与

  新規 Supabase プロジェクトでは、public テーブルへの GRANT が不足していると
  PostgREST 経由の insert/select が失敗することがある。
*/

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.cards TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.decks TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.deck_cards TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.rooms TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.room_participants TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.game_matches TO anon, authenticated;
