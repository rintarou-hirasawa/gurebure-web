/*
  # Update Unique Cards

  1. Changes
    - Mark specific cards as unique (is_unique = true)
    - Cards to be marked as unique:
      - 呪悪の首飾り(アブダクト・ペンダント)
      - ビースト・リベレイション
      - 虐天の大剣 ルミナス・カリバー
      - 時を渡る宝箱

  2. Notes
    - This migration uses UPDATE to set is_unique flag
    - Uses IF EXISTS to prevent errors
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'is_unique'
  ) THEN
    UPDATE cards
    SET is_unique = true
    WHERE name IN (
      '呪悪の首飾り(アブダクト・ペンダント)',
      'ビースト・リベレイション',
      '虐天の大剣 ルミナス・カリバー',
      '時を渡る宝箱'
    );
  END IF;
END $$;