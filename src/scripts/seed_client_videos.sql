
-- 1. LINK ALL VIDEOS TO FINADEMICA CLIENT
-- This ensures the unlocking system can find videos to unlock
INSERT INTO public.client_videos (client_id, video_id, is_active)
SELECT 'a6151fd9-1513-4ae0-b960-25454f3a9bf2', id, true
FROM public.videos
ON CONFLICT DO NOTHING;

-- 2. DEFINE XP RULES
INSERT INTO public.xp_rules (action_key, points, is_active)
VALUES ('quiz_pass', 100, true)
ON CONFLICT (id) DO NOTHING;

-- 3. ENSURE USER GAMIFICATION TRIGGER IS ROBUST
CREATE OR REPLACE FUNCTION update_user_xp_from_log()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- 1. Determine the internal user ID
    -- NEW.user_id could be an auth.uid() or a public.users.id
    SELECT id INTO v_user_id 
    FROM public.users 
    WHERE auth_user_id = NEW.user_id OR id = NEW.user_id 
    LIMIT 1;
    
    -- 2. If no profile exists yet, create one (or use the provided ID if it looks like a valid profile)
    IF v_user_id IS NULL THEN
        v_user_id := NEW.user_id;
    END IF;

    -- 3. Ensure a gamification row exists
    INSERT INTO user_gamification (user_id, xp, xp_total, level)
    VALUES (v_user_id, 0, 0, 1)
    ON CONFLICT (user_id) DO NOTHING;

    -- 4. Award XP
    IF NEW.points_awarded > 0 THEN
        UPDATE user_gamification
        SET xp = xp + NEW.points_awarded,
            xp_total = xp_total + NEW.points_awarded,
            updated_at = now()
        WHERE user_id = v_user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RE-INITIALIZE THE TRIGGER
DROP TRIGGER IF EXISTS tr_update_xp_on_activity ON activity_log;
CREATE TRIGGER tr_update_xp_on_activity
AFTER INSERT ON activity_log
FOR EACH ROW
EXECUTE FUNCTION update_user_xp_from_log();
