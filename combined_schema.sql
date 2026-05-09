-- Insert NAGA test client
INSERT INTO public.clients (
  company_name,
  subdomain,
  primary_color,
  secondary_color,
  company_tagline,
  active
) VALUES (
  'NAGA Trading Academy',
  'naga',
  '#00D084',
  '#0EA5E9',
  'Master the Markets with AI-Powered Learning',
  true
);

-- Insert Forex test client
INSERT INTO public.clients (
  company_name,
  subdomain,
  primary_color,
  secondary_color,
  company_tagline,
  active
) VALUES (
  'Forex Pro Academy',
  'forex',
  '#10B981',
  '#3B82F6',
  'Professional Forex Trading Education',
  true
);
-- Insert NASR Trade client
INSERT INTO public.clients (
  company_name,
  subdomain,
  primary_color,
  secondary_color,
  company_tagline,
  active
) VALUES (
  'NASR Trade Academy',
  'nasr',
  '#F59E0B',
  '#EF4444',
  'Elite Trading Education Platform',
  true
);
-- Clean up any trailing whitespace/CRLF characters from custom_domain values
UPDATE clients 
SET custom_domain = TRIM(BOTH FROM REPLACE(REPLACE(custom_domain, E'\r', ''), E'\n', ''))
WHERE custom_domain IS NOT NULL;
-- Fix the notify_n8n_feed_event function to use correct schema reference
CREATE OR REPLACE FUNCTION public.notify_n8n_feed_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_url text := 'https://clientee.app.n8n.cloud/webhook/4d11f151-b1df-45b2-93e5-c96a09db8485';
  v_payload jsonb;
begin
  v_payload :=
    jsonb_build_object(
      'source', 'supabase',
      'schema', tg_table_schema,
      'table', tg_table_name,
      'op', tg_op,
      'ts', now(),
      'record', case
        when (tg_op = 'DELETE') then to_jsonb(old)
        else to_jsonb(new)
      end,
      'old_record', case
        when (tg_op = 'UPDATE') then to_jsonb(old)
        else null
      end
    );

  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object('content-type','application/json'),
    body := v_payload
  );

  if (tg_op = 'DELETE') then
    return old;
  else
    return new;
  end if;
end;
$$;
-- Fix the notify_n8n_feed_event function to use correct schema reference (net.http_post, not extensions.net.http_post)
-- Also update to production webhook URL
CREATE OR REPLACE FUNCTION public.notify_n8n_feed_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_url text := 'https://clientee.app.n8n.cloud/webhook/4d11f151-b1df-45b2-93e5-c96a09db8485';
  v_payload jsonb;
begin
  v_payload :=
    jsonb_build_object(
      'source', 'supabase',
      'schema', tg_table_schema,
      'table', tg_table_name,
      'op', tg_op,
      'ts', now(),
      'record', case
        when (tg_op = 'DELETE') then to_jsonb(old)
        else to_jsonb(new)
      end,
      'old_record', case
        when (tg_op = 'UPDATE') then to_jsonb(old)
        else null
      end
    );

  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object('content-type','application/json'),
    body := v_payload
  );

  if (tg_op = 'DELETE') then
    return old;
  else
    return new;
  end if;
end;
$$;
-- Drop and recreate v_feed_posts to include is_official
DROP VIEW IF EXISTS public.v_feed_posts;

CREATE VIEW public.v_feed_posts AS
SELECT p.id,
    p.client_id,
    p.user_id,
    p.post_type,
    p.content,
    p.media_urls,
    p.media_storage_paths,
    p.status,
    p.moderation_reason,
    p.moderated_by,
    p.moderated_at,
    p.created_at,
    p.updated_at,
    u.first_name,
    u.last_name,
    u.email,
    up.nickname,
    up.avatar_url,
    COALESCE(l.like_count, 0::bigint)::integer AS like_count,
    (EXISTS ( SELECT 1
           FROM feed_post_likes myl
          WHERE myl.post_id = p.id AND myl.user_id = current_public_user_id() AND myl.client_id = current_client_id())) AS liked_by_me,
    COALESCE(c.comment_count, 0::bigint)::integer AS comment_count,
    p.is_official
   FROM feed_posts p
     LEFT JOIN users u ON u.id = p.user_id
     LEFT JOIN user_profiles up ON up.user_id = p.user_id
     LEFT JOIN ( SELECT feed_post_likes.post_id,
            count(*) AS like_count
           FROM feed_post_likes
          GROUP BY feed_post_likes.post_id) l ON l.post_id = p.id
     LEFT JOIN ( SELECT feed_post_comments.post_id,
            count(*) AS comment_count
           FROM feed_post_comments
          GROUP BY feed_post_comments.post_id) c ON c.post_id = p.id;
