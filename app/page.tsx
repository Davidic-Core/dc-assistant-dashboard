import LayoutWrapper from '@/components/LayoutWrapper'
import StatsCard from '@/components/StatsCard'
import RepositoryCard from '@/components/RepositoryCard'
import ActivityFeed from '@/components/ActivityFeed'
import AIChat from '@/components/AIChat'
import NotificationsPanel from '@/components/NotificationsPanel'
import TerminalPreview from '@/components/TerminalPreview'
import { GitBranch, Star, Users, GitCommit } from 'lucide-react'

const mockRepositories = [
  {
    name: 'dc-assistant-dashboard',
    description: 'Premium GitHub Personal Assistant Dashboard with AI integration and real-time activity monitoring',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 342,
    forks: 89,
    lastUpdated: '2 hours ago',
  },
  {
    name: 'ai-code-analyzer',
    description: 'Advanced AI-powered code analysis tool for detecting patterns, vulnerabilities, and optimization opportunities',
    language: 'Python',
    languageColor: '#3776ab',
    stars: 521,
    forks: 134,
    lastUpdated: '1 day ago',
  },
  {
    name: 'quantum-computing-lib',
    description: 'High-performance quantum computing simulation library with GPU acceleration',
    language: 'Rust',
    languageColor: '#ce422b',
    stars: 289,
    forks: 62,
    lastUpdated: '3 days ago',
  },
  {
    name: 'neural-network-framework',
    description: 'Lightweight neural network framework designed for mobile and edge computing',
    language: 'C++',
    languageColor: '#00599c',
    stars: 456,
    forks: 112,
    lastUpdated: '5 days ago',
  },
  {
    name: 'distributed-cache-system',
    description: 'Distributed caching system with Redis compatibility and advanced partitioning strategies',
    language: 'Go',
    languageColor: '#00add8',
    stars: 678,
    forks: 156,
    lastUpdated: '1 week ago',
  },
  {
    name: 'blockchain-explorer',
    description: 'Full-featured blockchain explorer with transaction analysis and smart contract debugging',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 234,
    forks: 45,
    lastUpdated: '1 week ago',
  },
]

const mockActivities = [
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
]

const mockNotifications = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Build Successful',
    message: 'dc-assistant-dashboard production build completed successfully',
    timestamp: '10 minutes ago',
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

export default function Dashboard() {
  return (
    <LayoutWrapper>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, <span className="text-accent">Davidic-Core</span>
          </h1>
          <p className="text-text-secondary mt-2">
            Here&apos;s your GitHub activity dashboard and AI assistant
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Repositories"
            value="24"
            icon={<GitBranch className="w-6 h-6 text-accent" />}
            trend={12}
            color="accent"
          />
          <StatsCard
            label="Total Stars"
            value="4.2K"
            icon={<Star className="w-6 h-6 text-blue-400" />}
            trend={24}
            color="blue"
          />
          <StatsCard
            label="Followers"
            value="1.8K"
            icon={<Users className="w-6 h-6 text-purple-400" />}
            trend={8}
            color="purple"
          />
          <StatsCard
            label="Recent Commits"
            value="142"
            icon={<GitCommit className="w-6 h-6 text-orange-400" />}
            trend={-3}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repositories Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Repositories</h2>
              <a
                href="/repositories"
                className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
              >
                View All →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRepositories.slice(0, 4).map((repo) => (
                <RepositoryCard key={repo.name} {...repo} />
              ))}
            </div>
          </div>

          {/* AI Chat */}
          <div>
            <AIChat />
          </div>
        </div>

        {/* Activity and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-4">Live Activity</h2>
            <ActivityFeed activities={mockActivities} />
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Notifications</h2>
            <NotificationsPanel notifications={mockNotifications} />
          </div>
        </div>

        {/* Terminal Preview */}
        <div className="h-96">
          <h2 className="text-2xl font-bold text-foreground mb-4">Terminal Preview</h2>
          <TerminalPreview />
        </div>
      </div>
    </LayoutWrapper>
  )
}
