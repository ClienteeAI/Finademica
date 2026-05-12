-- ==========================================
-- FULL INFRASTRUCTURE CLONE SCRIPT (67 TABLES)
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE public.asset_type AS ENUM ('crypto', 'stocks', 'forex', 'commodities', 'indices', 'video', 'ebook', 'course', 'webinar');
    CREATE TYPE public.video_module AS ENUM ('introduction', 'basics', 'advanced', 'strategy', 'psychology', 'beginner', 'foundation', 'professional', 'intermediate');
    CREATE TYPE public.visibility_type AS ENUM ('public', 'private', 'hidden', 'locked', 'gated');
    CREATE TYPE public.video_goal AS ENUM ('education', 'onboarding', 'upsell', 'engagement', 'understanding', 'execution', 'awareness');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. CORE INFRASTRUCTURE
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT,
    subdomain TEXT UNIQUE,
    custom_domain TEXT,
    logo_url TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    company_tagline TEXT,
    active BOOLEAN DEFAULT true,
    theme_config JSONB,
    plan_type TEXT DEFAULT 'standard',
    skip_landing_page BOOLEAN DEFAULT true,
    require_quiz BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    client_id UUID REFERENCES public.clients(id),
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    phone_prefix TEXT,
    role TEXT DEFAULT 'learner',
    account_status TEXT DEFAULT 'active',
    is_admin BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    ghl_contact_id TEXT,
    broker_account_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CONTENT & LEARNING
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID,
    video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT,
    subcategory TEXT,
    difficulty TEXT,
    duration_seconds INTEGER DEFAULT 0,
    transcript TEXT,
    for_experience_level TEXT[],
    for_markets TEXT[],
    for_goals TEXT[],
    for_concerns TEXT[],
    for_time_available TEXT[],
    keywords TEXT[],
    order_priority INTEGER,
    is_active BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'cs',
    slug TEXT UNIQUE,
    asset_type public.asset_type,
    level INTEGER DEFAULT 1,
    module public.video_module,
    difficulty_score INTEGER DEFAULT 0,
    risk_level TEXT,
    goal public.video_goal,
    summary TEXT,
    prerequisites TEXT[],
    visibility public.visibility_type DEFAULT 'public',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT,
    level TEXT,
    question_count INTEGER,
    pass_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id),
    question TEXT,
    options JSONB,
    correct_option INTEGER,
    explanation TEXT
);

CREATE TABLE IF NOT EXISTS public.ebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id),
    title TEXT,
    description TEXT,
    url TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SOCIAL & FEED
CREATE TABLE IF NOT EXISTS public.feed_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id),
    user_id UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    post_type TEXT DEFAULT 'text',
    media_urls JSONB DEFAULT '[]',
    media_storage_paths JSONB DEFAULT '[]',
    status TEXT DEFAULT 'published',
    is_official BOOLEAN DEFAULT false,
    moderation_reason TEXT,
    moderated_by UUID,
    moderated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.feed_post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.feed_posts(id),
    user_id UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.feed_post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.feed_posts(id),
    user_id UUID REFERENCES public.users(id),
    client_id UUID REFERENCES public.clients(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.feed_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.feed_posts(id),
    user_id UUID REFERENCES public.users(id),
    client_id UUID REFERENCES public.clients(id),
    reaction TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. GAMIFICATION
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    points INTEGER DEFAULT 0,
    code TEXT
);

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.xp_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_key TEXT NOT NULL,
    points INTEGER NOT NULL,
    cooldown_seconds INTEGER,
    max_per_day INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.xp_levels (
    level INTEGER PRIMARY KEY,
    min_xp INTEGER NOT NULL,
    title TEXT,
    perks TEXT
);

CREATE TABLE IF NOT EXISTS public.user_gamification (
    user_id UUID PRIMARY KEY REFERENCES public.users(id),
    xp INTEGER DEFAULT 0,
    xp_total INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    videos_completed INTEGER DEFAULT 0,
    trades_logged INTEGER DEFAULT 0,
    total_achievements_unlocked INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TRADING & JOURNAL
CREATE TABLE IF NOT EXISTS public.trading_diary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    pair TEXT,
    direction TEXT,
    entry_price NUMERIC,
    exit_price NUMERIC,
    profit_loss NUMERIC,
    profit_loss_pct NUMERIC,
    strategy_used TEXT,
    emotion_before TEXT,
    emotion_after TEXT,
    what_went_well TEXT,
    what_to_improve TEXT,
    lessons_learned TEXT,
    screenshot_url TEXT,
    trade_date TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trade_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    symbol TEXT,
    side TEXT,
    entry_price NUMERIC,
    stop_loss_price NUMERIC,
    take_profit_price NUMERIC,
    risk_value NUMERIC,
    risk_type TEXT,
    account_balance NUMERIC,
    account_currency TEXT,
    broker_key TEXT,
    lots_calculated NUMERIC,
    recommended_lots NUMERIC,
    risk_total_usd NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.instrument_specs_mt5 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_key TEXT NOT NULL,
    symbol TEXT NOT NULL,
    digits INTEGER,
    tick_size NUMERIC,
    tick_value_usd NUMERIC,
    contract_size NUMERIC,
    vol_min NUMERIC,
    vol_step NUMERIC,
    vol_max NUMERIC,
    currency_base TEXT,
    currency_profit TEXT,
    currency_margin TEXT,
    trade_mode INTEGER,
    calc_mode INTEGER,
    is_active BOOLEAN DEFAULT true,
    inactive_reason TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    tick_value NUMERIC,
    tick_value_profit NUMERIC
);