-- Update NASR client with theme_config (gold/dark luxury theme)
UPDATE public.clients
SET theme_config = '{
  "light": {
    "background": "220 30% 2%",
    "foreground": "0 0% 96%",
    "card": "220 25% 6%",
    "card-foreground": "0 0% 96%",
    "popover": "220 25% 6%",
    "popover-foreground": "0 0% 96%",
    "primary": "43 69% 53%",
    "primary-foreground": "0 0% 0%",
    "secondary": "220 20% 10%",
    "secondary-foreground": "0 0% 79%",
    "muted": "220 20% 12%",
    "muted-foreground": "0 0% 85%",
    "accent": "45 70% 55%",
    "accent-foreground": "0 0% 0%",
    "destructive": "0 72% 50%",
    "destructive-foreground": "0 0% 98%",
    "border": "220 15% 15%",
    "input": "220 20% 10%",
    "ring": "43 69% 53%",
    "success": "43 69% 53%",
    "success-from": "45 85% 62%",
    "success-to": "43 69% 53%",
    "premium-from": "45 85% 62%",
    "premium-to": "43 69% 53%",
    "info": "43 69% 53%",
    "warning": "38 80% 55%",
    "error": "0 72% 50%",
    "text-primary": "0 0% 96%",
    "text-secondary": "0 0% 88%",
    "text-tertiary": "0 0% 68%",
    "border-subtle": "220 15% 15%",
    "border-hover": "43 69% 53%",
    "border-glass": "43 69% 20%",
    "purple": "43 50% 45%",
    "gold": "43 69% 53%",
    "gold-light": "45 85% 62%",
    "gold-glow": "43 69% 53%",
    "sidebar-background": "220 25% 6%",
    "sidebar-foreground": "0 0% 96%",
    "sidebar-primary": "43 69% 53%",
    "sidebar-primary-foreground": "0 0% 0%",
    "sidebar-accent": "220 20% 12%",
    "sidebar-accent-foreground": "0 0% 85%",
    "sidebar-border": "220 15% 15%",
    "sidebar-ring": "43 69% 53%"
  },
  "dark": {
    "background": "220 30% 2%",
    "foreground": "0 0% 96%",
    "card": "220 25% 6%",
    "card-foreground": "0 0% 96%",
    "popover": "220 25% 6%",
    "popover-foreground": "0 0% 96%",
    "primary": "43 69% 53%",
    "primary-foreground": "0 0% 0%",
    "secondary": "220 20% 10%",
    "secondary-foreground": "0 0% 79%",
    "muted": "220 20% 12%",
    "muted-foreground": "0 0% 85%",
    "accent": "45 70% 55%",
    "accent-foreground": "0 0% 0%",
    "destructive": "0 72% 50%",
    "destructive-foreground": "0 0% 98%",
    "border": "220 15% 15%",
    "input": "220 20% 10%",
    "ring": "43 69% 53%",
    "success": "43 69% 53%",
    "success-from": "45 85% 62%",
    "success-to": "43 69% 53%",
    "premium-from": "45 85% 62%",
    "premium-to": "43 69% 53%",
    "info": "43 69% 53%",
    "warning": "38 80% 55%",
    "error": "0 72% 50%",
    "text-primary": "0 0% 96%",
    "text-secondary": "0 0% 88%",
    "text-tertiary": "0 0% 68%",
    "border-subtle": "220 15% 15%",
    "border-hover": "43 69% 53%",
    "border-glass": "43 69% 20%",
    "purple": "43 50% 45%",
    "gold": "43 69% 53%",
    "gold-light": "45 85% 62%",
    "gold-glow": "43 69% 53%",
    "sidebar-background": "220 25% 6%",
    "sidebar-foreground": "0 0% 96%",
    "sidebar-primary": "43 69% 53%",
    "sidebar-primary-foreground": "0 0% 0%",
    "sidebar-accent": "220 20% 12%",
    "sidebar-accent-foreground": "0 0% 85%",
    "sidebar-border": "220 15% 15%",
    "sidebar-ring": "43 69% 53%"
  },
  "fonts": {
    "sans": "Playfair Display, Georgia, serif",
    "serif": "Georgia, serif",
    "mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
  },
  "radius": "0.75rem"
}'::jsonb
WHERE subdomain = 'nasr';
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_user_id uuid;
  v_token uuid;
  v_client_id uuid;
