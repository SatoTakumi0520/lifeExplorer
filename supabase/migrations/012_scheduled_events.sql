-- Migration 012: Scheduled events (one-time events on specific dates)
-- Events from Explore screen that appear in timeline on their date

CREATE TABLE IF NOT EXISTS scheduled_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users NOT NULL,
  title       TEXT NOT NULL,
  event_date  TEXT NOT NULL,          -- 'YYYY-MM-DD'
  start_time  TEXT NOT NULL,          -- 'HH:mm'
  end_time    TEXT,
  location    TEXT,
  url         TEXT,
  category    TEXT,
  source      TEXT,                   -- 'doorkeeper' | 'curated'
  thought     TEXT DEFAULT '',
  type        TEXT NOT NULL CHECK (type IN ('nature', 'mind', 'work')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_events_user_date
  ON scheduled_events(user_id, event_date);

ALTER TABLE scheduled_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='scheduled_events' AND policyname='Users can view own events') THEN
    CREATE POLICY "Users can view own events" ON scheduled_events FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='scheduled_events' AND policyname='Users can insert own events') THEN
    CREATE POLICY "Users can insert own events" ON scheduled_events FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='scheduled_events' AND policyname='Users can delete own events') THEN
    CREATE POLICY "Users can delete own events" ON scheduled_events FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
