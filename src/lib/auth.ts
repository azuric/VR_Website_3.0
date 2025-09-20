import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  discord_username?: string
  vr_experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  bio?: string
  location?: string
  website_url?: string
  total_matches: number
  wins: number
  losses: number
  ranking_points: number
  current_rank: string
  member_since: string
  membership_status: 'active' | 'inactive' | 'suspended' | 'banned'
  membership_tier: 'standard' | 'premium' | 'vip' | 'admin'
  email_notifications: boolean
  discord_notifications: boolean
  public_profile: boolean
  created_at: string
  updated_at: string
}

export interface SignUpData {
  email: string
  password: string
  username: string
  fullName?: string
  discordUsername?: string
  vrExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface SignInData {
  email: string
  password: string
}

// Authentication functions
export async function signUp(data: SignUpData) {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          full_name: data.fullName || '',
          discord_username: data.discordUsername || '',
          vr_experience_level: data.vrExperience || 'beginner',
        }
      }
    })

    if (error) throw error

    // Log the signup activity
    if (authData.user) {
      await logActivity(authData.user.id, 'user_signup', 'User created account', {
        username: data.username,
        vr_experience: data.vrExperience
      })
    }

    return { user: authData.user, session: authData.session }
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

export async function signIn(data: SignInData) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) throw error

    // Log the signin activity
    if (authData.user) {
      await logActivity(authData.user.id, 'user_signin', 'User signed in')
    }

    return { user: authData.user, session: authData.session }
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await logActivity(user.id, 'user_signout', 'User signed out')
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await logActivity(user.id, 'password_update', 'User updated password')
    }
  } catch (error) {
    console.error('Update password error:', error)
    throw error
  }
}

// Profile management functions
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Get current user profile error:', error)
    return null
  }
}

export async function updateUserProfile(updates: Partial<UserProfile>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    await logActivity(user.id, 'profile_update', 'User updated profile', updates)
    return data
  } catch (error) {
    console.error('Update user profile error:', error)
    throw error
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Get user profile error:', error)
    return null
  }
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Get user by username error:', error)
    return null
  }
}

// Member management functions
export async function getAllMembers(limit = 50, offset = 0) {
  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('public_profile', true)
      .eq('membership_status', 'active')
      .order('ranking_points', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { members: data, total: count }
  } catch (error) {
    console.error('Get all members error:', error)
    return { members: [], total: 0 }
  }
}

export async function getTopMembers(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, ranking_points, current_rank, wins, losses, total_matches')
      .eq('public_profile', true)
      .eq('membership_status', 'active')
      .order('ranking_points', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Get top members error:', error)
    return []
  }
}

export async function searchMembers(query: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, ranking_points, current_rank')
      .eq('public_profile', true)
      .eq('membership_status', 'active')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .order('ranking_points', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Search members error:', error)
    return []
  }
}

// Activity logging
export async function logActivity(
  userId: string, 
  action: string, 
  description?: string, 
  metadata?: any
) {
  try {
    const { error } = await supabase
      .from('activity_log')
      .insert({
        user_id: userId,
        action,
        description,
        metadata,
        ip_address: null, // Would need to get from request in a real app
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
      })

    if (error) throw error
  } catch (error) {
    console.error('Log activity error:', error)
    // Don't throw error for logging failures
  }
}

// Notification functions
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' | 'tournament' | 'match' | 'team' = 'info',
  actionUrl?: string
) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl
      })

    if (error) throw error
  } catch (error) {
    console.error('Create notification error:', error)
    throw error
  }
}

export async function getUserNotifications(userId: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Get user notifications error:', error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
  } catch (error) {
    console.error('Mark notification as read error:', error)
    throw error
  }
}

// Utility functions
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (error && error.code === 'PGRST116') {
      // No rows returned, username is available
      return true
    }

    if (error) throw error
    
    // Username exists
    return false
  } catch (error) {
    console.error('Check username availability error:', error)
    return false
  }
}

export function calculateWinRate(wins: number, losses: number): number {
  const totalGames = wins + losses
  if (totalGames === 0) return 0
  return Math.round((wins / totalGames) * 100)
}

export function getRankFromPoints(points: number): string {
  if (points >= 2500) return 'Grandmaster'
  if (points >= 2000) return 'Master'
  if (points >= 1750) return 'Diamond'
  if (points >= 1500) return 'Platinum'
  if (points >= 1250) return 'Gold'
  if (points >= 1000) return 'Silver'
  if (points >= 750) return 'Bronze'
  return 'Recruit'
}
