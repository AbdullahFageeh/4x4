-- CarCom Supabase Schema
-- Run this in your Supabase SQL Editor after creating a new project

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ─── USERS PROFILE ──────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  phone text,
  avatar_url text,
  preferred_language text default 'ar',
  car_model text,
  car_year int,
  car_color text,
  car_modifications jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── COMMUNITIES ────────────────────────────────────────────────────────────
create table if not exists public.communities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  car_model text not null,
  cover_image_url text,
  visibility text default 'public' check (visibility in ('public', 'private')),
  invite_code text unique,
  rules text,
  region text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── COMMUNITY MEMBERS ──────────────────────────────────────────────────────
create table if not exists public.community_members (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz default now(),
  unique(community_id, user_id)
);

-- ─── TRIPS ──────────────────────────────────────────────────────────────────
create table if not exists public.trips (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  title text not null,
  description text,
  category text check (category in ('scenic', 'camping', 'offroad', 'city_meetup')),
  destination jsonb not null,
  meeting_point jsonb not null,
  route_stops jsonb default '[]'::jsonb,
  start_date timestamptz not null,
  end_date timestamptz,
  max_participants int,
  cost_per_person int default 0,
  itinerary jsonb default '[]'::jsonb,
  checklist jsonb default '[]'::jsonb,
  status text default 'planning' check (status in ('planning', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── TRIP PARTICIPANTS ──────────────────────────────────────────────────────
create table if not exists public.trip_participants (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'approved', 'declined', 'waitlisted')),
  joined_at timestamptz default now(),
  unique(trip_id, user_id)
);

-- ─── CHAT MESSAGES ──────────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid not null,
  channel_type text check (channel_type in ('community', 'trip')),
  user_id uuid references public.profiles(id),
  content text not null,
  type text default 'text' check (type in ('text', 'image', 'location', 'announcement')),
  reactions jsonb default '{}'::jsonb,
  is_pinned boolean default false,
  created_at timestamptz default now()
);

-- ─── EXPENSES ───────────────────────────────────────────────────────────────
create table if not exists public.expenses (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade,
  title text not null,
  type text check (type in ('trip_fee', 'food', 'campsite', 'supplies', 'other')),
  total_amount int not null,
  paid_by uuid references public.profiles(id),
  shares jsonb not null,
  created_at timestamptz default now()
);

-- ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type text check (type in ('trip_reminder', 'chat_message', 'community_update', 'payment_reminder', 'departure_alert')),
  data jsonb default '{}'::jsonb,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.trips enable row level security;
alter table public.trip_participants enable row level security;
alter table public.chat_messages enable row level security;
alter table public.expenses enable row level security;
alter table public.notifications enable row level security;

-- Profiles: anyone can read, users can update their own
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Communities: public ones readable by all, private by members only
create policy "Public communities are viewable by everyone" on public.communities for select using (
  visibility = 'public' or
  created_by = auth.uid() or
  id in (select community_id from public.community_members where user_id = auth.uid())
);
create policy "Authenticated users can create communities" on public.communities for insert with check (auth.uid() is not null);
create policy "Owners can update communities" on public.communities for update using (created_by = auth.uid());

-- Community members: visible to community members
create policy "Community members are viewable by community members" on public.community_members for select using (
  community_id in (select community_id from public.community_members where user_id = auth.uid())
);
create policy "Users can join communities" on public.community_members for insert with check (auth.uid() = user_id);

-- Trips: visible to community members
create policy "Trips are viewable by community members" on public.trips for select using (
  community_id in (select community_id from public.community_members where user_id = auth.uid())
);
create policy "Community members can create trips" on public.trips for insert with check (
  community_id in (select community_id from public.community_members where user_id = auth.uid())
);

-- Trip participants: visible to trip participants
create policy "Trip participants are viewable by trip participants" on public.trip_participants for select using (
  trip_id in (select trip_id from public.trip_participants where user_id = auth.uid())
);
create policy "Users can join trips" on public.trip_participants for insert with check (auth.uid() = user_id);

-- Chat messages: visible to channel members
create policy "Chat messages are viewable by channel members" on public.chat_messages for select using (
  channel_id in (
    select id from public.communities where id in (select community_id from public.community_members where user_id = auth.uid())
    union
    select id from public.trips where id in (select trip_id from public.trip_participants where user_id = auth.uid())
  )
);
create policy "Channel members can send messages" on public.chat_messages for insert with check (auth.uid() = user_id);

-- Expenses: visible to trip participants
create policy "Expenses are viewable by trip participants" on public.expenses for select using (
  trip_id in (select trip_id from public.trip_participants where user_id = auth.uid())
);
create policy "Trip participants can add expenses" on public.expenses for insert with check (
  trip_id in (select trip_id from public.trip_participants where user_id = auth.uid())
);

-- Notifications: users can only see their own
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- ─── REALTIME PUBLICATION ───────────────────────────────────────────────────
-- Enable realtime for chat and presence
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.trip_participants;
alter publication supabase_realtime add table public.community_members;

-- ─── FUNCTIONS ──────────────────────────────────────────────────────────────
-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (new.id, new.raw_user_meta_data->>'name', new.phone);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
