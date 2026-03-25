-- Sprint 2: AI基盤テーブル
-- 実行方法: Supabase Dashboard > SQL Editor にペーストして実行

-- ─── ユーザー設定（APIキー・プロバイダ選択） ──────────────────────
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  ai_provider TEXT NOT NULL DEFAULT 'anthropic',
  ai_api_key_encrypted TEXT,
  ai_model TEXT DEFAULT 'claude-sonnet-4-20250514',
  display_name TEXT,
  timezone TEXT DEFAULT 'Asia/Tokyo',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: ユーザーは自分の設定のみアクセス可能
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── AI生成ペルソナ ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'bg-stone-100 text-stone-800',
  category TEXT DEFAULT 'custom',
  routine JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_personas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personas"
  ON ai_personas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personas"
  ON ai_personas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own personas"
  ON ai_personas FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 借用履歴 ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS borrow_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  persona_name TEXT NOT NULL,
  persona_id UUID REFERENCES ai_personas ON DELETE SET NULL,
  borrowed_tasks JSONB DEFAULT '[]'::jsonb,
  tried_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE borrow_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
  ON borrow_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON borrow_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── user_tasks にソース情報追加 ────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_tasks' AND column_name = 'source'
  ) THEN
    ALTER TABLE user_tasks ADD COLUMN source TEXT DEFAULT 'manual';
  END IF;
END $$;
