'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getTournaments } from '@/lib/supabase'
import Link from 'next/link'
import { Trophy, Users, Zap, Crown, Sword, Shield, ChevronRight, Play, Star } from 'lucide-react'

interface Tournament {
  id: string
  name: string
  description: string
  game_mode: string
  max_participants: number
  current_participants: number
  entry_fee: number
  prize_pool: number
  registration_start: string
  registration_end: string
  tournament_start: string
  status: string
}

interface User {
  id: string
  email: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
    loadTournaments()
    
    // Add scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }, observerOptions)

    // Observe all scroll-reveal elements
    setTimeout(() => {
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTournaments = async () => {
    try {
      const tournamentsData = await getTournaments()
      setTournaments(tournamentsData)
    } catch (error) {
      console.error('Error loading tournaments:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="animate-fade-in-up">
            Welcome to <span className="brand-highlight">Lords of Esport</span>
          </h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Rule the Virtual Realm. Where VR warriors forge their legends in the ultimate Population One battleground.
          </p>
          
          {!user ? (
            <div className="btn-group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link href="/login" className="btn btn-primary btn-large">
                <Play className="w-5 h-5" />
                Join The Battle
              </Link>
              <Link href="/signup" className="btn btn-secondary btn-large">
                <Crown className="w-5 h-5" />
                Become a Lord
              </Link>
            </div>
          ) : (
            <div className="btn-group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link href="/dashboard" className="btn btn-primary btn-large">
                <Shield className="w-5 h-5" />
                Enter Your Realm
              </Link>
              <Link href="/leaderboard" className="btn btn-secondary btn-large">
                <Trophy className="w-5 h-5" />
                Hall of Lords
              </Link>
            </div>
          )}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-32 right-16 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title scroll-reveal">Forge Your Legend</h2>
          
          <div className="grid grid-3">
            <div className="card scroll-reveal animate-fade-in-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Royal Competition</h3>
              </div>
              <p>Compete in elite VR tournaments with the finest warriors across the UK. Prove your worth in Population One's most prestigious battles.</p>
            </div>

            <div className="card scroll-reveal animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Noble Alliance</h3>
              </div>
              <p>Join forces with fellow lords, form unbreakable teams, and dominate the virtual battlefield together as one unstoppable force.</p>
            </div>

            <div className="card scroll-reveal animate-fade-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Ascend to Glory</h3>
              </div>
              <p>Rise through the ranks, earn legendary status, and claim your rightful place among the greatest VR esports champions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-gradient-to-r from-cyan-900/10 to-blue-900/10">
        <div className="container">
          <div className="grid grid-4">
            <div className="text-center scroll-reveal">
              <div className="text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-gray-400">Elite Warriors</div>
            </div>
            <div className="text-center scroll-reveal" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-gradient mb-2">£50K+</div>
              <div className="text-gray-400">Prize Pool</div>
            </div>
            <div className="text-center scroll-reveal" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-gray-400">Battle Ready</div>
            </div>
            <div className="text-center scroll-reveal" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-gradient mb-2">UK #1</div>
              <div className="text-gray-400">VR League</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="section-title text-left mb-0 scroll-reveal">Royal Tournaments</h2>
            <Link href="/tournaments" className="btn btn-secondary scroll-reveal">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {tournaments.length === 0 ? (
            <div className="text-center py-16 scroll-reveal">
              <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Tournaments Coming Soon</h3>
              <p className="text-gray-400">Epic battles are being prepared. Stay tuned for legendary competitions.</p>
            </div>
          ) : (
            <div className="grid grid-2">
              {tournaments.slice(0, 4).map((tournament, index) => (
                <div key={tournament.id} className="tournament-card scroll-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="tournament-card-header">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{tournament.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">Elite</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="tournament-card-content">
                    <p className="text-gray-300 mb-4">{tournament.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-400">Prize Pool</div>
                        <div className="text-lg font-bold text-gradient">£{tournament.prize_pool}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Participants</div>
                        <div className="text-lg font-bold">{tournament.current_participants}/{tournament.max_participants}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Entry Fee</div>
                        <div className="text-lg font-bold">£{tournament.entry_fee}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Game Mode</div>
                        <div className="text-lg font-bold">{tournament.game_mode}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="btn btn-primary flex-1">
                        <Zap className="w-4 h-4" />
                        Register Now
                      </button>
                      <button className="btn btn-secondary">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 scroll-reveal">
              Ready to <span className="text-gradient">Rule the Virtual Realm</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 scroll-reveal" style={{ animationDelay: '0.2s' }}>
              Join the most elite VR esports community in the UK. Compete, conquer, and claim your crown.
            </p>
            
            {!user && (
              <div className="btn-group scroll-reveal" style={{ animationDelay: '0.4s' }}>
                <Link href="/signup" className="btn btn-primary btn-large animate-glow">
                  <Crown className="w-5 h-5" />
                  Claim Your Throne
                </Link>
                <Link href="/leaderboard" className="btn btn-secondary btn-large">
                  <Trophy className="w-5 h-5" />
                  View Champions
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Lords of Esport. Rule the Virtual Realm.</p>
        </div>
      </footer>
    </div>
  )
}
