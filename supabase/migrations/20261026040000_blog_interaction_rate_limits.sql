-- Rate-limit public blog interactions through the Cloudflare Worker.
create table if not exists public.blog_interaction_rate_limits (
  rate_key text not null,
  action text not null check (action in ('view','like')),
  window_started_at timestamptz not null default clock_timestamp(),
  request_count integer not null default 0,
  primary key (rate_key, action)
);
alter table public.blog_interaction_rate_limits enable row level security;
revoke all on public.blog_interaction_rate_limits from public, anon, authenticated;
grant all on public.blog_interaction_rate_limits to service_role;

create or replace function public.consume_blog_interaction_limit(
  p_rate_key text, p_action text, p_limit integer, p_window_seconds integer
) returns boolean language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare v_count integer;
begin
  if p_rate_key is null or length(p_rate_key) < 32
     or p_action is null or p_action not in ('view','like')
     or p_limit is null or p_window_seconds is null
     or p_limit < 1 or p_window_seconds < 1 then return false; end if;
  insert into public.blog_interaction_rate_limits as current_limit
    (rate_key, action, window_started_at, request_count)
  values (p_rate_key, p_action, clock_timestamp(), 1)
  on conflict (rate_key, action) do update
    set window_started_at = case
          when current_limit.window_started_at <= clock_timestamp() - make_interval(secs => p_window_seconds)
          then clock_timestamp() else current_limit.window_started_at end,
        request_count = case
          when current_limit.window_started_at <= clock_timestamp() - make_interval(secs => p_window_seconds)
          then 1 else current_limit.request_count + 1 end
  returning request_count into v_count;
  if random() < 0.01 then
    delete from public.blog_interaction_rate_limits
    where window_started_at < clock_timestamp() - interval '1 day';
  end if;
  return v_count <= p_limit;
end;
$$;

create or replace function public.blog_register_post_view_limited(
  p_post_id uuid, p_visitor_id uuid, p_rate_key text
) returns bigint language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if not public.consume_blog_interaction_limit(p_rate_key, 'view', 30, 300) then
    raise exception 'Rate limit exceeded' using errcode = 'P0001';
  end if;
  return public.register_blog_post_view(p_post_id, p_visitor_id);
end;
$$;

create or replace function public.blog_toggle_post_like_limited(
  p_post_id uuid, p_visitor_id uuid, p_toggle boolean, p_rate_key text
) returns table(like_count bigint, liked boolean)
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if not public.consume_blog_interaction_limit(p_rate_key, 'like', 40, 300) then
    raise exception 'Rate limit exceeded' using errcode = 'P0001';
  end if;
  return query select result.like_count, result.liked
    from public.get_or_toggle_blog_post_like(p_post_id, p_visitor_id, p_toggle) as result;
end;
$$;

revoke all on function public.consume_blog_interaction_limit(text,text,integer,integer) from public, anon, authenticated;
revoke all on function public.blog_register_post_view_limited(uuid,uuid,text) from public, anon, authenticated;
revoke all on function public.blog_toggle_post_like_limited(uuid,uuid,boolean,text) from public, anon, authenticated;
grant execute on function public.consume_blog_interaction_limit(text,text,integer,integer) to service_role;
grant execute on function public.blog_register_post_view_limited(uuid,uuid,text) to service_role;
grant execute on function public.blog_toggle_post_like_limited(uuid,uuid,boolean,text) to service_role;

-- Remove direct anonymous/authenticated entry points after clients move to the Worker.
revoke all on function public.register_blog_post_view(uuid,uuid) from public, anon, authenticated;
revoke all on function public.get_or_toggle_blog_post_like(uuid,uuid,boolean) from public, anon, authenticated;
grant execute on function public.register_blog_post_view(uuid,uuid) to service_role;
grant execute on function public.get_or_toggle_blog_post_like(uuid,uuid,boolean) to service_role;
