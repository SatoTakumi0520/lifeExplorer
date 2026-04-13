-- Migration 007: Routine comments

CREATE TABLE IF NOT EXISTS routine_comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id    UUID REFERENCES public_routines(id) ON DELETE CASCADE NOT NULL,
  user_id       UUID REFERENCES auth.users NOT NULL,
  display_name  TEXT NOT NULL DEFAULT 'Explorer',
  body          TEXT NOT NULL CHECK (char_length(body) <= 500),
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routine_comments_routine ON routine_comments(routine_id, created_at);

ALTER TABLE routine_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_comments' AND policyname='Anyone can view comments') THEN
    CREATE POLICY "Anyone can view comments" ON routine_comments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_comments' AND policyname='Users can add comments') THEN
    CREATE POLICY "Users can add comments" ON routine_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_comments' AND policyname='Users can delete own comments') THEN
    CREATE POLICY "Users can delete own comments" ON routine_comments FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
