'use client'

import { useState } from 'react'
import { signIn, resetPassword } from '@/lib/auth'
import Header from '@/components/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { user } = await signIn({ email, password })
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await resetPassword(email)
      setSuccess('Password reset email sent! Check your inbox.')
      setShowResetPassword(false)
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
        <div className="max-w-md mx-auto">
          <div className="auth-form">
            <h2>{showResetPassword ? 'Reset Password' : 'Enter the Arena'}</h2>
            
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

            {showResetPassword ? (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="warrior@lordsofesport.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mb-4"
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(false)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignIn}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="warrior@lordsofesport.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mb-4"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm block mx-auto"
                  >
                    Forgot your password?
                  </button>
                  
                  <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors block">
                    Need an account? Join the Lords
                  </Link>
                </div>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm">
                By joining Lords of Esport, you agree to our terms of service and privacy policy.
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
