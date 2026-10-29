-- Owner-only access for the dashboard.
-- "Authenticated" is not enough: anyone could sign up while sign-ups are open,
-- so every policy also checks that the signed-in user is the site owner.
create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'arturbrandi5@gmail.com'
$$;

-- messages: the owner reads and marks as answered. Inserts come from api/contact.ts (service role).
create policy "owner reads messages"
  on public.messages for select
  to authenticated
  using (public.is_owner());

create policy "owner updates messages"
  on public.messages for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- Column-level grant: even the owner can only change the answered columns.
revoke update on public.messages from authenticated;
grant update (answered, answered_at) on public.messages to authenticated;

-- featured_projects: the owner manages the list.
create policy "owner inserts featured projects"
  on public.featured_projects for insert
  to authenticated
  with check (public.is_owner());

create policy "owner deletes featured projects"
  on public.featured_projects for delete
  to authenticated
  using (public.is_owner());

-- Replaces the featured list atomically, keeping the given order.
create or replace function public.set_featured_projects(names text[])
returns void
language plpgsql
security invoker
as $$
begin
  if not public.is_owner() then
    raise exception 'only the owner can change featured projects' using errcode = '42501';
  end if;

  delete from public.featured_projects where true;

  insert into public.featured_projects (repo_name, position)
  select name, ordinality::integer
  from unnest(names) with ordinality as t(name, ordinality);
end;
$$;

revoke execute on function public.set_featured_projects(text[]) from public, anon;
grant execute on function public.set_featured_projects(text[]) to authenticated;
