import { Star, GitFork, ExternalLink, Lock, AlertCircle } from 'lucide-react'

interface RepositoryCardProps {
  name: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  lastUpdated: string
  htmlUrl?: string
  isPrivate?: boolean
  openIssues?: number
}

export default function RepositoryCard({
  name,
  description,
  language,
  languageColor,
  stars,
  forks,
  lastUpdated,
  htmlUrl,
  isPrivate = false,
  openIssues = 0,
}: RepositoryCardProps) {
  const url = htmlUrl || `https://github.com/Davidic-Core/${name}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card border border-card-border rounded-xl p-6 hover:border-accent/50 hover:bg-card-border/50 transition-all duration-300 flex flex-col"
    >
      <div className="mb-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors flex items-center gap-1.5 min-w-0">
            {isPrivate && <Lock className="w-3.5 h-3.5 flex-shrink-0 text-text-tertiary" />}
            <span className="truncate">{name}</span>
          </h3>
          <ExternalLink className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        <p className="text-text-secondary text-sm line-clamp-2">
          {description || 'No description provided.'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {language ? (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: languageColor }}
              />
              <span className="text-xs text-text-secondary">{language}</span>
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span>{stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>{forks}</span>
            </div>
            {openIssues > 0 && (
              <div className="flex items-center gap-1 text-yellow-500">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{openIssues}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-text-tertiary pt-3 border-t border-card-border">
          Updated {lastUpdated}
        </p>
      </div>
    </a>
  )
}
