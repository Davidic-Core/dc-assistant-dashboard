'use client'

import { useEffect, useState, useCallback } from 'react'
import LayoutWrapper from '@/components/LayoutWrapper'
import ActivityFeed from '@/components/ActivityFeed'
import { Calendar, TrendingUp, RefreshCw, Loader2, GitBranch } from 'lucide-react'
import { formatRelativeTime } from '@/lib/github-utils'

interface RawActivity {
  id: string
  type: string
  title: string
  description: string
  repo: string
  repoUrl: string
  timestamp: string
  author: string
}

const VALID_TYPES = ['commit', 'pull_request', 'branch', 'push'] as const
type FeedType = typeof VALID_TYPES[number]

export default function ActivityPage() {
  const [activities, setActivities] = useState<RawActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch('/api/github/events')
      if (!res.ok) throw new Error(`Events API error ${res.status}`)
      const data = await res.json()
      setActivities(data.activities || [])
      setLastUpdated(new Date())
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
    const timer = setInterval(() => fetchEvents(true), 30_000)
    return () => clearInterval(timer)
  }, [fetchEvents])

  const feedActivities = activities.map((a) => ({
    ...a,
    type: (VALID_TYPES.includes(a.type as FeedType) ? a.type : 'commit') as FeedType,
    timestamp: formatRelativeTime(a.timestamp),
  }))

  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const monthMs = 30 * 24 * 60 * 60 * 1000
  const thisWeek = activities.filter((a) => now - new Date(a.timestamp).getTime() < weekMs)
  const thisMonth = activities.filter((a) => now - new Date(a.timestamp).getTime() < monthMs)
  const repos = new Set(activities.map((a) => a.repo))

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Live Activity</h1>
            <p className="text-text-secondary mt-2">
              Real-time events from the Davidic-Core account
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-text-tertiary hidden sm:block">
                Updated {formatRelativeTime(lastUpdated.toISOString())}
              </span>
            )}
            <button
              onClick={() => fetchEvents()}
              className="flex items-center gap-2 px-3 py-2 bg-card border border-card-border rounded-lg hover:border-accent/50 transition-colors text-sm text-text-secondary hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">This Week</span>
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-text-tertiary" /> : thisWeek.length}
            </p>
            <p className="text-xs text-text-tertiary mt-2">events recorded</p>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">This Month</span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-text-tertiary" /> : thisMonth.length}
            </p>
            <p className="text-xs text-text-tertiary mt-2">total contributions</p>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Active Repos</span>
              <GitBranch className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-text-tertiary" /> : repos.size}
            </p>
            <p className="text-xs text-text-tertiary mt-2">with recent activity</p>
          </div>
        </div>

        {/* Feed */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            Recent Activity
            {loading && <Loader2 className="w-4 h-4 animate-spin text-text-tertiary" />}
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-card border border-card-border rounded-lg animate-pulse flex-shrink-0" />
                  <div className="flex-1 bg-card border border-card-border rounded-lg p-4 animate-pulse">
                    <div className="h-3 bg-card-border rounded w-2/3 mb-2" />
                    <div className="h-3 bg-card-border rounded w-full mb-2" />
                    <div className="h-3 bg-card-border rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : feedActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <GitBranch className="w-12 h-12 text-text-tertiary mb-4" />
              <p className="text-foreground font-medium">No recent activity found</p>
              <p className="text-text-secondary text-sm mt-1">
                GitHub public events may take a moment to appear
              </p>
            </div>
          ) : (
            <ActivityFeed activities={feedActivities} />
          )}
        </div>

        {!loading && feedActivities.length > 0 && (
          <p className="text-xs text-text-tertiary text-center pb-4">
            Showing {feedActivities.length} events • Auto-refreshes every 30s
          </p>
        )}
      </div>
    </LayoutWrapper>
  )
}
