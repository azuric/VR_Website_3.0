-- Lords of Esport Database Schema
-- Run this in your Supabase SQL Editor

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  discord_username TEXT,
  vr_experience_level TEXT CHECK (vr_experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  bio TEXT,
  location TEXT,
  website_url TEXT,
  
  -- Gaming stats
  total_matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ranking_points INTEGER DEFAULT 1000,
  current_rank TEXT DEFAULT 'Recruit',
  
  -- Membership info
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  membership_status TEXT DEFAULT 'active' CHECK (membership_status IN ('active', 'inactive', 'suspended', 'banned')),
  membership_tier TEXT DEFAULT 'standard' CHECK (membership_tier IN ('standard', 'premium', 'vip', 'admin')),
  
  -- Preferences
  email_notifications BOOLEAN DEFAULT true,
  discord_notifications BOOLEAN DEFAULT false,
  public_profile BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  tag TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  captain_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  max_members INTEGER DEFAULT 6,
  is_active BOOLEAN DEFAULT true,
  is_recruiting BOOLEAN DEFAULT true,
  
  -- Team stats
  total_matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ranking_points INTEGER DEFAULT 1000,
  current_rank TEXT DEFAULT 'Unranked',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('captain', 'co-captain', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(team_id, user_id)
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  game_mode TEXT NOT NULL,
  tournament_type TEXT NOT NULL CHECK (tournament_type IN ('elimination', 'round_robin', 'swiss', 'ladder')),
  format TEXT DEFAULT 'team' CHECK (format IN ('solo', 'duo', 'team')),
  
  -- Participation
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  prize_pool DECIMAL(10,2) DEFAULT 0,
  
  -- Scheduling
  registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
  tournament_start TIMESTAMP WITH TIME ZONE NOT NULL,
  tournament_end TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled')),
  
  -- Organization
  created_by UUID REFERENCES public.profiles(id),
  venue TEXT,
  rules_url TEXT,
  stream_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournament_registrations table
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_type TEXT NOT NULL CHECK (registration_type IN ('team', 'individual')),
  
  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_id TEXT,
  payment_amount DECIMAL(10,2),
  
  -- Registration info
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  
  -- Ensure either team_id or user_id is provided based on registration_type
  CONSTRAINT check_registration_type CHECK (
    (registration_type = 'team' AND team_id IS NOT NULL AND user_id IS NULL) OR
    (registration_type = 'individual' AND user_id IS NOT NULL AND team_id IS NULL)
  )
);

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  
  -- Match details
  match_number INTEGER,
  round_number INTEGER,
  match_type TEXT DEFAULT 'regular' CHECK (match_type IN ('regular', 'semifinal', 'final', 'third_place')),
  
  -- Teams/Players
  team1_id UUID REFERENCES public.teams(id),
  team2_id UUID REFERENCES public.teams(id),
  player1_id UUID REFERENCES public.profiles(id),
  player2_id UUID REFERENCES public.profiles(id),
  
  -- Results
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  winner_id UUID, -- Can reference either teams or profiles
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  
  -- Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional info
  map_played TEXT,
  duration_minutes INTEGER,
  notes TEXT,
  stream_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'tournament', 'match', 'team')),
  
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (public_profile = true);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for teams
CREATE POLICY "Teams are viewable by everyone" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Team captains can update their team" ON public.teams
  FOR UPDATE USING (auth.uid() = captain_id);

CREATE POLICY "Authenticated users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for team_members
CREATE POLICY "Team members are viewable by everyone" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join teams" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams" ON public.team_members
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tournaments
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tournaments" ON public.tournaments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND membership_tier IN ('admin', 'vip')
    )
  );

-- RLS Policies for tournament_registrations
CREATE POLICY "Users can view their registrations" ON public.tournament_registrations
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT tm.user_id FROM public.team_members tm 
      WHERE tm.team_id = tournament_registrations.team_id
    )
  );

CREATE POLICY "Users can register for tournaments" ON public.tournament_registrations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT tm.user_id FROM public.team_members tm 
      WHERE tm.team_id = tournament_registrations.team_id 
      AND tm.role IN ('captain', 'co-captain')
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for activity_log
CREATE POLICY "Users can view own activity" ON public.activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_ranking_points ON public.profiles(ranking_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_member_since ON public.profiles(member_since);
CREATE INDEX IF NOT EXISTS idx_teams_ranking_points ON public.teams(ranking_points DESC);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_registration_dates ON public.tournaments(registration_start, registration_end);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_tournament ON public.tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON public.matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.tournaments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data for testing
INSERT INTO public.tournaments (
  name, description, game_mode, tournament_type, format,
  max_participants, entry_fee, prize_pool,
  registration_start, registration_end, tournament_start,
  status
) VALUES 
(
  'Crown Championship - Season 1',
  'The premier Lords of Esport tournament featuring the finest VR warriors in the UK',
  'Battle Royale',
  'elimination',
  'team',
  32,
  25.00,
  1500.00,
  '2025-01-15 00:00:00+00',
  '2025-02-01 23:59:59+00',
  '2025-02-05 18:00:00+00',
  'registration_open'
),
(
  'Royal Rumble Weekly',
  'Weekly battles for glory and ranking points in the Lords of Esport league',
  'Team Deathmatch',
  'round_robin',
  'team',
  16,
  15.00,
  800.00,
  '2025-01-20 00:00:00+00',
  '2025-01-25 23:59:59+00',
  '2025-01-26 19:00:00+00',
  'upcoming'
),
(
  'Throne Wars - Team Battle',
  'Elite team competition hosted at VRXtra Kingston facilities',
  'Squad Battle',
  'elimination',
  'team',
  24,
  50.00,
  2000.00,
  '2025-02-01 00:00:00+00',
  '2025-02-15 23:59:59+00',
  '2025-02-20 17:00:00+00',
  'registration_open'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
