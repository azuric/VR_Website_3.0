'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { getAllMembers, getTopMembers, searchMembers, calculateWinRate } from '@/lib/auth'
import { Trophy, Medal, Award, Search, Users, TrendingUp } from 'lucide-react'

interface Member {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  ranking_points: number
  current_rank: string
  wins: number
  losses: number
  total_matches: number
  member_since: string
}

export default function LeaderboardPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [topMembers, setTopMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Member[]>([])
  const [activeTab, setActiveTab] = useState('top')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalMembers, setTotalMembers] = useState(0)
  const membersPerPage = 20

  useEffect(() => {
    loadData()
  }, [currentPage])

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch()
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load top members for the leaderboard
      const topMembersData = await getTopMembers(10)
      setTopMembers(topMembersData)

      // Load all members with pagination
      const { members: allMembers, total } = await getAllMembers(
        membersPerPage, 
        (currentPage - 1) * membersPerPage
      )
      setMembers(allMembers)
      setTotalMembers(total || 0)
    } catch (error) {
      console.error('Error loading leaderboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      const results = await searchMembers(searchQuery.trim())
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching members:', error)
    }
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{position}</span>
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-400 to-yellow-600'
      case 2:
        return 'from-gray-300 to-gray-500'
      case 3:
        return 'from-amber-500 to-amber-700'
      default:
        return 'from-gray-600 to-gray-800'
    }
  }

  const totalPages = Math.ceil(totalMembers / membersPerPage)

  if (loading && members.length === 0) {
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="brand-highlight">Hall of Lords</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            The finest VR warriors in the Lords of Esport realm
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="lords-card p-6">
              <div className="flex items-center justify-center">
                <Users className="w-8 h-8 text-cyan-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{totalMembers}</div>
                  <div className="text-gray-400">Total Warriors</div>
                </div>
              </div>
            </div>
            
            <div className="lords-card p-6">
              <div className="flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{topMembers.length > 0 ? topMembers[0]?.ranking_points || 0 : 0}</div>
                  <div className="text-gray-400">Highest Score</div>
                </div>
              </div>
            </div>
            
            <div className="lords-card p-6">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {topMembers.length > 0 ? Math.round(topMembers.reduce((acc, m) => acc + calculateWinRate(m.wins, m.losses), 0) / topMembers.length) : 0}%
                  </div>
                  <div className="text-gray-400">Avg Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search warriors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
              {[
                { id: 'top', label: 'Top 10' },
                { id: 'all', label: 'All Warriors' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
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
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Search Results</h3>
            <div className="lords-card">
              {searchResults.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {member.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{member.username}</h4>
                      {member.full_name && (
                        <p className="text-gray-400 text-sm">{member.full_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">{member.ranking_points} pts</div>
                    <div className="text-gray-400 text-sm">{member.current_rank}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top 10 Leaderboard */}
        {activeTab === 'top' && (
          <div className="mb-8">
            <h2 className="section-title">Elite Warriors</h2>
            {topMembers.length === 0 ? (
              <div className="lords-card p-8 text-center">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No warriors have earned ranking points yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topMembers.map((member, index) => {
                  const position = index + 1
                  const winRate = calculateWinRate(member.wins, member.losses)
                  
                  return (
                    <div key={member.id} className={`lords-card p-6 ${position <= 3 ? 'border-2' : ''} ${
                      position === 1 ? 'border-yellow-400' :
                      position === 2 ? 'border-gray-400' :
                      position === 3 ? 'border-amber-600' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getRankColor(position)} rounded-full flex items-center justify-center`}>
                            {getRankIcon(position)}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {member.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{member.username}</h3>
                              {member.full_name && (
                                <p className="text-gray-400">{member.full_name}</p>
                              )}
                              <p className="text-cyan-400 font-semibold">{member.current_rank}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white mb-1">
                            {member.ranking_points} <span className="text-sm text-gray-400">pts</span>
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div>Win Rate: <span className="text-green-400">{winRate}%</span></div>
                            <div>Matches: <span className="text-white">{member.total_matches}</span></div>
                            <div>W/L: <span className="text-green-400">{member.wins}</span>/<span className="text-red-400">{member.losses}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* All Members */}
        {activeTab === 'all' && (
          <div className="mb-8">
            <h2 className="section-title">All Warriors</h2>
            {members.length === 0 ? (
              <div className="lords-card p-8 text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No members found</p>
              </div>
            ) : (
              <>
                <div className="lords-card">
                  {members.map((member, index) => {
                    const globalPosition = (currentPage - 1) * membersPerPage + index + 1
                    const winRate = calculateWinRate(member.wins, member.losses)
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold">
                            #{globalPosition}
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {member.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{member.username}</h4>
                            {member.full_name && (
                              <p className="text-gray-400 text-sm">{member.full_name}</p>
                            )}
                            <p className="text-cyan-400 text-sm">{member.current_rank}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {member.ranking_points} <span className="text-sm text-gray-400">pts</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {winRate}% WR • {member.total_matches} matches
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                      >
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 bg-cyan-600 text-white rounded-lg">
                        {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
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
