
-- 1. ENSURE VIDEO UNLOCKS TABLE EXISTS
CREATE TABLE IF NOT EXISTS public.user_video_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    video_id UUID REFERENCES public.videos(id),
    unlock_reason TEXT,
    unlocked_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, video_id)
);

-- 2. DEFINE VIDEO UNLOCKING FUNCTION
CREATE OR REPLACE FUNCTION public.unlock_videos_after_quiz(
    p_client_id UUID,
    p_quiz_id TEXT,
    p_quiz_score INTEGER,
    p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    v_unlocked_count INTEGER := 0;
    v_video_id UUID;
BEGIN
    -- Only unlock if score is high enough (e.g. 75%)
    IF p_quiz_score >= 75 THEN
        -- Find videos for this client that the user hasn't unlocked yet
        -- and that match the quiz module/level
        FOR v_video_id IN 
            SELECT v.id 
            FROM public.videos v
            JOIN public.client_videos cv ON v.id = cv.video_id
            WHERE cv.client_id = p_client_id
              AND v.id NOT IN (SELECT video_id FROM public.user_video_unlocks WHERE user_id = p_user_id)
            LIMIT 5 -- Unlock up to 5 videos per passed quiz
        LOOP
            INSERT INTO public.user_video_unlocks (user_id, video_id, unlock_reason)
            VALUES (p_user_id, v_video_id, 'Passed quiz: ' || p_quiz_id)
            ON CONFLICT (user_id, video_id) DO NOTHING;
            
            v_unlocked_count := v_unlocked_count + 1;
        END LOOP;
    END IF;

    RETURN v_unlocked_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. FIX GAMIFICATION TRIGGER (Ensure it works for both AUTH and PUBLIC user IDs)
CREATE OR REPLACE FUNCTION update_user_xp_from_log()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Resolve user_id: if NEW.user_id is an auth_user_id, find the public.users.id
    SELECT id INTO v_user_id FROM public.users WHERE auth_user_id = NEW.user_id OR id = NEW.user_id LIMIT 1;
    
    IF v_user_id IS NULL THEN
        v_user_id := NEW.user_id; -- Fallback
    END IF;

    -- Ensure user has a gamification record
    INSERT INTO user_gamification (user_id, xp, xp_total, level)
    VALUES (v_user_id, 0, 0, 1)
    ON CONFLICT (user_id) DO NOTHING;

    -- Update the XP total
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

DROP TRIGGER IF EXISTS tr_update_xp_on_activity ON activity_log;
CREATE TRIGGER tr_update_xp_on_activity
AFTER INSERT ON activity_log
FOR EACH ROW
EXECUTE FUNCTION update_user_xp_from_log();

-- 4. ENABLE RLS
ALTER TABLE user_video_unlocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own unlocks" ON user_video_unlocks;
CREATE POLICY "Users can view own unlocks" ON user_video_unlocks FOR SELECT USING (auth.uid() = user_id OR user_id::text = auth.uid()::text);
