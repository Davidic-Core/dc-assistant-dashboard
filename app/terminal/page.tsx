'use client'

import { useState } from 'react'
import LayoutWrapper from '@/components/LayoutWrapper'
import { Send, Trash2, Copy, AlertCircle } from 'lucide-react'

interface TerminalCommand {
  id: string
  command: string
  output: string
  timestamp: string
}

export default function TerminalPage() {
  const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([
    {
      id: '1',
      command: 'npm run build',
      output: '> DC Assistant@1.0.0 build\n> next build\n✓ Compiled successfully!\nFinished in 45.2s',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
    },
    {
      id: '2',
      command: 'git status',
      output: 'On branch main\nYour branch is up to date with origin/main.\nnothing to commit, working tree clean',
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
    },
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const executeCommand = () => {
    if (!terminalInput.trim()) return

    const newCommand: TerminalCommand = {
      id: Date.now().toString(),
      command: terminalInput,
      output: `$ ${terminalInput}\nCommand executed successfully at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toLocaleTimeString(),
    }

    setTerminalHistory([...terminalHistory, newCommand])
    setTerminalInput('')
  }

  const clearTerminal = () => {
    setTerminalHistory([])
  }

  const copyCommand = (command: string, id: string) => {
    navigator.clipboard.writeText(command)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Terminal</h1>
          <p className="text-text-secondary mt-2">
            Execute commands and view terminal output
          </p>
        </div>

        {/* Terminal Window */}
        <div className="border border-card-border rounded-lg overflow-hidden bg-background">
          {/* Terminal Header */}
          <div className="bg-card-border px-4 py-3 flex items-center gap-2 border-b border-card-border">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-text-secondary ml-2">DC Assistant Terminal</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-text-tertiary">bash</span>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-4 space-y-4 font-mono text-sm h-96 overflow-y-auto bg-background">
            {terminalHistory.length === 0 ? (
              <div className="text-text-tertiary text-xs opacity-60">
                <p>Welcome to DC Assistant Terminal</p>
                <p className="mt-2">Type a command below and press Enter to execute</p>
              </div>
            ) : (
              terminalHistory.map((cmd) => (
                <div key={cmd.id} className="space-y-2 group">
                  <div className="flex items-center gap-2">
                    <div className="text-accent">
                      <span>{'$ '}</span>
                      <span className="text-foreground">{cmd.command}</span>
                    </div>
                    <button
                      onClick={() => copyCommand(cmd.command, cmd.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-card-border rounded text-text-tertiary hover:text-accent"
                      title="Copy command"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {copiedId === cmd.id && (
                      <span className="text-xs text-accent">Copied</span>
                    )}
                  </div>
                  <div className="text-text-secondary text-xs whitespace-pre-wrap pl-4 border-l border-card-border/50">
                    {cmd.output}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Terminal Input */}
          <div className="border-t border-card-border px-4 py-3 bg-card-border/20 flex gap-2">
            <span className="text-accent font-mono text-sm">{'$ '}</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
              placeholder="Enter command..."
              className="flex-1 bg-transparent text-foreground focus:outline-none font-mono text-sm placeholder:text-text-tertiary"
              autoFocus
            />
            <button
              onClick={executeCommand}
              className="p-1.5 text-accent hover:text-accent-hover transition-colors hover:bg-card-border/50 rounded"
              title="Execute command"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Controls */}
        <div className="flex gap-2">
          <button
            onClick={clearTerminal}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-card-border hover:border-accent/50 hover:bg-card-border/50 text-foreground rounded-lg text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Terminal
          </button>
        </div>

        {/* Quick Commands */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                title: 'Build Project',
                command: 'npm run build',
                description: 'Compile your project for production',
              },
              {
                title: 'Start Dev Server',
                command: 'npm run dev',
                description: 'Start with hot reload',
              },
              {
                title: 'Run Tests',
                command: 'npm test',
                description: 'Execute all tests',
              },
              {
                title: 'View Git Log',
                command: 'git log --oneline -20',
                description: 'Show recent commits',
              },
              {
                title: 'Check Dependencies',
                command: 'npm list --depth=0',
                description: 'List all dependencies',
              },
              {
                title: 'Git Status',
                command: 'git status',
                description: 'Check repository status',
              },
            ].map((cmd, index) => (
              <button
                key={index}
                onClick={() => {
                  setTerminalInput(cmd.command)
                  setTimeout(() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement
                    input?.focus()
                  }, 0)
                }}
                className="text-left bg-card border border-card-border rounded-lg p-4 hover:border-accent/50 hover:bg-card-border/50 transition-colors group"
              >
                <p className="font-semibold text-foreground text-sm">{cmd.title}</p>
                <code className="block text-xs text-accent font-mono mt-2 bg-background px-2 py-1 rounded">
                  {cmd.command}
                </code>
                <p className="text-xs text-text-secondary mt-2">{cmd.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Info */}
        <div className="bg-card border border-card-border rounded-lg p-4">
          <p className="text-sm text-text-secondary">
            <strong>Note:</strong> This terminal interface simulates command execution. Quick command buttons populate the input field for easy access to common development commands.
          </p>
        </div>
      </div>
    </LayoutWrapper>
  )
}
