'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  GitBranch,
  MessageSquare,
  Terminal,
  Settings,
  ChevronLeft,
  ChevronRight,
  Code2,
} from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Repositories', href: '/repositories', icon: GitBranch },
  { label: 'Terminal', href: '/terminal', icon: Terminal },
  { label: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden sm:flex flex-col fixed left-0 top-0 h-screen bg-card border-r border-card-border transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-card-border">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Code2 className="w-5 h-5 text-background" />
              </div>
              <span className="font-bold text-lg">DC</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-card-border rounded-lg transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-accent text-background font-medium'
                    : 'text-text-secondary hover:bg-card-border hover:text-foreground'
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-card-border">
            <p className="text-xs text-text-tertiary">
              DC Assistant v1.0
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar - simplified */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-40">
        <nav className="flex justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex justify-center py-3 transition-colors ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Spacer for sidebar on desktop */}
      <div className={`hidden sm:block transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`} />
    </>
  )
}
