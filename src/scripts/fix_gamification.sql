
-- 1. FIX ACTIVITY LOG SCHEMA
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS points_awarded INTEGER DEFAULT 0;
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS activity_type TEXT;
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS activity_data JSONB;

-- 2. SEED XP LEVELS (Ensure progress bar works)
DELETE FROM xp_levels;
INSERT INTO xp_levels (level, min_xp, title) VALUES
(1, 0, 'Rookie'),
(2, 500, 'Explorer'),
(3, 1250, 'Grinder'),
(4, 2500, 'Strategist'),
(5, 5000, 'Technician'),
(6, 10000, 'Risk Manager'),
(7, 20000, 'Execution Pro'),
(8, 40000, 'Consistency King'),
(9, 75000, 'Funded Ready'),
(10, 150000, 'Master Trader')
ON CONFLICT (level) DO UPDATE SET min_xp = EXCLUDED.min_xp, title = EXCLUDED.title;

-- 3. AUTOMATIC XP UPDATER (Trigger)
CREATE OR REPLACE FUNCTION update_user_xp_from_log()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure user has a gamification record
    INSERT INTO user_gamification (user_id, xp, xp_total, level)
    VALUES (NEW.user_id, 0, 0, 1)
    ON CONFLICT (user_id) DO NOTHING;

    -- Update the XP total
    IF NEW.points_awarded > 0 THEN
        UPDATE user_gamification
        SET xp = xp + NEW.points_awarded,
            xp_total = xp_total + NEW.points_awarded,
            updated_at = now()
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_xp_on_activity ON activity_log;
CREATE TRIGGER tr_update_xp_on_activity
AFTER INSERT ON activity_log
FOR EACH ROW
EXECUTE FUNCTION update_user_xp_from_log();

-- 4. ENABLE RLS FOR ACTIVITY LOG (Public Read if needed, but usually just for system)
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own activity log" ON activity_log;
CREATE POLICY "Users can view own activity log" ON activity_log FOR SELECT USING (auth.uid() = user_id OR user_id::text = auth.uid()::text);

-- 5. ENABLE RLS FOR USER GAMIFICATION
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own gamification" ON user_gamification;
CREATE POLICY "Users can view own gamification" ON user_gamification FOR SELECT USING (auth.uid() = user_id OR user_id::text = auth.uid()::text);

-- 6. ENABLE RLS FOR XP LEVELS
ALTER TABLE xp_levels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for xp_levels" ON xp_levels;
CREATE POLICY "Public read access for xp_levels" ON xp_levels FOR SELECT USING (true);
