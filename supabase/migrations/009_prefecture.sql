-- Migration 009: Add prefecture column to user_settings
-- Fixes: upsert failure in useOnboarding due to missing column

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS prefecture TEXT;
