-- Onboarding preferences columns for user_settings
-- Stores user's category preferences and lifestyle rhythm from onboarding questionnaire

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS preferred_categories JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS lifestyle_rhythm TEXT;
