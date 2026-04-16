-- Migration 008: User follows

CREATE TABLE IF NOT EXISTS user_follows (
  follower_id   UUID REFERENCES auth.users NOT NULL,
  following_id  UUID REFERENCES auth.users NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);

ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_follows' AND policyname='Anyone can view follows') THEN
    CREATE POLICY "Anyone can view follows" ON user_follows FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_follows' AND policyname='Users can follow others') THEN
    CREATE POLICY "Users can follow others" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_follows' AND policyname='Users can unfollow') THEN
    CREATE POLICY "Users can unfollow" ON user_follows FOR DELETE USING (auth.uid() = follower_id);
  END IF;
END $$;
