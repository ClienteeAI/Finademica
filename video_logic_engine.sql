-- ==========================================
-- VIDEO REWARD & GAMIFICATION ENGINE (V2)
-- ==========================================

-- 1. TRACKING TABLES
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    quiz_id UUID REFERENCES public.quizzes(id),
    score INTEGER,
    passed BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_daily_unlocks (
    user_id UUID REFERENCES public.users(id),
    unlock_date DATE DEFAULT current_date,
    unlock_count INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, unlock_date)
);

-- 2. CORE UNLOCK FUNCTION
CREATE OR REPLACE FUNCTION public.fn_process_video_unlock(
    p_user_id UUID,
    p_reason TEXT,
    p_category TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 1
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
    v_daily_count INTEGER;
    v_unlocked_count INTEGER := 0;
    v_video_record RECORD;
begin
    -- 1. Check Daily Cap (Max 5 total per day)
    insert into public.user_daily_unlocks (user_id, unlock_date, unlock_count)
    values (p_user_id, current_date, 0)
    on conflict (user_id, unlock_date) do nothing;

    select unlock_count into v_daily_count 
    from public.user_daily_unlocks 
    where user_id = p_user_id and unlock_date = current_date;

    if v_daily_count >= 5 then
        return 0; -- Hard cap reached. New day, new start.
    end if;

    -- 2. Calculate remaining capacity for today
    p_limit := least(p_limit, 5 - v_daily_count);

    -- 3. Select next videos to unlock
    for v_video_record in (
        select v.id
        from public.videos v
        where v.is_active = true
          and (p_category is null or v.category = p_category or v.category = 'general')
          and not exists (
              select 1 from public.user_video_unlocks uvu 
              where uvu.user_id = p_user_id and uvu.video_id = v.id
          )
          and v.visibility != 'locked'
        order by (case when v.category = p_category then 0 else 1 end), v.order_priority asc, v.created_at asc
        limit p_limit
    ) loop
        insert into public.user_video_unlocks (user_id, video_id, unlock_reason)
        values (p_user_id, v_video_record.id, p_reason)
        on conflict do nothing;

        v_unlocked_count := v_unlocked_count + 1;
    end loop;

    -- 4. Update daily count
    update public.user_daily_unlocks
    set unlock_count = unlock_count + v_unlocked_count
    where user_id = p_user_id and unlock_date = current_date;

    return v_unlocked_count;
end;
$$;

-- 3. TRIGGERS

-- Trigger for Quiz Results
CREATE OR REPLACE FUNCTION public.tr_on_quiz_result()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
    v_quiz_cat TEXT;
begin
    if new.passed then
        select module into v_quiz_cat from public.quizzes where id = new.quiz_id;
        perform public.fn_process_video_unlock(new.user_id, 'quiz_success', v_quiz_cat, 5);
    end if;
    return new;
end;
$$;

DROP TRIGGER IF EXISTS tr_quiz_video_unlock ON public.quiz_results;
CREATE TRIGGER tr_quiz_video_unlock
AFTER INSERT ON public.quiz_results
FOR EACH ROW EXECUTE FUNCTION public.tr_on_quiz_result();

-- Trigger for Video Views (Binge Reward)
CREATE OR REPLACE FUNCTION public.tr_on_video_view()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
    v_view_count INTEGER;
begin
    if new.is_completed then
        select count(*) into v_view_count 
        from public.video_views 
        where user_id = new.user_id and is_completed = true;

        if v_view_count % 10 = 0 then
            perform public.fn_process_video_unlock(new.user_id, 'binge_reward', 'general', 2);
        end if;
    end if;
    return new;
end;
$$;

DROP TRIGGER IF EXISTS tr_video_view_binge ON public.video_views;
CREATE TRIGGER tr_video_view_binge
AFTER INSERT OR UPDATE ON public.video_views
FOR EACH ROW EXECUTE FUNCTION public.tr_on_video_view();
