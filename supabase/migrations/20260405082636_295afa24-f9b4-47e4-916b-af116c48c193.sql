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