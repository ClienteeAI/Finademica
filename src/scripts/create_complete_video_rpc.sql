-- 1. Ensure columns and constraints exist
ALTER TABLE public.user_gamification 
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_video_view') THEN
        ALTER TABLE public.video_views ADD CONSTRAINT unique_user_video_view UNIQUE (user_id, video_id);
    END IF;
END $$;

-- 2. RPC: complete_video
-- Handles video completion, XP rewards, and leveling up
CREATE OR REPLACE FUNCTION public.complete_video(
    p_user_id UUID,
    p_video_id UUID,
    p_points INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_already_completed BOOLEAN;
    v_new_xp INTEGER;
    v_new_level INTEGER;
    v_total_completed INTEGER;
BEGIN
    -- 1. Check if already completed
    SELECT is_completed INTO v_already_completed
    FROM public.video_views
    WHERE user_id = p_user_id AND video_id = p_video_id;

    -- 2. Mark as completed (or update)
    INSERT INTO public.video_views (user_id, video_id, is_completed, completed_at)
    VALUES (p_user_id, p_video_id, true, now())
    ON CONFLICT (user_id, video_id) DO UPDATE 
    SET is_completed = true, completed_at = now();

    -- 3. Update Gamification if first time
    IF v_already_completed IS NOT TRUE THEN
        -- Ensure record exists
        INSERT INTO public.user_gamification (user_id, xp, xp_total, level, videos_completed)
        VALUES (p_user_id, 0, 0, 1, 0)
        ON CONFLICT (user_id) DO NOTHING;

        -- Add points and increment count
        UPDATE public.user_gamification
        SET 
            xp = xp + p_points,
            xp_total = xp_total + p_points,
            videos_completed = videos_completed + 1,
            last_activity_at = now(),
            updated_at = now()
        WHERE user_id = p_user_id
        RETURNING xp, level, videos_completed INTO v_new_xp, v_new_level, v_total_completed;

        -- Check for Level Up (based on xp_levels table)
        SELECT level INTO v_new_level
        FROM public.xp_levels
        WHERE min_xp <= v_new_xp
        ORDER BY level DESC
        LIMIT 1;

        IF v_new_level > (SELECT level FROM public.user_gamification WHERE user_id = p_user_id) THEN
            UPDATE public.user_gamification
            SET level = v_new_level
            WHERE user_id = p_user_id;
        END IF;
    ELSE
        -- Just get current stats
        SELECT xp, level, videos_completed INTO v_new_xp, v_new_level, v_total_completed
        FROM public.user_gamification
        WHERE user_id = p_user_id;
    END IF;

    -- 4. Return result
    RETURN json_build_object(
        'user_id', p_user_id,
        'total_points', v_new_xp,
        'videos_completed', v_total_completed,
        'level', v_new_level,
        'already_completed', COALESCE(v_already_completed, false)
    );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.complete_video(UUID, UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_video(UUID, UUID, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.complete_video(UUID, UUID, INTEGER) TO service_role;
