/*
  # Remove Duplicate Third Expansion Cards

  1. Changes
    - Delete duplicate cards from the third expansion (三弾)
    - Keep only one copy of each card (the one with the lowest id)

  2. Details
    - All 35 third expansion cards were inserted twice
    - This migration removes the duplicates while preserving one copy of each
*/

-- Delete duplicate cards, keeping only the one with the lowest ID for each name
DELETE FROM cards
WHERE id IN (
  SELECT id
  FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY name ORDER BY id) as rn
    FROM cards
    WHERE expansion = '三弾'
  ) t
  WHERE rn > 1
);
