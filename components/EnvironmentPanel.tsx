import { Eye, EyeOff, Shield, Globe } from 'lucide-react'

interface EnvVar {
  key: string
  value: string
  isSecret: boolean
}

const envVars: EnvVar[] = [
  { key: 'NODE_ENV', value: 'development', isSecret: false },
  { key: 'API_BASE_URL', value: 'https://api.example.com', isSecret: false },
  { key: 'API_KEY', value: 'sk_live_123456789abcdef', isSecret: true },
  { key: 'GITHUB_TOKEN', value: 'ghp_xxxxxxxxxxxxxxxxxxxx', isSecret: true },
  { key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/db', isSecret: true },
]

function EnvRow({ envVar }: { envVar: EnvVar }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-card-border last:border-0">
      <div className="flex-shrink-0">
        {envVar.isSecret ? (
          <Shield className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Globe className="w-3.5 h-3.5 text-blue-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono font-semibold text-foreground truncate">
          {envVar.key}
        </p>
        <p className="text-xs font-mono text-text-tertiary truncate">
          {envVar.isSecret ? '••••••••••••••••' : envVar.value}
        </p>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
          envVar.isSecret
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}
      >
        {envVar.isSecret ? 'secret' : 'public'}
      </span>
    </div>
  )
}

export default function EnvironmentPanel() {
  return (
    <div className="bg-card border border-card-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-xs text-text-secondary font-medium">
            {envVars.length} variables loaded
          </p>
        </div>
        <a
          href="/environment"
          className="text-xs text-accent hover:text-accent-hover transition-colors font-medium"
        >
          Manage →
        </a>
      </div>
      <div>
        {envVars.map((env) => (
          <EnvRow key={env.key} envVar={env} />
        ))}
      </div>
    </div>
  )
}
