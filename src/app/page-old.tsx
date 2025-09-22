'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getTournaments } from '@/lib/supabase'
import Header from '@/components/Header'
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
          entry.target.classList.add('slide-in')
        }
      })
    }, observerOptions)

    // Observe all scroll-reveal and animated elements
    setTimeout(() => {
      document.querySelectorAll('.scroll-reveal, .tournament-card-animated, .feature-card-animated, .stats-item-animated, .slide-in-left, .slide-in-right, .slide-in-up').forEach(el => {
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
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="loading"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
           {/* Hero Section with Video Background */}
      <section className="hero-video-container">
        <video 
          className="hero-video-background"
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-video-overlay"></div>
        <div className="hero-content-over-video">
          <h1 className="animate-fade-in-up">
            Welcome to <span className="brand-highlight">Lords of Esport</span>
          </h1>
          <p className="animate-fade-in-up animation-delay-200">
            Rule the Virtual Realm. Where VR warriors forge their legends in the ultimate Population One battleground.
          </p>
          <div className="hero-buttons-over-video animate-fade-in-up animation-delay-400">
            <Link href="/signup" className="btn-futuristic btn-glow-futuristic btn-holographic">
              <span className="btn-text">
                <Play className="w-5 h-5 btn-icon" />
                Join The Battle
              </span>
            </Link>
            <Link href="/login" className="btn-futuristic btn-neon-border">
              <span className="btn-text">
                <Crown className="w-5 h-5 btn-icon" />
                Become a Lord
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Feature Cards Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title animate-fade-in-up">Forge Your Legend</h2>
            <p className="section-subtitle animate-fade-in-up animation-delay-200">
              Three pillars of greatness await every aspiring lord
            </p>
          </div>
          
          <div className="grid-3 animate-fade-in-up animation-delay-400">
            <div className="feature-card slide-in-left">
              <div className="feature-icon">
                <Sword className="w-8 h-8" />
              </div>
              <h3>Royal Competition</h3>
              <p>Compete in elite VR tournaments with the finest warriors across the UK. Prove your worth in Population One's most prestigious battles.</p>
            </div>
            
            <div className="feature-card slide-in-up">
              <div className="feature-icon">
                <Users className="w-8 h-8" />
              </div>
              <h3>Noble Alliance</h3>
              <p>Join forces with fellow lords, form unbreakable teams, and dominate the virtual battlefield together as one unstoppable force.</p>
            </div>
            
            <div className="feature-card slide-in-right">
              <div className="feature-icon">
                <Trophy className="w-8 h-8" />
              </div>
              <h3>Ascend to Glory</h3>
              <p>Rise through the ranks, earn legendary status, and claim your rightful place among the greatest VR esports champions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="stats-grid">
            <div className="stat-card animate-fade-in-up">
              <h3>500+</h3>
              <p>Elite Warriors</p>
            </div>
            <div className="stat-card animate-fade-in-up animation-delay-100">
              <h3>£50K+</h3>
              <p>Prize Pool</p>
            </div>
            <div className="stat-card animate-fade-in-up animation-delay-200">
              <h3>24/7</h3>
              <p>Battle Ready</p>
            </div>
            <div className="stat-card animate-fade-in-up animation-delay-300">
              <h3>UK #1</h3>
              <p>VR League</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title animate-fade-in-up">Royal Tournaments</h2>
            <p className="section-subtitle animate-fade-in-up animation-delay-200">
              Elite competitions worthy of true lords
            </p>
          </div>
          
          <div className="grid-2 animate-fade-in-up animation-delay-400">
            {tournaments.map((tournament, index) => (
              <div 
                key={tournament.id} 
                className="tournament-card-animated"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(26, 26, 36, 0.95) 100%)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.8)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="tournament-card-header-animated">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3>{tournament.name}</h3>
                      <span className="tournament-badge">Elite</span>
                    </div>
                  </div>
                  <p>{tournament.description}</p>
                </div>
                
                <div className="tournament-card-content-animated">
                  <div className="tournament-stats">
                    <div className="stat">
                      <span className="stat-label">Prize Pool</span>
                      <span className="stat-value">£{tournament.prize_pool}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Participants</span>
                      <span className="stat-value">/{tournament.max_participants}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Entry Fee</span>
                      <span className="stat-value">£{tournament.entry_fee}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Game Mode</span>
                      <span className="stat-value">{tournament.game_mode}</span>
                    </div>
                  </div>
                  
                  <div className="btn-group" style={{ gap: '1rem' }}>
                    <Link href="/signup" className="btn-futuristic btn-primary-futuristic" style={{ flex: 1, padding: '0.75rem 1.5rem' }}>
                      <span className="btn-text">Register Now</span>
                    </Link>
                    <Link href="/tournaments" className="btn-futuristic btn-secondary-futuristic" style={{ flex: 1, padding: '0.75rem 1.5rem' }}>
                      <span className="btn-text">Learn More</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link href="/tournaments" className="btn-futuristic btn-secondary-futuristic btn-large-futuristic">
              <span className="btn-text">
                <Calendar className="w-5 h-5 btn-icon" />
                View All Tournaments
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900/80 to-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in-up">
            Ready to <span className="brand-highlight">Claim Your Throne</span>?
          </h2>
          <p className="text-xl mb-8 text-gray-300 animate-fade-in-up animation-delay-200">
            Join the most elite VR esports community in the UK. Compete, conquer, and claim your crown.
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-futuristic btn-primary-futuristic btn-large-futuristic btn-glow-futuristic btn-holographic">
              <span className="btn-text">
                <Crown className="w-5 h-5 btn-icon" />
                Claim Your Throne
              </span>
            </Link>
            <Link href="/leaderboard" className="btn-futuristic btn-secondary-futuristic btn-large-futuristic btn-neon-border">
              <span className="btn-text">
                <Trophy className="w-5 h-5 btn-icon" />
                View Champions
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
                  <Shield className="w-5 h-5 btn-icon" />
                  Enter Your Realm
                </span>
              </Link>
              <Link href="/leaderboard" className="btn-futuristic btn-secondary-futuristic btn-large-futuristic btn-particles">
                <span className="btn-text">
                  <Trophy className="w-5 h-5 btn-icon" />
                  Hall of Lords
                </span>
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
            <div className="feature-card-animated slide-in-left">
              <div className="feature-icon-animated">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Royal Competition</h3>
              <p>Compete in elite VR tournaments with the finest warriors across the UK. Prove your worth in Population One&apos;s most prestigious battles.</p>
            </div>

            <div className="feature-card-animated slide-in-up" style={{ transitionDelay: '0.2s' }}>
              <div className="feature-icon-animated">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Noble Alliance</h3>
              <p>Join forces with fellow lords, form unbreakable teams, and dominate the virtual battlefield together as one unstoppable force.</p>
            </div>

            <div className="feature-card-animated slide-in-right" style={{ transitionDelay: '0.4s' }}>
              <div className="feature-icon-animated">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ascend to Glory</h3>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <h2 className="section-title text-left mb-0 scroll-reveal">Royal Tournaments</h2>
            <Link href="/tournaments" className="btn-futuristic btn-secondary-futuristic scroll-reveal" style={{ 
              padding: '0.75rem 1.5rem',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span className="btn-text">
                View All
                <ChevronRight className="w-4 h-4 btn-icon" />
              </span>
            </Link>
          </div>

          {tournaments.length === 0 ? (
            <div className="text-center py-16 scroll-reveal">
              <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Tournaments Coming Soon</h3>
              <p className="text-gray-400">Epic battles are being prepared. Stay tuned for legendary competitions.</p>
            </div>
          ) : (
            <div className="grid grid-2 tournament-cards-container">
              {tournaments.slice(0, 4).map((tournament, index) => (
                <div key={tournament.id} className="tournament-card-animated slide-in" style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(26, 26, 36, 0.95) 100%)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.8)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #006699 100%)',
                    color: 'white',
                    padding: '1.5rem'
                  }}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{tournament.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">Elite</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem' }}>
                    <p className="text-gray-300 mb-4">{tournament.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-400">Prize Pool</div>
                        <div className="text-lg font-bold prize-pool-animated">£{tournament.prize_pool}</div>
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

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button className="btn-futuristic btn-primary-futuristic" style={{ 
                        flex: 1, 
                        padding: '0.75rem 1.5rem',
                        minHeight: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span className="btn-text">
                          <Zap className="w-4 h-4 btn-icon" />
                          Register Now
                        </span>
                      </button>
                      <button className="btn-futuristic btn-secondary-futuristic" style={{ 
                        flex: 1, 
                        padding: '0.75rem 1.5rem',
                        minHeight: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span className="btn-text">
                          Learn More
                        </span>
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
              <div style={{ 
                display: 'flex', 
                gap: '2rem', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }} className="scroll-reveal">
                <Link href="/signup" className="btn-futuristic btn-primary-futuristic btn-large-futuristic btn-glow-futuristic btn-holographic">
                  <span className="btn-text">
                    <Crown className="w-5 h-5 btn-icon" />
                    Claim Your Throne
                  </span>
                </Link>
                <Link href="/leaderboard" className="btn-futuristic btn-secondary-futuristic btn-large-futuristic btn-neon-border">
                  <span className="btn-text">
                    <Trophy className="w-5 h-5 btn-icon" />
                    View Champions
                  </span>
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
