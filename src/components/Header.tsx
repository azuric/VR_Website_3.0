'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="header">
      <div className="nav-container">
        <div className="logo-section">
          <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
          <span className="brand-name">Lords of Esport</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link href="/" className="nav-link active">Royal Tournaments</Link></li>
            <li><Link href="/leaderboard" className="nav-link">Hall of Lords</Link></li>
            <li><Link href="/profile" className="nav-link">My Battles</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
