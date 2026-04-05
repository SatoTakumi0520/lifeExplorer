-- Migration 005: Social features — public_routines + routine_likes

-- ── public_routines ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public_routines (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users NOT NULL UNIQUE,
  display_name  TEXT NOT NULL DEFAULT 'Explorer',
  title         TEXT NOT NULL DEFAULT '私の一日',
  category      TEXT,
  routine_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  likes_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public_routines ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='public_routines' AND policyname='Anyone can view public routines') THEN
    CREATE POLICY "Anyone can view public routines" ON public_routines FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='public_routines' AND policyname='Users can publish own routine') THEN
    CREATE POLICY "Users can publish own routine" ON public_routines FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='public_routines' AND policyname='Users can update own routine') THEN
    CREATE POLICY "Users can update own routine" ON public_routines FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='public_routines' AND policyname='Users can delete own routine') THEN
    CREATE POLICY "Users can delete own routine" ON public_routines FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── routine_likes ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routine_likes (
  routine_id  UUID REFERENCES public_routines(id) ON DELETE CASCADE NOT NULL,
  user_id     UUID REFERENCES auth.users NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (routine_id, user_id)
);

ALTER TABLE routine_likes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_likes' AND policyname='Anyone can view likes') THEN
    CREATE POLICY "Anyone can view likes" ON routine_likes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_likes' AND policyname='Users can add likes') THEN
    CREATE POLICY "Users can add likes" ON routine_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_likes' AND policyname='Users can remove own likes') THEN
    CREATE POLICY "Users can remove own likes" ON routine_likes FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
