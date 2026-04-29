import { AlertCircle, CheckCircle, Info, Clock } from 'lucide-react'

export interface Notification {
  id: string
  type: 'alert' | 'success' | 'info' | 'pending'
  title: string
  message: string
  timestamp: string
}

interface NotificationsPanelProps {
  notifications: Notification[]
}

const notificationIcons = {
  alert: AlertCircle,
  success: CheckCircle,
  info: Info,
  pending: Clock,
}

const notificationColors = {
  alert: 'bg-red-500/20 text-red-400 border-red-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

export default function NotificationsPanel({
  notifications,
}: NotificationsPanelProps) {
  return (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block p-3 bg-card-border rounded-lg mb-3">
            <CheckCircle className="w-6 h-6 text-accent" />
          </div>
          <p className="text-text-secondary text-sm">All caught up!</p>
        </div>
      ) : (
        notifications.map((notif) => {
          const Icon = notificationIcons[notif.type]
          const colorClass = notificationColors[notif.type]

          return (
            <div
              key={notif.id}
              className="bg-card border border-card-border rounded-lg p-4 hover:border-accent/30 transition-colors"
            >
              <div className="flex gap-3 items-start">
                <div className={`p-2 rounded-lg border flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {notif.title}
                  </p>
                  <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-xs text-text-tertiary mt-2">
                    {notif.timestamp}
                  </p>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
