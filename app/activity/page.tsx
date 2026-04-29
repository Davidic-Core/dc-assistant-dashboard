import LayoutWrapper from '@/components/LayoutWrapper'
import ActivityFeed from '@/components/ActivityFeed'
import { Calendar, TrendingUp } from 'lucide-react'

const allActivities = [
  {
    id: '1',
    type: 'commit' as const,
    title: 'feat: add AI-powered code review system',
    description: 'Implemented automated code review using machine learning models for pattern detection',
    repo: 'dc-assistant-dashboard',
    timestamp: '2 hours ago',
    author: 'Davidic-Core',
  },
  {
    id: '2',
    type: 'pull_request' as const,
    title: 'Merge: Optimize database query performance',
    description: 'PR #234: Reduced query time by 60% using index optimization',
    repo: 'distributed-cache-system',
    timestamp: '4 hours ago',
    author: 'Davidic-Core',
  },
  {
    id: '3',
    type: 'push' as const,
    title: 'Push to main branch',
    description: '5 commits pushed - Updates to neural network optimization',
    repo: 'neural-network-framework',
    timestamp: '1 day ago',
    author: 'Davidic-Core',
  },
  {
    id: '4',
    type: 'branch' as const,
    title: 'Created feature branch: quantum-optimization',
    description: 'New branch created for quantum algorithm improvements',
    repo: 'quantum-computing-lib',
    timestamp: '2 days ago',
    author: 'Davidic-Core',
  },
  {
    id: '5',
    type: 'commit' as const,
    title: 'fix: resolve memory leak in websocket handler',
    description: 'Fixed memory leak that was causing the application to consume excessive RAM over time',
    repo: 'dc-assistant-dashboard',
    timestamp: '3 days ago',
    author: 'Davidic-Core',
  },
  {
    id: '6',
    type: 'pull_request' as const,
    title: 'Merge: Add dark mode support',
    description: 'PR #198: Implemented comprehensive dark mode with system preference detection',
    repo: 'mobile-ui-kit',
    timestamp: '4 days ago',
    author: 'Davidic-Core',
  },
  {
    id: '7',
    type: 'commit' as const,
    title: 'test: add comprehensive unit tests',
    description: 'Added 500+ unit tests for core functionality with 95% code coverage',
    repo: 'distributed-cache-system',
    timestamp: '5 days ago',
    author: 'Davidic-Core',
  },
  {
    id: '8',
    type: 'push' as const,
    title: 'Push to development branch',
    description: '8 commits pushed - New features for v2.0 release',
    repo: 'blockchain-explorer',
    timestamp: '1 week ago',
    author: 'Davidic-Core',
  },
]

export default function ActivityPage() {
  return (
    <LayoutWrapper>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Live Activity</h1>
          <p className="text-text-secondary mt-2">
            Track all your recent commits, pulls, and repository changes
          </p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">This Week</span>
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">27</p>
            <p className="text-xs text-text-tertiary mt-2">commits and pushes</p>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">This Month</span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">142</p>
            <p className="text-xs text-text-tertiary mt-2">total contributions</p>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Repositories</span>
            </div>
            <p className="text-3xl font-bold text-foreground">24</p>
            <p className="text-xs text-text-tertiary mt-2">active projects</p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
          <ActivityFeed activities={allActivities} />
        </div>
      </div>
    </LayoutWrapper>
  )
}
