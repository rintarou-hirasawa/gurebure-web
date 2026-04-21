/*
  # cards の SELECT を API ロールに明示付与

  RLS ポリシーに加え、anon / authenticated がテーブルを読めるようにする。
  ポリシーだけでは環境によって拒否されるケースの予防。
*/

GRANT SELECT ON TABLE public.cards TO anon, authenticated;
