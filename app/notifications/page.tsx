import LayoutWrapper from '@/components/LayoutWrapper'
import NotificationsPanel from '@/components/NotificationsPanel'
import { Inbox, Archive, Trash2 } from 'lucide-react'

const allNotifications = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Build Successful',
    message: 'dc-assistant-dashboard production build completed successfully with all tests passing',
    timestamp: '10 minutes ago',
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'Security Alert',
    message: 'New dependency update available: lodash v4.17.21 - Security patch included',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    type: 'alert' as const,
    title: 'Failed Test',
    message: 'Unit tests in neural-network-framework failed: 3 failures in optimization module',
    timestamp: '3 hours ago',
  },
  {
    id: '4',
    type: 'success' as const,
    title: 'Deployment Complete',
    message: 'New version of distributed-cache-system deployed to production',
    timestamp: '5 hours ago',
  },
  {
    id: '5',
    type: 'pending' as const,
    title: 'Code Review Waiting',
    message: 'Your PR #512 in blockchain-explorer is waiting for review (3 days)',
    timestamp: '1 day ago',
  },
  {
    id: '6',
    type: 'info' as const,
    title: 'Dependency Updated',
    message: 'React updated from v18.2.0 to v19.0.0 - Migration guide available',
    timestamp: '2 days ago',
  },
  {
    id: '7',
    type: 'success' as const,
    title: 'Milestone Reached',
    message: 'mobile-ui-kit reached 1,200 stars! Thank you for the support',
    timestamp: '3 days ago',
  },
  {
    id: '8',
    type: 'alert' as const,
    title: 'License Violation',
    message: 'License check failed for dependency in game-engine: MIT license required',
    timestamp: '1 week ago',
  },
]

export default function NotificationsPage() {
  return (
    <LayoutWrapper>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Notifications</h1>
            <p className="text-text-secondary mt-2">
              Stay updated with all your repository and account notifications
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-card-border rounded-lg transition-colors" title="Archive">
              <Archive className="w-5 h-5 text-text-secondary" />
            </button>
            <button className="p-2 hover:bg-card-border rounded-lg transition-colors" title="Delete">
              <Trash2 className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Notification Tabs */}
        <div className="flex gap-2 border-b border-card-border">
          <button className="px-4 py-3 font-medium text-accent border-b-2 border-accent transition-colors">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              All ({allNotifications.length})
            </div>
          </button>
          <button className="px-4 py-3 text-text-secondary hover:text-foreground transition-colors">
            Unread (3)
          </button>
          <button className="px-4 py-3 text-text-secondary hover:text-foreground transition-colors">
            Mentions
          </button>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-card-border rounded-lg p-4">
            <p className="text-text-secondary text-xs mb-1">Total</p>
            <p className="text-2xl font-bold text-foreground">
              {allNotifications.length}
            </p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <p className="text-text-secondary text-xs mb-1">Unread</p>
            <p className="text-2xl font-bold text-yellow-400">3</p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <p className="text-text-secondary text-xs mb-1">Success</p>
            <p className="text-2xl font-bold text-green-400">3</p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <p className="text-text-secondary text-xs mb-1">Alerts</p>
            <p className="text-2xl font-bold text-red-400">2</p>
          </div>
        </div>

        {/* Notifications List */}
        <NotificationsPanel notifications={allNotifications} />
      </div>
    </LayoutWrapper>
  )
}
