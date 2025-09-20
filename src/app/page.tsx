'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import Header from '@/components/Header'
import { supabase, getTournaments, Tournament } from '@/lib/supabase'
import { Trophy, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = async () => {
    try {
      const data = await getTournaments()
      setTournaments(data)
    } catch (error) {
      console.error('Error loading tournaments:', error)
    }
  }

  const handleTournamentRegister = async (tournamentId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }
    
    try {
      // This would integrate with your payment system
      alert('Tournament registration would be processed here with Stripe integration')
      // For now, just reload tournaments
      await loadTournaments()
    } catch (error) {
      console.error('Error registering for tournament:', error)
      alert('Registration failed. Please try again.')
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

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <h1>Welcome to <span className="brand-highlight">Lords of Esport</span></h1>
          <p>Rule the Virtual Realm. Where VR warriors forge their legends in the ultimate Population One battleground.</p>
          
          {!user && (
            <div className="mt-8">
              <Link href="/login" className="btn-primary inline-block px-8 py-3 rounded-lg font-semibold text-lg">
                Join the Battle
              </Link>
            </div>
          )}
        </section>

        {/* Features */}
        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">
              <Trophy size={24} />
            </div>
            <h3>Royal Competition</h3>
            <p>Elite tournament structure with substantial prize pools and pathways to legendary status.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Users size={24} />
            </div>
            <h3>Noble Alliance</h3>
            <p>Official partnership with VRXtra Kingston provides professional-grade facilities and royal treatment.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={24} />
            </div>
            <h3>Ascend to Glory</h3>
            <p>Master Population One&apos;s revolutionary combat system and claim your throne in the virtual realm.</p>
          </div>
        </section>

        {/* Tournaments */}
        <section className="tournaments">
          <h2 className="section-title">Royal Tournaments</h2>
          <div className="tournament-grid">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="tournament-card">
                <div className="tournament-header">
                  <h3>{tournament.name}</h3>
                </div>
                <div className="tournament-content">
                  <p className="mb-4">{tournament.description}</p>
                  <div className="tournament-details">
                    <div className="detail-item">Entry Fee: <span className="detail-value">£{tournament.entry_fee}</span></div>
                    <div className="detail-item">Prize Pool: <span className="detail-value prize-pool">£{tournament.prize_pool}</span></div>
                    <div className="detail-item">Players: <span className="detail-value">8/{tournament.max_participants}</span></div>
                    <div className="detail-item">Status: <span className="detail-value" style={{color: '#10B981'}}>
                      {tournament.status === 'registration_open' ? 'Open' : 
                       tournament.status === 'upcoming' ? 'Soon' : 
                       tournament.status}
                    </span></div>
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => handleTournamentRegister(tournament.id)}
                  >
                    Register Now - £{tournament.entry_fee}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {user && (
          <section className="mb-8">
            <div className="text-center">
              <h2 className="section-title">Welcome back, {user.email?.split('@')[0]}!</h2>
              <p className="text-gray-300 mb-6">
                Ready to dominate the virtual arena? Check out the latest tournaments and climb the leaderboards.
              </p>
              
              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="lords-card p-6">
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{tournaments.length}</div>
                      <div className="text-sm text-gray-400">Active Tournaments</div>
                    </div>
                  </div>
                </div>
                
                <div className="lords-card p-6">
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">1,247</div>
                      <div className="text-sm text-gray-400">Active Players</div>
                    </div>
                  </div>
                </div>
                
                <div className="lords-card p-6">
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-sm text-gray-400">Your Matches</div>
                    </div>
                  </div>
                </div>
                
                <div className="lords-card p-6">
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">1000</div>
                      <div className="text-sm text-gray-400">Ranking Points</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
