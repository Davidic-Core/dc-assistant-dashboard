'use client'

import { useState } from 'react'
import { Search, Bell, Github, ChevronDown } from 'lucide-react'

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 sm:left-64 h-16 bg-card border-b border-card-border px-6 flex items-center justify-between z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search repositories, issues..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-lg text-foreground text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-card-border rounded-lg transition-colors group">
          <Bell className="w-5 h-5 text-text-secondary group-hover:text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* GitHub Button */}
        <a
          href="https://github.com/Davidic-Core"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-card-border rounded-lg transition-colors"
          title="Visit GitHub"
        >
          <Github className="w-5 h-5 text-text-secondary hover:text-foreground" />
        </a>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-card-border rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center text-background font-bold text-sm">
              DC
            </div>
            <span className="hidden sm:inline text-sm font-medium">Davidic-Core</span>
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-card-border rounded-lg shadow-lg py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-card-border transition-colors">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-card-border transition-colors">
                Preferences
              </button>
              <hr className="my-2 border-card-border" />
              <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-card-border transition-colors">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
