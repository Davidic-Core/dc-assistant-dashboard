'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Bell, Github, ChevronDown, AlertCircle, CheckCircle, Info, Clock, X } from 'lucide-react'

const recentNotifications = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Build Successful',
    message: 'dc-assistant-dashboard production build completed successfully',
    timestamp: '10 min ago',
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'Security Alert',
    message: 'New dependency update available: lodash v4.17.21',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    type: 'alert' as const,
    title: 'Failed Test',
    message: 'Unit tests in neural-network-framework failed: 3 failures',
    timestamp: '3 hours ago',
  },
]

const notifIcons = {
  alert: AlertCircle,
  success: CheckCircle,
  info: Info,
  pending: Clock,
}

const notifColors = {
  alert: 'text-red-400 bg-red-500/10',
  success: 'text-green-400 bg-green-500/10',
  info: 'text-blue-400 bg-blue-500/10',
  pending: 'text-yellow-400 bg-yellow-500/10',
}

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="relative p-2 hover:bg-card-border rounded-lg transition-colors group"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-text-secondary group-hover:text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-card-border rounded-lg shadow-xl py-2 z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-card-border">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-card-border rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-text-tertiary" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {recentNotifications.map((notif) => {
                  const Icon = notifIcons[notif.type]
                  const colorClass = notifColors[notif.type]
                  return (
                    <div
                      key={notif.id}
                      className="flex gap-3 px-4 py-3 hover:bg-card-border/50 transition-colors cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {notif.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">{notif.timestamp}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-card-border px-4 py-2">
                <a
                  href="/notifications"
                  className="text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications →
                </a>
              </div>
            </div>
          )}
        </div>

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
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
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
