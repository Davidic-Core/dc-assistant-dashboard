import LayoutWrapper from '@/components/LayoutWrapper'
import TerminalPreview from '@/components/TerminalPreview'
import { Copy, Download, Settings } from 'lucide-react'

export default function TerminalPage() {
  return (
    <LayoutWrapper>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Terminal</h1>
            <p className="text-text-secondary mt-2">
              View and manage your terminal output and commands
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-card-border rounded-lg hover:border-accent/50 hover:bg-card-border/50 transition-colors text-foreground">
              <Copy className="w-4 h-4" />
              <span className="text-sm font-medium">Copy</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-card-border rounded-lg hover:border-accent/50 hover:bg-card-border/50 transition-colors text-foreground">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-card-border rounded-lg hover:border-accent/50 hover:bg-card-border/50 transition-colors text-foreground">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Terminal */}
        <div className="h-[600px]">
          <TerminalPreview />
        </div>

        {/* Quick Commands */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Build Project',
                command: 'npm run build',
                description: 'Compile your project for production',
              },
              {
                title: 'Start Dev Server',
                command: 'npm run dev',
                description: 'Start the development server with hot reload',
              },
              {
                title: 'Run Tests',
                command: 'npm test',
                description: 'Execute all unit and integration tests',
              },
              {
                title: 'Deploy to Production',
                command: 'npm run deploy',
                description: 'Deploy your application to production servers',
              },
              {
                title: 'View Git Log',
                command: 'git log --oneline -20',
                description: 'Show recent commits and their messages',
              },
              {
                title: 'Check Dependencies',
                command: 'npm list --depth=0',
                description: 'List all installed project dependencies',
              },
            ].map((cmd, index) => (
              <button
                key={index}
                className="text-left bg-card border border-card-border rounded-lg p-4 hover:border-accent/50 hover:bg-card-border/50 transition-colors group"
              >
                <p className="font-semibold text-foreground text-sm">
                  {cmd.title}
                </p>
                <code className="block text-xs text-accent font-mono mt-2 bg-background px-2 py-1 rounded group-hover:bg-background/80 transition-colors">
                  {cmd.command}
                </code>
                <p className="text-xs text-text-secondary mt-2">
                  {cmd.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Info */}
        <div className="bg-card border border-card-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">Terminal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-text-secondary mb-1">Shell</p>
              <p className="text-foreground font-mono">bash (5.2.15)</p>
            </div>
            <div>
              <p className="text-text-secondary mb-1">Node Version</p>
              <p className="text-foreground font-mono">v20.11.0</p>
            </div>
            <div>
              <p className="text-text-secondary mb-1">Package Manager</p>
              <p className="text-foreground font-mono">npm (10.4.0)</p>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
