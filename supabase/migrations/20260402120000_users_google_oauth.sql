/*
  # Google OAuth（Supabase Auth）と public.users の連携

  - auth.users（Supabase Auth）でログインしたユーザーを public.users に1行対応させる
  - OAuth ユーザーは password_hash を NULL
*/

ALTER TABLE public.users
  ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS auth_user_id uuid UNIQUE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_auth_user_id_fkey'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_auth_user_id_fkey
      FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);

COMMENT ON COLUMN public.users.auth_user_id IS 'Supabase Auth のユーザーID（Google ログイン等）';
