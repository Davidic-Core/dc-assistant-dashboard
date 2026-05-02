'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import LayoutWrapper from '@/components/LayoutWrapper'
import RepositoryCard from '@/components/RepositoryCard'
import { Search, Filter, Star, RefreshCw, Loader2, Lock, Archive } from 'lucide-react'
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
  archived: boolean
  openIssues: number
  fork: boolean
  topics: string[]
}

type SortKey = 'updated' | 'stars' | 'name' | 'forks'
type FilterKey = 'all' | 'public' | 'private' | 'archived' | 'forked'

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('updated')
  const [filterBy, setFilterBy] = useState<FilterKey>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchRepos = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch('/api/github/repos')
      if (!res.ok) throw new Error(`GitHub API error ${res.status}`)
      const data = await res.json()
      setRepos(data.repos || [])
      setLastUpdated(new Date())
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRepos()
    const timer = setInterval(() => fetchRepos(true), 60_000)
    return () => clearInterval(timer)
  }, [fetchRepos])

  const filtered = useMemo(() => {
    let list = repos.filter((r) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.language?.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))

      const matchFilter =
        filterBy === 'all' ||
        (filterBy === 'public' && !r.isPrivate) ||
        (filterBy === 'private' && r.isPrivate) ||
        (filterBy === 'archived' && r.archived) ||
        (filterBy === 'forked' && r.fork)

      return matchSearch && matchFilter
    })

    list = [...list].sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      if (sortBy === 'stars') return b.stars - a.stars
      if (sortBy === 'forks') return b.forks - a.forks
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

    return list
  }, [repos, search, sortBy, filterBy])

  const totalStars = repos.reduce((s, r) => s + r.stars, 0)
  const languages = new Set(repos.map((r) => r.language).filter(Boolean))
  const topRepo = [...repos].sort((a, b) => b.stars - a.stars)[0]

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Repositories</h1>
            <p className="text-text-secondary mt-2">
              {loading ? 'Loading from GitHub…' : `${repos.length} repositories from Davidic-Core`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-text-tertiary hidden sm:block">
                Synced {formatRelativeTime(lastUpdated.toISOString())}
              </span>
            )}
            <button
              onClick={() => fetchRepos()}
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

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, language, topic…"
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-card-border rounded-lg text-foreground text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-card-border rounded-lg hover:border-accent/50 transition-colors text-foreground w-full sm:w-auto justify-center"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                {filterBy === 'all' ? 'All' : filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
              </span>
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-1 w-36 bg-card border border-card-border rounded-lg shadow-xl z-10 py-1">
                {(['all', 'public', 'private', 'archived', 'forked'] as FilterKey[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilterBy(f); setShowFilters(false) }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-card-border ${filterBy === f ? 'text-accent' : 'text-foreground'}`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-4 py-2.5 bg-card border border-card-border rounded-lg text-foreground text-sm focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-card-border rounded-lg p-4">
              <p className="text-text-secondary text-sm">Total</p>
              <p className="text-2xl font-bold text-foreground mt-1">{repos.length}</p>
            </div>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <p className="text-text-secondary text-sm">Languages</p>
              <p className="text-2xl font-bold text-foreground mt-1">{languages.size}</p>
            </div>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <p className="text-text-secondary text-sm">Total Stars</p>
              <p className="text-2xl font-bold text-accent mt-1">{formatNumber(totalStars)}</p>
            </div>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <p className="text-text-secondary text-sm">Most Popular</p>
              <p className="text-lg font-bold text-foreground mt-1 flex items-center gap-1 truncate">
                <Star className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="truncate">{topRepo?.name ?? '—'}</span>
              </p>
            </div>
          </div>
        )}

        {/* Results count */}
        {!loading && search && (
          <p className="text-sm text-text-secondary">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{search}&quot;
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 bg-card-border rounded w-3/4" />
                  <div className="h-4 w-4 bg-card-border rounded ml-auto" />
                </div>
                <div className="h-3 bg-card-border rounded w-full mb-2" />
                <div className="h-3 bg-card-border rounded w-2/3 mb-6" />
                <div className="flex justify-between">
                  <div className="h-3 bg-card-border rounded w-16" />
                  <div className="h-3 bg-card-border rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-text-tertiary mb-4" />
            <p className="text-foreground font-medium">No repositories found</p>
            <p className="text-text-secondary text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((repo) => (
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

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-text-tertiary text-center pb-4">
            Showing {filtered.length} of {repos.length} repositories • Auto-refreshes every 60s
          </p>
        )}
      </div>
    </LayoutWrapper>
  )
}
