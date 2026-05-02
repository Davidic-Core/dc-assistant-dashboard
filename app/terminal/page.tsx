'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import LayoutWrapper from '@/components/LayoutWrapper'
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react'

const XTerminal = dynamic(() => import('@/components/XTerminal'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-text-tertiary font-mono text-sm">
      <span className="animate-pulse">Loading terminal...</span>
    </div>
  ),
})

const quickCommands = [
  { title: 'Git Status', command: 'git status', description: 'Show working tree status' },
  { title: 'List Files', command: 'ls -la', description: 'List all files with details' },
  { title: 'Git Log', command: 'git log --oneline -15', description: 'Show recent commits' },
  { title: 'Node Version', command: 'node --version && npm --version', description: 'Check runtime versions' },
  { title: 'Check Branch', command: 'git branch -a', description: 'List all branches' },
  { title: 'NPM List', command: 'npm list --depth=0', description: 'List dependencies' },
]

export default function TerminalPage() {
  const [sessionKey, setSessionKey] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const newSession = useCallback(() => setSessionKey((k) => k + 1), [])

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Terminal</h1>
          <p className="text-text-secondary mt-2">
            Live bash shell — commands execute on the server in real time
          </p>
        </div>

        <div
          className={`border border-card-border rounded-lg overflow-hidden bg-[#0a0a0a] flex flex-col transition-all duration-200 ${
            fullscreen ? 'fixed inset-4 z-50' : ''
          }`}
        >
          {/* Terminal title bar */}
          <div className="bg-card-border px-4 py-3 flex items-center gap-2 border-b border-card-border flex-shrink-0">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-text-secondary ml-2 font-mono">bash — DC Assistant</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-text-tertiary font-mono">live</span>
              <button
                onClick={newSession}
                className="p-1 hover:bg-card-border/80 rounded transition-colors text-text-tertiary hover:text-foreground"
                title="Start new session"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFullscreen((f) => !f)}
                className="p-1 hover:bg-card-border/80 rounded transition-colors text-text-tertiary hover:text-foreground"
                title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {fullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* xterm.js mount point */}
          <div
            className="flex-1 p-2"
            style={{ height: fullscreen ? 'calc(100% - 44px)' : '420px' }}
          >
            <XTerminal key={sessionKey} />
          </div>
        </div>

        {!fullscreen && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Commands</h2>
              <p className="text-xs text-text-tertiary mb-3">
                Click the terminal above and type any command — or use these shortcuts:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickCommands.map((cmd, i) => (
                  <div
                    key={i}
                    className="text-left bg-card border border-card-border rounded-lg p-4"
                  >
                    <p className="font-semibold text-foreground text-sm">{cmd.title}</p>
                    <code className="block text-xs text-accent font-mono mt-2 bg-background px-2 py-1 rounded">
                      {cmd.command}
                    </code>
                    <p className="text-xs text-text-secondary mt-2">{cmd.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-card-border rounded-lg p-4">
              <p className="text-sm text-text-secondary">
                <strong className="text-foreground">Live Terminal:</strong> Commands run in a real{' '}
                <code className="text-accent font-mono text-xs bg-background px-1 py-0.5 rounded">
                  bash
                </code>{' '}
                session on the server. Output streams back via WebSocket in real time.{' '}
                Use the <RefreshCw className="w-3 h-3 inline mx-0.5" /> button to start a fresh shell session.
              </p>
            </div>
          </>
        )}
      </div>
    </LayoutWrapper>
  )
}
