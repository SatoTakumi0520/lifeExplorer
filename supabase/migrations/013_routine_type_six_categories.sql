-- 013_routine_type_six_categories.sql
-- ─────────────────────────────────────────────────────────────────────
-- タスクの type を 3 カテゴリ (nature/mind/work) から 6 カテゴリ
-- (work/create/study/care/enjoy/connect) に拡張する。
--
-- 軸: その時間で何が起きるか
--   work    経済義務として外に出す
--   create  自発的に外に出す
--   study   外から取り込む
--   care    自分を保つ
--   enjoy   一人で解放する
--   connect 他者と共有する
--
-- 旧データのマッピング:
--   nature → enjoy(散策・運動・自然の多くは「楽しむ」が主目的)
--   mind   → study(瞑想・読書・内省の多くは「学ぶ」が主目的)
--   work   → work(変更なし)
-- ─────────────────────────────────────────────────────────────────────

-- routine_templates
ALTER TABLE routine_templates
  DROP CONSTRAINT IF EXISTS routine_templates_type_check;

UPDATE routine_templates
   SET type = CASE
     WHEN type = 'nature' THEN 'enjoy'
     WHEN type = 'mind'   THEN 'study'
     ELSE type
   END;

ALTER TABLE routine_templates
  ADD CONSTRAINT routine_templates_type_check
  CHECK (type IN ('work', 'create', 'study', 'care', 'enjoy', 'connect'));

-- scheduled_events
ALTER TABLE scheduled_events
  DROP CONSTRAINT IF EXISTS scheduled_events_type_check;

UPDATE scheduled_events
   SET type = CASE
     WHEN type = 'nature' THEN 'enjoy'
     WHEN type = 'mind'   THEN 'study'
     ELSE type
   END;

ALTER TABLE scheduled_events
  ADD CONSTRAINT scheduled_events_type_check
  CHECK (type IN ('work', 'create', 'study', 'care', 'enjoy', 'connect'));
