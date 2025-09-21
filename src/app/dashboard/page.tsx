'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { getCurrentUserProfile, getUserNotifications, markNotificationAsRead, calculateWinRate, UserProfile } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Trophy, Users, Calendar, TrendingUp, Bell, Settings, Edit, Shield } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  action_url?: string
  created_at: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const userProfile = await getCurrentUserProfile()
      if (userProfile) {
        setProfile(userProfile)
        const userNotifications = await getUserNotifications(userProfile.id)
        setNotifications(userNotifications)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      )
    }

    if (notification.action_url) {
      router.push(notification.action_url)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="main-content text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">Unable to load your profile. Please try again.</p>
          <Link href="/" className="btn-primary inline-block px-6 py-3 rounded-lg">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const winRate = calculateWinRate(profile.wins, profile.losses)
  const unreadNotifications = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {profile.username}!
              </h1>
              <p className="text-gray-300">
                Member since {new Date(profile.member_since).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">{profile.current_rank}</span>
              </div>
              <Link href="/profile/edit" className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="lords-card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{profile.ranking_points}</div>
                  <div className="text-sm text-gray-400">Ranking Points</div>
                </div>
              </div>
            </div>
            
            <div className="lords-card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{winRate}%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
              </div>
            </div>
            
            <div className="lords-card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{profile.total_matches}</div>
                  <div className="text-sm text-gray-400">Total Matches</div>
                </div>
              </div>
            </div>
            
            <div className="lords-card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-4 relative">
                  <Bell className="w-6 h-6 text-white" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      {unreadNotifications}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{notifications.length}</div>
                  <div className="text-sm text-gray-400">Notifications</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'matches', label: 'Match History' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="lords-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-medium">Joined Lords of Esport</p>
                    <p className="text-gray-400 text-sm">{new Date(profile.member_since).toLocaleDateString()}</p>
                  </div>
                </div>
                {profile.total_matches === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No matches played yet</p>
                    <Link href="/" className="text-cyan-400 hover:text-cyan-300 mt-2 inline-block">
                      Join a tournament →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Wins</span>
                      <span className="text-green-400 font-semibold">{profile.wins}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Losses</span>
                      <span className="text-red-400 font-semibold">{profile.losses}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="lords-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Profile Summary</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Username</label>
                  <p className="text-white font-medium">{profile.username}</p>
                </div>
                {profile.full_name && (
                  <div>
                    <label className="text-gray-400 text-sm">Full Name</label>
                    <p className="text-white font-medium">{profile.full_name}</p>
                  </div>
                )}
                {profile.discord_username && (
                  <div>
                    <label className="text-gray-400 text-sm">Discord</label>
                    <p className="text-white font-medium">{profile.discord_username}</p>
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-sm">VR Experience</label>
                  <p className="text-white font-medium capitalize">{profile.vr_experience_level}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Membership Tier</label>
                  <p className="text-cyan-400 font-medium capitalize">{profile.membership_tier}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="lords-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Notifications</h3>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      notification.is_read
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-700 border-cyan-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{notification.title}</h4>
                        <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-cyan-400 rounded-full ml-4 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="lords-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Match History</h3>
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No matches played yet</p>
              <Link href="/" className="btn-primary inline-block px-6 py-3 rounded-lg">
                Join Your First Tournament
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="lords-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-medium mb-3">Notification Preferences</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.email_notifications}
                      className="mr-3 rounded border-gray-600 bg-gray-700 text-cyan-600"
                      readOnly
                    />
                    <span className="text-gray-300">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.discord_notifications}
                      className="mr-3 rounded border-gray-600 bg-gray-700 text-cyan-600"
                      readOnly
                    />
                    <span className="text-gray-300">Discord notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Privacy Settings</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.public_profile}
                    className="mr-3 rounded border-gray-600 bg-gray-700 text-cyan-600"
                    readOnly
                  />
                  <span className="text-gray-300">Public profile (visible in leaderboards)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Link href="/profile/edit" className="btn-primary inline-block px-6 py-3 rounded-lg">
                  Edit Profile Settings
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="max-w-1200px mx-auto px-8">
          <p>&copy; 2025 Lords of Esport. Rule the Virtual Realm.</p>
        </div>
      </footer>
    </div>
  )
}
