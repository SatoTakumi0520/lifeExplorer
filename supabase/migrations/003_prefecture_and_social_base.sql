-- Migration 003: prefecture カラム追加 + ソーシャル基盤（Option A/B 対応）
-- 実行方法: Supabase Dashboard > SQL Editor にペーストして実行

-- ─── user_settings に prefecture 追加 ────────────────────────────
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS prefecture TEXT;

-- ─── borrow_history にイベント借用対応 ───────────────────────────
-- persona_id が NULL でもよい（外部イベントからの借用に対応）
ALTER TABLE borrow_history
  ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'persona',
  -- 'persona' | 'event' | 'user_routine'
  ADD COLUMN IF NOT EXISTS source_title TEXT,
  ADD COLUMN IF NOT EXISTS tried_count INTEGER DEFAULT 1;

-- ─── public_routines（Option B 先行準備）────────────────────────
-- ユーザーが公開するルーティン
CREATE TABLE IF NOT EXISTS public_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'custom',
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT FALSE,
  like_count INTEGER DEFAULT 0,
  borrow_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public_routines ENABLE ROW LEVEL SECURITY;

-- 公開ルーティンは全員が読める
CREATE POLICY "Public routines are viewable by everyone"
  ON public_routines FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
  ON public_routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON public_routines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
  ON public_routines FOR DELETE
  USING (auth.uid() = user_id);

-- ─── likes テーブル（Option B 先行準備）────────────────────────
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  routine_id UUID REFERENCES public_routines ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, routine_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes"
  ON likes FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own likes"
  ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE USING (auth.uid() = user_id);

-- ─── follows テーブル（Option B 先行準備）───────────────────────
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users NOT NULL,
  following_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own follows"
  ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON follows FOR DELETE USING (auth.uid() = follower_id);

-- ─── like_count を自動更新するトリガー ──────────────────────────
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public_routines SET like_count = like_count + 1 WHERE id = NEW.routine_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public_routines SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.routine_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_like_change ON likes;
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_like_count();
