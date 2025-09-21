'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(10, 10, 15, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem 0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: '800',
          color: 'white',
          textDecoration: 'none'
        }}>
          <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Shield Shape */}
            <path 
              d="M50 10 L20 25 L20 60 Q20 80 50 90 Q80 80 80 60 L80 25 Z" 
              fill="url(#shieldGradient)" 
              stroke="url(#glowGradient)" 
              strokeWidth="2"
            />
            
            {/* Crown */}
            <path 
              d="M35 20 L40 15 L45 20 L50 12 L55 20 L60 15 L65 20 L60 25 L40 25 Z" 
              fill="url(#crownGradient)" 
              stroke="url(#glowGradient)" 
              strokeWidth="1"
            />
            
            {/* Circuit Pattern */}
            <g stroke="url(#circuitGradient)" strokeWidth="1" fill="none">
              <path d="M30 35 L70 35 M40 30 L40 40 M60 30 L60 40"/>
              <path d="M35 45 L65 45 M45 40 L45 50 M55 40 L55 50"/>
              <path d="M30 55 L70 55 M40 50 L40 60 M60 50 L60 60"/>
              <circle cx="40" cy="35" r="2" fill="url(#circuitGradient)"/>
              <circle cx="60" cy="35" r="2" fill="url(#circuitGradient)"/>
              <circle cx="45" cy="45" r="2" fill="url(#circuitGradient)"/>
              <circle cx="55" cy="45" r="2" fill="url(#circuitGradient)"/>
            </g>
            
            {/* Gradients */}
            <defs>
              <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#1E293B'}}/>
                <stop offset="100%" style={{stopColor:'#0F172A'}}/>
              </linearGradient>
              <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#00D4FF'}}/>
                <stop offset="100%" style={{stopColor:'#06B6D4'}}/>
              </linearGradient>
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#00D4FF'}}/>
                <stop offset="100%" style={{stopColor:'#22D3EE'}}/>
              </linearGradient>
              <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#00D4FF'}}/>
                <stop offset="100%" style={{stopColor:'#06B6D4'}}/>
              </linearGradient>
            </defs>
          </svg>
          <span>Lords of Esport</span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2rem',
            alignItems: 'center',
            margin: 0,
            padding: 0
          }}>
            <li>
              <Link href="/" style={{
                color: '#b4b4c7',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                position: 'relative'
              }} 
              onMouseEnter={(e) => {
                e.target.style.color = '#00d4ff'
                e.target.style.background = 'rgba(0, 212, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#b4b4c7'
                e.target.style.background = 'transparent'
              }}>
                Royal Tournaments
              </Link>
            </li>
            <li>
              <Link href="/leaderboard" style={{
                color: '#b4b4c7',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00d4ff'
                e.target.style.background = 'rgba(0, 212, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#b4b4c7'
                e.target.style.background = 'transparent'
              }}>
                Hall of Lords
              </Link>
            </li>
            <li>
              <Link href="/dashboard" style={{
                color: '#b4b4c7',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00d4ff'
                e.target.style.background = 'rgba(0, 212, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#b4b4c7'
                e.target.style.background = 'transparent'
              }}>
                My Battles
              </Link>
            </li>
            <li>
              <Link href="/login" style={{
                color: '#b4b4c7',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00d4ff'
                e.target.style.background = 'rgba(0, 212, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#b4b4c7'
                e.target.style.background = 'transparent'
              }}>
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/signup" style={{
                color: '#b4b4c7',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00d4ff'
                e.target.style.background = 'rgba(0, 212, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#b4b4c7'
                e.target.style.background = 'transparent'
              }}>
                Join Lords
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
