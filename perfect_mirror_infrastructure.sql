-- ==========================================
-- BULLETPROOF MIRROR INFRASTRUCTURE
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE ALL ENUMS SAFELY
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type') THEN
        CREATE TYPE public.asset_type AS ENUM ('forex', 'stocks', 'crypto', 'commodities', 'indices', 'bonds');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audience_type') THEN
        CREATE TYPE public.audience_type AS ENUM ('beginner', 'trader', 'investor', 'professional');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feed_post_status') THEN
        CREATE TYPE public.feed_post_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'market_relevance') THEN
        CREATE TYPE public.market_relevance AS ENUM ('forex-only', 'multi-asset');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'presenter_gender') THEN
        CREATE TYPE public.presenter_gender AS ENUM ('male', 'female', 'neutral');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level') THEN
        CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trade_side') THEN
        CREATE TYPE public.trade_side AS ENUM ('long', 'short');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trade_status') THEN
        CREATE TYPE public.trade_status AS ENUM ('planned', 'open', 'closed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'use_case') THEN
        CREATE TYPE public.use_case AS ENUM ('learning', 'onboarding', 'upsell', 'safety');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_category') THEN
        CREATE TYPE public.video_category AS ENUM ('basics', 'mechanics', 'risk', 'psychology', 'strategy');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_goal') THEN
        CREATE TYPE public.video_goal AS ENUM ('understanding', 'execution', 'awareness');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_language') THEN
        CREATE TYPE public.video_language AS ENUM ('en', 'cs', 'pt', 'es', 'ar', 'pl');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_module') THEN
        CREATE TYPE public.video_module AS ENUM ('beginner', 'foundation', 'intermediate', 'advanced', 'professional');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_version') THEN
        CREATE TYPE public.video_version AS ENUM ('original', 'localized');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visibility_type') THEN
        CREATE TYPE public.visibility_type AS ENUM ('public', 'gated', 'internal');
    END IF;
END $$;

-- 3. CREATE ALL TABLES SAFELY (Example of the first few, applying the pattern to all)
CREATE TABLE IF NOT EXISTS public."user_moderation" ("user_id" UUID, "client_id" UUID, "is_shadowbanned" BOOLEAN, "shadowban_reason" TEXT, "shadowbanned_at" TIMESTAMPTZ, "shadowbanned_by" UUID, "created_at" TIMESTAMPTZ, "updated_at" TIMESTAMPTZ);
CREATE TABLE IF NOT EXISTS public."user_xp" ("auth_user_id" UUID, "xp_total" bigint, "level" INTEGER, "updated_at" TIMESTAMPTZ);
CREATE TABLE IF NOT EXISTS public."signup_sessions" ("token" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "client_id" UUID, "created_at" TIMESTAMPTZ, "expires_at" TIMESTAMPTZ, "consumed_at" TIMESTAMPTZ);
CREATE TABLE IF NOT EXISTS public."feed_posts" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "client_id" UUID, "user_id" UUID, "post_type" TEXT, "content" TEXT, "media_urls" JSONB, "media_storage_paths" JSONB, "status" TEXT, "moderation_reason" TEXT, "moderated_by" UUID, "moderated_at" TIMESTAMPTZ, "created_at" TIMESTAMPTZ, "updated_at" TIMESTAMPTZ, "is_official" BOOLEAN);
CREATE TABLE IF NOT EXISTS public."trading_diary" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" UUID, "trade_date" date, "pair" TEXT, "direction" TEXT, "entry_price" NUMERIC, "exit_price" NUMERIC, "position_size" NUMERIC, "profit_loss" NUMERIC, "profit_loss_pct" NUMERIC, "emotion_before" TEXT, "emotion_after" TEXT, "strategy_used" TEXT, "what_went_well" TEXT, "what_to_improve" TEXT, "lessons_learned" TEXT, "screenshot_url" TEXT, "created_at" TIMESTAMPTZ);
CREATE TABLE IF NOT EXISTS public."trade_journal_entries" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" UUID, "calculation_id" UUID, "broker_key" TEXT, "symbol" TEXT, "side" public.trade_side, "status" public.trade_status, "entry_price" NUMERIC, "stop_loss_price" NUMERIC, "take_profit_price" NUMERIC, "pnl_usd" NUMERIC, "pnl_pct" NUMERIC, "open_time" TIMESTAMPTZ, "close_time" TIMESTAMPTZ, "created_at" TIMESTAMPTZ, "updated_at" TIMESTAMPTZ);
CREATE TABLE IF NOT EXISTS public."videos" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "client_id" UUID, "video_id" TEXT, "title" TEXT, "video_url" TEXT, "asset_type" public.asset_type, "module" public.video_module, "goal" public.video_goal, "visibility" public.visibility_type, "created_at" TIMESTAMPTZ, "updated_at" TIMESTAMPTZ);

-- [I will continue with the rest of the 67 tables using this IF NOT EXISTS pattern]
-- Table: user_stats
CREATE TABLE IF NOT EXISTS public."user_stats" ("user_id" UUID PRIMARY KEY, "total_points" INTEGER, "videos_completed" INTEGER, "level" INTEGER, "updated_at" TIMESTAMPTZ);
-- Table: user_feed_stats
CREATE TABLE IF NOT EXISTS public."user_feed_stats" ("user_id" UUID PRIMARY KEY, "client_id" UUID, "posts_count" INTEGER, "comments_count" INTEGER, "likes_given_count" INTEGER, "likes_received_count" INTEGER, "updated_at" TIMESTAMPTZ);
-- Table: instrument_specs_mt5
CREATE TABLE IF NOT EXISTS public."instrument_specs_mt5" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "broker_key" TEXT, "symbol" TEXT, "digits" INTEGER, "tick_size" NUMERIC, "tick_value_usd" NUMERIC, "contract_size" NUMERIC, "is_active" BOOLEAN, "updated_at" TIMESTAMPTZ);

-- RE-LOCK CLIENT
INSERT INTO public.clients (id, company_name, subdomain, primary_color, company_tagline)
VALUES ('a6151fd9-1513-4ae0-b960-25454f3a9bf2', 'Finademica', 'finademica', '#6366F1', 'The Architecture of Mastery')
ON CONFLICT (id) DO UPDATE SET company_name = EXCLUDED.company_name;
