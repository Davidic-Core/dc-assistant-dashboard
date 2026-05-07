'use client'

import { useCallback, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import LayoutWrapper from '@/components/LayoutWrapper'
import SessionLogPanel, { type SessionEntry } from '@/components/SessionLogPanel'
import { Maximize2, Minimize2, RefreshCw, Smartphone } from 'lucide-react'
import type { ConnectionStatus } from '@/components/XTerminal'

const BRIDGE_URL = 'https://respiratory-noted-per-theatre.trycloudflare.com'

const XTerminal = dynamic(() => import('@/components/XTerminal'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-text-tertiary font-mono text-sm">
      <span className="animate-pulse">Initialising terminal...</span>
    </div>
  ),
})

export default function TerminalPage() {
  const [sessionKey, setSessionKey] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')

  const [sessions, setSessions] = useState<SessionEntry[]>([])
  const [activeSessionStart, setActiveSessionStart] = useState<Date | null>(null)
  const [activeLastCommand, setActiveLastCommand] = useState('')
  const sessionIdRef = useRef(0)
  const activeLastCommandRef = useRef('')

  const handleSessionStart = useCallback((time: Date) => {
    setActiveSessionStart(time)
    setActiveLastCommand('')
    activeLastCommandRef.current = ''
  }, [])

  const handleSessionEnd = useCallback(() => {
    setActiveSessionStart((prev) => {
      if (!prev) return null
      const entry: SessionEntry = {
        id: ++sessionIdRef.current,
        startTime: prev,
        endTime: new Date(),
        lastCommand: activeLastCommandRef.current,
        status: 'ended',
      }
      setSessions((s) => [...s, entry])
      return null
    })
    setActiveLastCommand('')
    activeLastCommandRef.current = ''
  }, [])

  const handleLastCommand = useCallback((cmd: string) => {
    activeLastCommandRef.current = cmd
    setActiveLastCommand(cmd)
  }, [])

  const newSession = useCallback(() => {
    setSessionKey((k) => k + 1)
    setConnectionStatus('connecting')
    setActiveSessionStart(null)
    setActiveLastCommand('')
    activeLastCommandRef.current = ''
  }, [])

  const statusColor =
    connectionStatus === 'connected' ? 'text-emerald-400' :
    connectionStatus === 'connecting' ? 'text-yellow-400' : 'text-red-400'

  const statusDotClass =
    connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse' :
    connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'

  const statusLabel =
    connectionStatus === 'connected' ? 'Online (Termux)' :
    connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Terminal</h1>
          <p className="text-text-secondary mt-2">
            Live Termux session streamed from your phone via Cloudflare tunnel
          </p>
        </div>

        {/* Bridge info bar */}
        <div className="flex items-center gap-3 bg-card border border-card-border rounded-lg px-4 py-3">
          <Smartphone className="w-4 h-4 text-text-secondary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary font-mono truncate">
              Bridge: <span className="text-accent">{BRIDGE_URL}</span>
            </p>
          </div>
          <div className={`flex items-center gap-2 ${statusColor}`}>
            <div className={`w-2 h-2 rounded-full ${statusDotClass}`} />
            <span className="text-xs font-mono font-semibold">{statusLabel}</span>
          </div>
        </div>

        {/* Terminal window */}
        <div
          className={`border border-card-border rounded-lg overflow-hidden bg-[#0a0a0a] flex flex-col transition-all duration-200 ${
            fullscreen ? 'fixed inset-4 z-50' : ''
          }`}
        >
          {/* Title bar */}
          <div className="bg-card-border px-4 py-3 flex items-center gap-2 border-b border-card-border flex-shrink-0">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-text-secondary ml-2 font-mono">termux — Davidic-Core</span>
            <div className="ml-auto flex items-center gap-3">
              <div className={`flex items-center gap-1.5 ${statusColor}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
                <span className="text-xs font-mono">{statusLabel}</span>
              </div>
              <button
                onClick={newSession}
                className="p-1 hover:bg-card-border/80 rounded transition-colors text-text-tertiary hover:text-foreground"
                title="Reconnect"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFullscreen((f) => !f)}
                className="p-1 hover:bg-card-border/80 rounded transition-colors text-text-tertiary hover:text-foreground"
                title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* xterm.js mount */}
          <div
            className="flex-1 p-2"
            style={{ height: fullscreen ? 'calc(100% - 44px)' : '420px' }}
          >
            <XTerminal
              key={sessionKey}
              onStatusChange={setConnectionStatus}
              onLastCommand={handleLastCommand}
              onSessionStart={handleSessionStart}
              onSessionEnd={handleSessionEnd}
            />
          </div>
        </div>

        {/* Session Log Panel */}
        {!fullscreen && (
          <SessionLogPanel
            sessions={sessions}
            currentStatus={connectionStatus}
            activeSessionStart={activeSessionStart}
            activeLastCommand={activeLastCommand}
          />
        )}
      </div>
    </LayoutWrapper>
  )
}
