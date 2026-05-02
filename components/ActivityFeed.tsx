import { GitCommit, GitPullRequest, GitBranch, Save, ExternalLink } from 'lucide-react'

export interface Activity {
  id: string
  type: 'commit' | 'pull_request' | 'branch' | 'push'
  title: string
  description: string
  repo: string
  repoUrl?: string
  timestamp: string
  author: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

const activityIcons = {
  commit: GitCommit,
  pull_request: GitPullRequest,
  branch: GitBranch,
  push: Save,
}

const activityColors = {
  commit: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pull_request: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  branch: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  push: 'bg-green-500/20 text-green-400 border-green-500/30',
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-10 text-text-tertiary text-sm">
        No recent activity found.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type]
        const colorClass = activityColors[activity.type]
        const repoUrl = activity.repoUrl || `https://github.com/Davidic-Core/${activity.repo}`

        return (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div className={`p-2.5 rounded-lg border ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              {index !== activities.length - 1 && (
                <div className="w-0.5 h-12 bg-card-border mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="bg-card border border-card-border rounded-lg p-4 hover:border-accent/30 transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm line-clamp-1">
                      {activity.title}
                    </p>
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1 mt-0.5"
                    >
                      {activity.repo}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  <span className="text-xs text-text-tertiary whitespace-nowrap ml-3 flex-shrink-0">
                    {activity.timestamp}
                  </span>
                </div>
                {activity.description && (
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {activity.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