-- 8. REMAINING TABLES (CRM, LOGS, ETC)
CREATE TABLE IF NOT EXISTS public.activity_log (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, client_id UUID, action TEXT, metadata JSONB, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.crm_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, client_id UUID, event_name TEXT, payload JSONB, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, event_type TEXT, event_name TEXT, event_value TEXT, points INTEGER DEFAULT 0, props JSONB DEFAULT '{}', meta JSONB DEFAULT '{}', occurred_at TIMESTAMPTZ DEFAULT now(), created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.signup_sessions (token UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_id UUID REFERENCES public.clients(id), expires_at TIMESTAMPTZ, consumed_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.psych_arena_results (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, report_json JSONB, scores JSONB, flags JSONB, decision_style TEXT, pressure_response TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.conversations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_id UUID REFERENCES public.clients(id), user_id UUID REFERENCES public.users(id), title TEXT, status TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.mentor_messages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), auth_user_id UUID, role TEXT, content TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.deposits (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES public.users(id), client_id UUID REFERENCES public.clients(id), amount NUMERIC, currency TEXT, status TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.video_unlock_rules (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), video_id UUID, client_id UUID, unlock_type TEXT, min_quiz_score INTEGER, min_deposit_usd NUMERIC, required_level INTEGER, priority INTEGER, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_onboarding_answers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES public.users(id), client_id UUID REFERENCES public.clients(id), answers JSONB, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.quiz_answers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES public.users(id), primary_goal TEXT, experience_level TEXT, time_available TEXT, markets_interested TEXT[], main_concern TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_xp_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, event_type TEXT, xp_amount INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.video_views (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, video_id UUID, is_completed BOOLEAN, completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_profiles (user_id UUID PRIMARY KEY REFERENCES public.users(id), client_id UUID REFERENCES public.clients(id), nickname TEXT UNIQUE, bio TEXT, avatar_url TEXT, avatar_type TEXT, avatar_storage_path TEXT, is_public BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_progress (user_id UUID PRIMARY KEY REFERENCES public.users(id), client_id UUID REFERENCES public.clients(id), level INTEGER DEFAULT 1, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_stats (user_id UUID PRIMARY KEY REFERENCES public.users(id), level INTEGER DEFAULT 1, total_points INTEGER DEFAULT 0, videos_completed INTEGER DEFAULT 0, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_feed_stats (user_id UUID PRIMARY KEY REFERENCES public.users(id), client_id UUID REFERENCES public.clients(id), posts_count INTEGER DEFAULT 0, likes_given_count INTEGER DEFAULT 0, likes_received_count INTEGER DEFAULT 0, comments_count INTEGER DEFAULT 0, updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_moderation (user_id UUID PRIMARY KEY REFERENCES public.users(id), client_id UUID REFERENCES public.clients(id), is_shadowbanned BOOLEAN DEFAULT false, shadowban_reason TEXT, shadowbanned_at TIMESTAMPTZ, shadowbanned_by UUID, updated_at TIMESTAMPTZ DEFAULT now(), created_at TIMESTAMPTZ DEFAULT now());

-- 9. RE-LOCK FINADEMICA CLIENT
INSERT INTO public.clients (id, company_name, subdomain, primary_color, company_tagline)
VALUES ('a6151fd9-1513-4ae0-b960-25454f3a9bf2', 'Finademica', 'finademica', '#6366F1', 'The Architecture of Mastery')
ON CONFLICT (id) DO UPDATE SET company_name = EXCLUDED.company_name;

-- 10. ENSURE LOGIC TABLES EXIST FOR n8n
CREATE TABLE IF NOT EXISTS public.client_videos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_id UUID, video_id UUID, is_active BOOLEAN, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.trade_journal_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), entry_id UUID, event_type TEXT, payload JSONB, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_achievements (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, achievement_id UUID, unlocked_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_skills (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, skill_id UUID, level INTEGER DEFAULT 1, xp INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS public.user_tip_seen (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, tip_key TEXT, seen_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_video_recommendations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, video_id UUID, reason TEXT, priority INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_video_selections (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, video_id UUID, ai_reason TEXT, priority_rank INTEGER, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.user_video_unlocks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, video_id UUID, unlock_reason TEXT, unlocked_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS public.video_access_rules (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_id UUID, user_stage TEXT, grant_visibility TEXT, priority INTEGER, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());
