-- Migration 010: Routine templates (persistent weekday/weekend routines)
-- Replaces per-day user_tasks with reusable routine templates

CREATE TABLE IF NOT EXISTS routine_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users NOT NULL,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('weekday', 'weekend')),
  title         TEXT NOT NULL,
  thought       TEXT DEFAULT '',
  type          TEXT NOT NULL CHECK (type IN ('nature', 'mind', 'work')),
  start_time    TEXT NOT NULL,
  end_time      TEXT,
  source        TEXT DEFAULT 'manual',
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routine_templates_user_schedule
  ON routine_templates(user_id, schedule_type);

ALTER TABLE routine_templates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_templates' AND policyname='Users can view own templates') THEN
    CREATE POLICY "Users can view own templates" ON routine_templates FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_templates' AND policyname='Users can insert own templates') THEN
    CREATE POLICY "Users can insert own templates" ON routine_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_templates' AND policyname='Users can update own templates') THEN
    CREATE POLICY "Users can update own templates" ON routine_templates FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='routine_templates' AND policyname='Users can delete own templates') THEN
    CREATE POLICY "Users can delete own templates" ON routine_templates FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
