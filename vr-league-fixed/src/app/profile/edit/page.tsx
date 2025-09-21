'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { getCurrentUserProfile, updateUserProfile, UserProfile } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    discord_username: '',
    bio: '',
    location: '',
    website_url: '',
    vr_experience_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    email_notifications: true,
    discord_notifications: false,
    public_profile: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
        setFormData({
          username: userProfile.username || '',
          full_name: userProfile.full_name || '',
          discord_username: userProfile.discord_username || '',
          bio: userProfile.bio || '',
          location: userProfile.location || '',
          website_url: userProfile.website_url || '',
          vr_experience_level: userProfile.vr_experience_level || 'beginner',
          email_notifications: userProfile.email_notifications,
          discord_notifications: userProfile.discord_notifications,
          public_profile: userProfile.public_profile
        })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateUserProfile(formData)
      setSuccess('Profile updated successfully!')
      
      // Refresh profile data
      const updatedProfile = await getCurrentUserProfile()
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
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
          <Link href="/dashboard" className="btn-primary inline-block px-6 py-3 rounded-lg">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
              <p className="text-gray-300">Update your Lords of Esport profile information</p>
            </div>
            <Link href="/dashboard" className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Form */}
          <div className="lords-card p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      Username *
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className="form-input"
                      required
                      disabled // Username shouldn't be changeable after creation
                    />
                    <p className="text-gray-500 text-sm mt-1">Username cannot be changed</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="full_name" className="form-label">
                      Full Name
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-input"
                    rows={3}
                    placeholder="Tell other warriors about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="location" className="form-label">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="website_url" className="form-label">
                      Website
                    </label>
                    <input
                      id="website_url"
                      name="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              {/* Gaming Information */}
              <div className="pt-6 border-t border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Gaming Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="discord_username" className="form-label">
                      Discord Username
                    </label>
                    <input
                      id="discord_username"
                      name="discord_username"
                      type="text"
                      value={formData.discord_username}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="username#1234"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="vr_experience_level" className="form-label">
                      VR Experience Level
                    </label>
                    <select
                      id="vr_experience_level"
                      name="vr_experience_level"
                      value={formData.vr_experience_level}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="beginner">Beginner (0-6 months)</option>
                      <option value="intermediate">Intermediate (6 months - 2 years)</option>
                      <option value="advanced">Advanced (2+ years)</option>
                      <option value="expert">Expert/Pro Player</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy & Notifications */}
              <div className="pt-6 border-t border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Privacy & Notifications</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="public_profile"
                      checked={formData.public_profile}
                      onChange={handleChange}
                      className="mr-3 rounded border-gray-600 bg-gray-700 text-cyan-600"
                    />
                    <div>
                      <span className="text-white font-medium">Public Profile</span>
                      <p className="text-gray-400 text-sm">Allow your profile to be visible in leaderboards and member directory</p>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="email_notifications"
                      checked={formData.email_notifications}
                      onChange={handleChange}
                      className="mr-3 rounded border-gray-600 bg-gray-700 text-cyan-600"
                    />
                    <div>
                      <span className="text-white font-medium">Email Notifications</span>
                      <p className="text-gray-400 text-sm">Receive tournament updates and important announcements via email</p>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="discord_notifications"
                      checked={formData.discord_notifications}
                      onChange={handleChange}
                      className="mr-3 rounded border-gray-600 bg-gray-700 text-cyan-600"
                    />
                    <div>
                      <span className="text-white font-medium">Discord Notifications</span>
                      <p className="text-gray-400 text-sm">Receive notifications via Discord (requires Discord username)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-8 py-3 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
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