begin
  v_token := nullif(new.raw_user_meta_data->>'signup_token','')::uuid;

  if v_token is not null then
    select s.client_id into v_client_id
    from public.signup_sessions s
    where s.token = v_token
      and s.consumed_at is null
      and s.expires_at > now()
    limit 1;

    if v_client_id is not null then
      update public.signup_sessions
      set consumed_at = now()
      where token = v_token
        and consumed_at is null;
    end if;
  end if;

  if v_client_id is null then
    select c.id into v_client_id
    from public.clients c
    where c.subdomain = 'nallio'
    limit 1;
  end if;

  insert into public.users (auth_user_id, email, client_id, role, first_name, last_name, phone, account_status)
  values (
    new.id,
    new.email,
    v_client_id,
    'learner',
    nullif(trim(new.raw_user_meta_data->>'first_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'last_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'phone'), ''),
    'active'
  )
  on conflict (auth_user_id) do update
  set
    email = excluded.email,
    client_id = excluded.client_id,
    first_name = coalesce(excluded.first_name, users.first_name),
    last_name = coalesce(excluded.last_name, users.last_name),
    phone = coalesce(excluded.phone, users.phone),
    account_status = 'active',
    updated_at = now()
  returning id into v_user_id;

  insert into public.user_gamification (user_id)
  values (v_user_id)
  on conflict (user_id) do nothing;

  return new;
end;
$function$;

INSERT INTO public.clients (
  company_name,
  subdomain,
  custom_domain,
  logo_url,
  primary_color,
  secondary_color,
  company_tagline,
  plan_type,
  active,
  skip_landing_page,
  require_quiz,
  theme_config
) VALUES (
  'Finademica',
  'finademica',
  'app.finademica.com',
  '/clients/finademica/logo.png',
  '#6366F1',
  '#020617',
  'The Architecture of Mastery.',
  'standard',
  true,
  true,
  true,
  '{
    "dark": {
      "background": "222 84% 5%",
      "foreground": "0 0% 96%",
      "card": "222 47% 11%",
      "card-foreground": "0 0% 96%",
      "popover": "222 47% 11%",
      "popover-foreground": "0 0% 96%",
      "primary": "239 84% 67%",
      "primary-foreground": "0 0% 100%",
      "secondary": "222 47% 14%",
      "secondary-foreground": "0 0% 96%",
      "muted": "222 47% 14%",
      "muted-foreground": "0 0% 75%",
      "accent": "234 89% 74%",
      "accent-foreground": "0 0% 100%",
      "destructive": "0 72% 50%",
      "destructive-foreground": "0 0% 98%",
      "border": "222 47% 18%",
      "border-subtle": "222 47% 18%",
      "border-hover": "239 84% 67%",
      "border-glass": "239 84% 25%",
      "input": "222 47% 14%",
      "ring": "239 84% 67%",
      "sidebar-background": "222 47% 11%",
      "sidebar-foreground": "0 0% 96%",
      "sidebar-primary": "239 84% 67%",
      "sidebar-primary-foreground": "0 0% 100%",
      "sidebar-accent": "222 47% 14%",
      "sidebar-accent-foreground": "0 0% 85%",
      "sidebar-border": "222 47% 18%",
      "sidebar-ring": "239 84% 67%",
      "premium-from": "234 89% 74%",
      "premium-to": "239 84% 67%",
      "success": "152 76% 50%",
      "success-from": "152 76% 60%",
      "success-to": "152 76% 45%",
      "warning": "38 92% 55%",
      "info": "239 84% 67%",
      "error": "0 72% 50%",
      "gold": "234 89% 74%",
      "gold-glow": "239 84% 67%",
      "gold-light": "234 89% 80%",
      "purple": "263 70% 60%",
      "text-primary": "0 0% 96%",
      "text-secondary": "0 0% 88%",
      "text-tertiary": "0 0% 68%"
    },
    "light": {
      "background": "222 84% 5%",
      "foreground": "0 0% 96%",
      "card": "222 47% 11%",
      "card-foreground": "0 0% 96%",
      "popover": "222 47% 11%",
      "popover-foreground": "0 0% 96%",
      "primary": "239 84% 67%",
      "primary-foreground": "0 0% 100%",
      "secondary": "222 47% 14%",
      "secondary-foreground": "0 0% 96%",
      "muted": "222 47% 14%",
      "muted-foreground": "0 0% 75%",
      "accent": "234 89% 74%",
      "accent-foreground": "0 0% 100%",
      "destructive": "0 72% 50%",
      "destructive-foreground": "0 0% 98%",
      "border": "222 47% 18%",
      "input": "222 47% 14%",
      "ring": "239 84% 67%"
    },
    "fonts": {
      "sans": "Helvetica Neue, Helvetica, Arial, sans-serif",
      "serif": "Georgia, Bodoni Moda, serif",
      "mono": "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    },
    "radius": "0.75rem"
  }'::jsonb
);
