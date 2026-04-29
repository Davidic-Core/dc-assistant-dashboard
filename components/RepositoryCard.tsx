import { Star, GitFork, ExternalLink } from 'lucide-react'

interface RepositoryCardProps {
  name: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  lastUpdated: string
}

export default function RepositoryCard({
  name,
  description,
  language,
  languageColor,
  stars,
  forks,
  lastUpdated,
}: RepositoryCardProps) {
  return (
    <a
      href={`https://github.com/Davidic-Core/${name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card border border-card-border rounded-xl p-6 hover:border-accent/50 hover:bg-card-border/50 transition-all duration-300"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
          {name}
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="text-text-secondary text-sm mt-2 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: languageColor }}
            title={language}
          />
          <span className="text-xs text-text-secondary">{language}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            <span>{forks}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-tertiary mt-4 pt-4 border-t border-card-border">
        Updated {lastUpdated}
      </p>
    </a>
  )
}
