import { GitCommit, GitPullRequest, GitBranch, Save } from 'lucide-react'

export interface Activity {
  id: string
  type: 'commit' | 'pull_request' | 'branch' | 'push'
  title: string
  description: string
  repo: string
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
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type]
        const colorClass = activityColors[activity.type]

        return (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline */}
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
              <div className="bg-card border border-card-border rounded-lg p-4 hover:border-accent/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {activity.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {activity.repo} • {activity.author}
                    </p>
                  </div>
                  <span className="text-xs text-text-tertiary whitespace-nowrap ml-2">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
