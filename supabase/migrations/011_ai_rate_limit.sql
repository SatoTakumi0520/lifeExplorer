-- AI生成レートリミット用カラム追加
-- user_settingsテーブルに1日あたりの生成回数を追跡するカラムを追加

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'ai_generate_count'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN ai_generate_count INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'ai_generate_date'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN ai_generate_date TEXT;
  END IF;
END $$;
