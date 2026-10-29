-- Contact form messages. Inserted only by api/contact.ts with the service-role key
-- (which bypasses RLS); read and updated by the owner from the dashboard.
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) between 3 and 254),
  message     text not null check (char_length(message) between 20 and 2000),
  answered    boolean not null default false,
  answered_at timestamptz,
  created_at  timestamptz not null default now()
);

create index messages_created_at_idx on public.messages (created_at desc);

-- No policies for anon: visitors can neither read nor write this table directly.
-- Owner policies are added with the dashboard.
alter table public.messages enable row level security;
