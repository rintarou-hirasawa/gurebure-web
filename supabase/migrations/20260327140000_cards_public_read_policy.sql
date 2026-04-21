/*
  # cards の公開読み取りを安定化

  以前のマイグレーションでは `TO anon` のみ指定している場合があり、
  PostgREST 経由の読み取りで RLS が期待どおり効かないことがある。
  `USING (true)` のみのポリシーに差し替え、SELECT を明示的に許可する。
*/

DROP POLICY IF EXISTS "Cards are publicly readable" ON public.cards;

CREATE POLICY "Cards are publicly readable"
  ON public.cards
  FOR SELECT
  USING (true);
