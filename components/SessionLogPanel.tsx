'use client'

import { useEffect, useState } from 'react'
import { Clock, Terminal, Smartphone, AlertCircle } from 'lucide-react'
import type { ConnectionStatus } from './XTerminal'

export interface SessionEntry {
  id: number
  startTime: Date
  endTime?: Date
  lastCommand: string
  status: 'active' | 'ended'
}

interface SessionLogPanelProps {
  sessions: SessionEntry[]
  currentStatus: ConnectionStatus
  activeSessionStart: Date | null
  activeLastCommand: string
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDuration(start: Date, end?: Date) {
  const ms = (end ?? new Date()).getTime() - start.getTime()
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m ${sec}s`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

function LiveDuration({ start }: { start: Date }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return <span>{formatDuration(start)}</span>
}

function StatusBadge({ status }: { status: ConnectionStatus }) {
  const config = {
    connected: {
      label: 'Online (Termux)',
      dot: 'bg-emerald-500 shadow-[0_0_6px_#10b981]',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    connecting: {
      label: 'Connecting...',
      dot: 'bg-yellow-400 shadow-[0_0_6px_#fbbf24] animate-pulse',
      text: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/30',
    },
    disconnected: {
      label: 'Offline',
      dot: 'bg-red-400',
      text: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/30',
    },
    error: {
      label: 'Offline',
      dot: 'bg-red-400',
      text: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/30',
    },
  }[status]

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  )
}

export default function SessionLogPanel({
  sessions,
  currentStatus,
  activeSessionStart,
  activeLastCommand,
}: SessionLogPanelProps) {
  const allSessions = [...sessions].reverse()

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">Session Log</span>
          {sessions.length > 0 && (
            <span className="text-xs text-text-tertiary bg-card-border px-2 py-0.5 rounded-full">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      {/* Active session */}
      {currentStatus === 'connected' && activeSessionStart && (
        <div className="px-5 py-4 bg-emerald-500/5 border-b border-emerald-500/20">
          <p className="text-xs font-mono text-emerald-400 font-semibold mb-3 uppercase tracking-wider">
            Active Session
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-text-tertiary mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Start Time
              </p>
              <p className="text-sm font-mono text-foreground">{formatTime(activeSessionStart)}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Duration
              </p>
              <p className="text-sm font-mono text-emerald-400">
                <LiveDuration start={activeSessionStart} />
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-1 flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Last Command
              </p>
              <p className="text-sm font-mono text-accent truncate" title={activeLastCommand}>
                {activeLastCommand || <span className="text-text-tertiary italic">—</span>}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Waiting state */}
      {(currentStatus === 'connecting') && (
        <div className="px-5 py-6 flex items-center gap-3 text-yellow-400 border-b border-card-border">
          <Smartphone className="w-4 h-4 animate-pulse flex-shrink-0" />
          <p className="text-sm font-mono">Waiting for your phone to connect...</p>
        </div>
      )}

      {/* Offline state */}
      {(currentStatus === 'disconnected' || currentStatus === 'error') && sessions.length === 0 && (
        <div className="px-5 py-6 flex items-center gap-3 text-red-400 border-b border-card-border">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-mono">No sessions yet — bridge is offline.</p>
        </div>
      )}

      {/* Past sessions */}
      {allSessions.length > 0 && (
        <div className="divide-y divide-card-border">
          <p className="px-5 py-2 text-xs font-mono text-text-tertiary uppercase tracking-wider">
            History
          </p>
          {allSessions.map((s) => (
            <div key={s.id} className="px-5 py-3 grid grid-cols-3 gap-4 opacity-70 hover:opacity-100 transition-opacity">
              <div>
                <p className="text-xs text-text-tertiary mb-0.5">Start</p>
                <p className="text-xs font-mono text-foreground">{formatTime(s.startTime)}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-0.5">Duration</p>
                <p className="text-xs font-mono text-foreground">
                  {s.endTime ? formatDuration(s.startTime, s.endTime) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-0.5">Last Cmd</p>
                <p className="text-xs font-mono text-accent truncate" title={s.lastCommand}>
                  {s.lastCommand || <span className="text-text-tertiary italic">—</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {allSessions.length === 0 && currentStatus === 'connected' && (
        <div className="px-5 py-3 text-xs text-text-tertiary font-mono">
          No previous sessions in this view.
        </div>
      )}
    </div>
  )
}
