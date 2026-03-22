-- Calendar archives table
create table if not exists calendars (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  data        jsonb not null,
  share_token text unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Only owner can read/write their own calendars
alter table calendars enable row level security;

create policy "Owner access" on calendars
  for all using (auth.uid() = user_id);

-- Public read via share token (no auth required)
create policy "Public share read" on calendars
  for select using (share_token is not null);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger calendars_updated_at
  before update on calendars
  for each row execute procedure update_updated_at();
