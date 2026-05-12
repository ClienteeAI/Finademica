-- 0. CREATE QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    module TEXT,
    level TEXT,
    score INTEGER,
    passed BOOLEAN,
    answers JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 1. FIX ACTIVITY LOG RLS (Allow frontend inserts)
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own activity log" ON activity_log;
CREATE POLICY "Users can insert own activity log" ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id::text = auth.uid()::text);

-- 2. FIX QUIZ ATTEMPTS RLS (Allow frontend inserts)
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id::text = auth.uid()::text);
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON quiz_attempts;
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id OR user_id::text = auth.uid()::text);

-- 3. ENSURE USER GAMIFICATION RLS (Allow SELECT and UPDATE if needed)
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own gamification" ON user_gamification;
CREATE POLICY "Users can view own gamification" ON user_gamification FOR SELECT USING (auth.uid() = user_id OR user_id::text = auth.uid()::text);

-- 4. FUNCTION TO CHECK DAILY LIMIT
CREATE OR REPLACE FUNCTION public.check_quiz_daily_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Return true if user has ALREADY passed a quiz today
    RETURN EXISTS (
        SELECT 1 FROM public.quiz_attempts
        WHERE user_id = p_user_id
          AND passed = true
          AND created_at >= CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
