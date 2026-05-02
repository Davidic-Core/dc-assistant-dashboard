'use client'

import { useEffect, useState, useCallback } from 'react'
import LayoutWrapper from '@/components/LayoutWrapper'
import StatsCard from '@/components/StatsCard'
import RepositoryCard from '@/components/RepositoryCard'
import ActivityFeed from '@/components/ActivityFeed'
import AIChat from '@/components/AIChat'
import EnvironmentPanel from '@/components/EnvironmentPanel'
import TerminalPreview from '@/components/TerminalPreview'
import { GitBranch, Star, Users, GitCommit, RefreshCw, Loader2 } from 'lucide-react'
import { formatRelativeTime, formatNumber } from '@/lib/github-utils'

interface Repo {
  id: number
  name: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  htmlUrl: string
  lastUpdated: string
  isPrivate: boolean
  openIssues: number
}

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

interface UserStats {
  publicRepos: number
  followers: number
  totalStars: number
}

const VALID_TYPES = ['commit', 'pull_request', 'branch', 'push'] as const
type FeedType = typeof VALID_TYPES[number]

const REPO_POLL_MS = 60_000
const EVENT_POLL_MS = 30_000
const USER_POLL_MS = 120_000

export default function Dashboard() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [activities, setActivities] = useState<RawActivity[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [repoLoading, setRepoLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchRepos = useCallback(async (silent = false) => {
    if (!silent) setRepoLoading(true)
    try {
      const res = await fetch('/api/github/repos')
      if (!res.ok) throw new Error(`Repos API error ${res.status}`)
      const data = await res.json()
      setRepos(data.repos || [])
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setRepoLoading(false)
    }
  }, [])

  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setActivityLoading(true)
    try {
      const res = await fetch('/api/github/events')
      if (!res.ok) throw new Error(`Events API error ${res.status}`)
      const data = await res.json()
      setActivities(data.activities || [])
      setLastUpdated(new Date())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setActivityLoading(false)
    }
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/github/user')
      if (!res.ok) return
      setUserStats(await res.json())
    } catch {}
  }, [])

  useEffect(() => {
    fetchRepos()
    fetchEvents()
    fetchUser()

    const t1 = setInterval(() => fetchRepos(true), REPO_POLL_MS)
    const t2 = setInterval(() => fetchEvents(true), EVENT_POLL_MS)
    const t3 = setInterval(() => fetchUser(), USER_POLL_MS)

    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3) }
  }, [fetchRepos, fetchEvents, fetchUser])

  const feedActivities = activities.slice(0, 6).map((a) => ({
    ...a,
    type: (VALID_TYPES.includes(a.type as FeedType) ? a.type : 'commit') as FeedType,
    timestamp: formatRelativeTime(a.timestamp),
  }))

  const totalStars = userStats?.totalStars ?? repos.reduce((s, r) => s + r.stars, 0)
  const totalOpenIssues = repos.reduce((s, r) => s + r.openIssues, 0)

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Welcome back, <span className="text-accent">Davidic-Core</span>
            </h1>
            <p className="text-text-secondary mt-2">
              Live dashboard syncing with{' '}
              <a
                href="https://github.com/Davidic-Core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover transition-colors"
              >
                github.com/Davidic-Core
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-text-tertiary hidden sm:block">
                Updated {formatRelativeTime(lastUpdated.toISOString())}
              </span>
            )}
            <button
              onClick={() => { fetchRepos(); fetchEvents(); fetchUser() }}
              className="flex items-center gap-2 px-3 py-2 bg-card border border-card-border rounded-lg hover:border-accent/50 transition-colors text-sm text-text-secondary hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error} — Verify your GitHub token has the correct permissions.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Repositories"
            value={repoLoading ? '—' : String(userStats?.publicRepos ?? repos.length)}
            icon={<GitBranch className="w-6 h-6 text-accent" />}
            color="accent"
          />
          <StatsCard
            label="Total Stars"
            value={repoLoading ? '—' : formatNumber(totalStars)}
            icon={<Star className="w-6 h-6 text-blue-400" />}
            color="blue"
          />
          <StatsCard
            label="Followers"
            value={userStats ? formatNumber(userStats.followers) : '—'}
            icon={<Users className="w-6 h-6 text-purple-400" />}
            color="purple"
          />
          <StatsCard
            label="Open Issues"
            value={repoLoading ? '—' : String(totalOpenIssues)}
            icon={<GitCommit className="w-6 h-6 text-orange-400" />}
            color="orange"
          />
        </div>

        {/* Repos + AI Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                Repositories
                {repoLoading && <Loader2 className="w-4 h-4 animate-spin text-text-tertiary" />}
              </h2>
              <a href="/repositories" className="text-accent hover:text-accent-hover text-sm font-medium transition-colors">
                View All ({repos.length}) →
              </a>
            </div>

            {repoLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card border border-card-border rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-card-border rounded w-3/4 mb-3" />
                    <div className="h-3 bg-card-border rounded w-full mb-2" />
                    <div className="h-3 bg-card-border rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.slice(0, 4).map((repo) => (
                  <RepositoryCard
                    key={repo.id}
                    name={repo.name}
                    description={repo.description}
                    language={repo.language}
                    languageColor={repo.languageColor}
                    stars={repo.stars}
                    forks={repo.forks}
                    lastUpdated={formatRelativeTime(repo.lastUpdated)}
                    htmlUrl={repo.htmlUrl}
                    isPrivate={repo.isPrivate}
                    openIssues={repo.openIssues}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <AIChat />
          </div>
        </div>

        {/* Activity + Environment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                Live Activity
                {activityLoading && <Loader2 className="w-4 h-4 animate-spin text-text-tertiary" />}
              </h2>
              <a href="/activity" className="text-accent hover:text-accent-hover text-sm font-medium transition-colors">
                View All →
              </a>
            </div>

            {activityLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-card border border-card-border rounded-lg animate-pulse flex-shrink-0" />
                    <div className="flex-1 bg-card border border-card-border rounded-lg p-4 animate-pulse">
                      <div className="h-3 bg-card-border rounded w-2/3 mb-2" />
                      <div className="h-3 bg-card-border rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ActivityFeed activities={feedActivities} />
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Environment</h2>
            <EnvironmentPanel />
          </div>
        </div>

        {/* Terminal */}
        <div className="h-96">
          <h2 className="text-2xl font-bold text-foreground mb-4">Terminal Preview</h2>
          <TerminalPreview />
        </div>
      </div>
    </LayoutWrapper>
  )
}
