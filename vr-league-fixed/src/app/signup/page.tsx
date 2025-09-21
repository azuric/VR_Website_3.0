'use client'

import { useState } from 'react'
import { signUp, checkUsernameAvailability } from '@/lib/auth'
import Header from '@/components/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    discordUsername: '',
    vrExperience: 'beginner'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      // Try to check username availability, but don't block signup if it fails
      try {
        const isUsernameAvailable = await checkUsernameAvailability(formData.username)
        if (!isUsernameAvailable) {
          setError('Username is already taken. Please choose another.')
          setLoading(false)
          return
        }
      } catch (usernameError) {
        console.log('Username check failed, proceeding with signup:', usernameError)
        // Continue with signup even if username check fails
      }

      // Sign up the user using the new auth system
      const { user } = await signUp({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        fullName: formData.fullName,
        discordUsername: formData.discordUsername,
        vrExperience: formData.vrExperience as 'beginner' | 'intermediate' | 'advanced' | 'expert'
      })

      setSuccess('Account created successfully! Check your email for the confirmation link.')
      
      // Clear form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        fullName: '',
        discordUsername: '',
        vrExperience: 'beginner'
      })

    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="max-w-lg mx-auto">
          <div className="auth-form">
            <h2>Join the Lords of Esport</h2>
            <p className="text-center text-gray-400 mb-6">
              Create your account and begin your journey to VR supremacy
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
                {success}
              </div>
            )}

            <form onSubmit={handleSignUp}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="VRWarrior123"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="warrior@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Confirm password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="discordUsername" className="form-label">
                  Discord Username
                </label>
                <input
                  id="discordUsername"
                  name="discordUsername"
                  type="text"
                  value={formData.discordUsername}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="username#1234"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vrExperience" className="form-label">
                  VR Experience Level
                </label>
                <select
                  id="vrExperience"
                  name="vrExperience"
                  value={formData.vrExperience}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="beginner">Beginner (0-6 months)</option>
                  <option value="intermediate">Intermediate (6 months - 2 years)</option>
                  <option value="advanced">Advanced (2+ years)</option>
                  <option value="expert">Expert/Pro Player</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mb-4"
              >
                {loading ? 'Creating Account...' : 'Join the Lords'}
              </button>
            </form>

            <div className="text-center">
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Already have an account? Sign In
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              ← Back to Arena
            </Link>
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
