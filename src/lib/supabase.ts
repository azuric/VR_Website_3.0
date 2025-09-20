import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  discord_username?: string
  vr_experience_level?: string
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  tag: string
  description?: string
  logo_url?: string
  captain_id: string
  max_members: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Tournament {
  id: string
  name: string
  description?: string
  game_mode: string
  tournament_type: string
  max_participants: number
  entry_fee: number
  prize_pool: number
  registration_start: string
  registration_end: string
  tournament_start: string
  tournament_end?: string
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled'
  created_by: string
  created_at: string
  updated_at: string
}

export interface TournamentRegistration {
  id: string
  tournament_id: string
  team_id?: string
  user_id?: string
  registration_type: 'team' | 'individual'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_id?: string
  registered_at: string
}

// Helper functions
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}

export async function getTournaments(): Promise<Tournament[]> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('tournament_start', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting tournaments:', error)
    // Return sample tournament data as fallback
    return [
    {
      id: '1',
      name: 'Crown Championship - Season 1',
      description: 'The premier Lords of Esport tournament featuring the finest VR warriors in the UK',
      game_mode: 'Battle Royale',
      tournament_type: 'elimination',
      max_participants: 32,
      entry_fee: 25,
      prize_pool: 1500,
      registration_start: '2025-01-15T00:00:00Z',
      registration_end: '2025-02-01T23:59:59Z',
      tournament_start: '2025-02-05T18:00:00Z',
      tournament_end: '2025-02-05T22:00:00Z',
      status: 'registration_open',
      created_by: 'admin',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Royal Rumble Weekly',
      description: 'Weekly battles for glory and ranking points in the Lords of Esport league',
      game_mode: 'Team Deathmatch',
      tournament_type: 'round_robin',
      max_participants: 16,
      entry_fee: 15,
      prize_pool: 800,
      registration_start: '2025-01-20T00:00:00Z',
      registration_end: '2025-01-25T23:59:59Z',
      tournament_start: '2025-01-26T19:00:00Z',
      tournament_end: '2025-01-26T21:00:00Z',
      status: 'upcoming',
      created_by: 'admin',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Throne Wars - Team Battle',
      description: 'Elite team competition hosted at VRXtra Kingston facilities',
      game_mode: 'Squad Battle',
      tournament_type: 'elimination',
      max_participants: 24,
      entry_fee: 50,
      prize_pool: 2000,
      registration_start: '2025-02-01T00:00:00Z',
      registration_end: '2025-02-15T23:59:59Z',
      tournament_start: '2025-02-20T17:00:00Z',
      tournament_end: '2025-02-20T21:00:00Z',
      status: 'registration_open',
      created_by: 'admin',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    }
  ]
  }
}

export async function registerForTournament(tournamentId: string, registrationData: {
  team_id?: string
  user_id?: string
  registration_type: 'team' | 'individual'
}) {
  try {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert({
        tournament_id: tournamentId,
        ...registrationData,
        payment_status: 'pending',
        registered_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error registering for tournament:', error)
    return null
  }
}

