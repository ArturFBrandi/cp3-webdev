-- Repositories featured on the home page, managed from the owner dashboard.
create table public.featured_projects (
  repo_name  text primary key,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.featured_projects enable row level security;

-- Visitors (anon) can read the list. Write policies are added with the dashboard (owner only).
create policy "featured_projects are public"
  on public.featured_projects for select
  to anon, authenticated
  using (true);

insert into public.featured_projects (repo_name, position) values
  ('ai-hardcore-engineer', 1),
  ('smartlar-manager', 2);
