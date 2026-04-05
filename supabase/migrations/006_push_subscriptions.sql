-- Migration 006: Push notification subscriptions

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users NOT NULL,
  endpoint     TEXT NOT NULL,
  p256dh       TEXT NOT NULL,
  auth         TEXT NOT NULL,
  reminder_hour   INTEGER NOT NULL DEFAULT 7,  -- 0-23
  reminder_minute INTEGER NOT NULL DEFAULT 0,  -- 0-59
  enabled      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, endpoint)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='push_subscriptions' AND policyname='Users can manage own subscriptions') THEN
    CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
