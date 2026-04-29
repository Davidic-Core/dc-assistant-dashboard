import { Maximize2 } from 'lucide-react'

const terminalLines = [
  '$ git log --oneline -10',
  '3a7f1c2 feat: add AI-powered code review system',
  '2e8b9f5 docs: update README with new features',
  '5c2d4a1 refactor: optimize database queries',
  '8b1e6d3 fix: resolve memory leak in websocket handler',
  '4c7a9b2 feat: implement dark mode support',
  '9d3e1f6 test: add comprehensive unit tests',
  '6f8c2a5 perf: improve bundle size by 40%',
  '1b4e7c3 docs: add API documentation',
  '7a2f5d8 chore: update dependencies',
  '$ npm run build',
  '> next build',
  '▲ Next.js 16.0.0',
  '- Turbopack enabled',
  '- Using ESM modules',
  '✓ Compiled client and server successfully',
  '✓ Routes optimized',
]

export default function TerminalPreview() {
  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden flex flex-col h-full hover:border-accent/50 transition-colors">
      {/* Terminal Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-background to-card-border border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-text-secondary ml-2 font-mono">
            terminal
          </span>
        </div>
        <button className="p-1.5 hover:bg-card-border rounded transition-colors">
          <Maximize2 className="w-4 h-4 text-text-tertiary" />
        </button>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-black/20">
        <div className="space-y-1">
          {terminalLines.map((line, index) => (
            <div key={index} className="text-foreground">
              {line.startsWith('$') || line.startsWith('>') ? (
                <span>
                  <span className="text-accent">{line.slice(0, 1)}</span>
                  <span className="ml-1 text-accent-hover font-semibold">
                    {line.slice(2)}
                  </span>
                </span>
              ) : line.startsWith('✓') || line.startsWith('▲') ? (
                <span className="text-accent">{line}</span>
              ) : line.startsWith('-') ? (
                <span className="text-text-secondary">{line}</span>
              ) : (
                <span className="text-text-secondary">{line}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cursor */}
      <div className="px-4 py-2 border-t border-card-border font-mono text-sm">
        <span className="text-accent">$</span>
        <span className="ml-1 inline-block w-2 h-5 bg-accent animate-pulse" />
      </div>
    </div>
  )
}
