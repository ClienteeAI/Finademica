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