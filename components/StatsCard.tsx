import { ReactNode } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: number
  color?: 'accent' | 'blue' | 'purple' | 'orange'
}

const colorClasses = {
  accent: 'from-accent/20 to-accent/10',
  blue: 'from-blue-500/20 to-blue-500/10',
  purple: 'from-purple-500/20 to-purple-500/10',
  orange: 'from-orange-500/20 to-orange-500/10',
}

export default function StatsCard({
  label,
  value,
  icon,
  trend,
  color = 'accent',
}: StatsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border border-card-border rounded-xl p-6 backdrop-blur-sm hover:border-accent/50 transition-colors`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-card rounded-lg">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-text-secondary text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  )
}
