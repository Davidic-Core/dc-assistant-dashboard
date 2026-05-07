'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import LayoutWrapper from '@/components/LayoutWrapper'
import SessionLogPanel, { type SessionEntry } from '@/components/SessionLogPanel'
import { Maximize2, Minimize2, RefreshCw, Smartphone, Send, ChevronUp, ChevronDown, Terminal as TerminalIcon } from 'lucide-react'
import type { ConnectionStatus, XTerminalHandle } from '@/components/XTerminal'

const BRIDGE_URL =
  process.env.NEXT_PUBLIC_TERMUX_BRIDGE_URL ||
  'https://respiratory-noted-per-theatre.trycloudflare.com'

const XTerminal = dynamic(() => import('@/components/XTerminal'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-text-tertiary font-mono text-sm">
      <span className="animate-pulse">Initialising terminal...</span>
    </div>
  ),
})

const QUICK_CMDS = [
  'ls -la',
  'pwd',
  'git status',
  'git branch',
  'uname -a',
  'date',
  'whoami',
  'pkg list-installed',
]

export default function TerminalPage() {
  const [sessionKey, setSessionKey] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')

  const [sessions, setSessions] = useState<SessionEntry[]>([])
  const [activeSessionStart, setActiveSessionStart] = useState<Date | null>(null)
  const [activeLastCommand, setActiveLastCommand] = useState('')
  const sessionIdRef = useRef(0)
  const activeLastCommandRef = useRef('')

  const terminalRef = useRef<XTerminalHandle>(null)

  const [cmdInput, setCmdInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const sendCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return
    terminalRef.current?.sendCommand(trimmed)
    setCmdHistory((h) => {
      const next = [trimmed, ...h.filter((c) => c !== trimmed)].slice(0, 50)
      return next
    })
    setCmdInput('')
    setHistoryIndex(-1)
    handleLastCommand(trimmed)
  }, [handleLastCommand])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendCommand(cmdInput)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCmdHistory((h) => {
        const next = Math.min(historyIndex + 1, h.length - 1)
        setHistoryIndex(next)
        if (h[next] !== undefined) setCmdInput(h[next])
        return h
      })
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      setCmdInput(next === -1 ? '' : cmdHistory[next] ?? '')
    }
  }, [cmdInput, cmdHistory, historyIndex, sendCommand])

  const statusColor =
    connectionStatus === 'connected' ? 'text-emerald-400' :
    connectionStatus === 'connecting' ? 'text-yellow-400' : 'text-red-400'

  const statusDotClass =
    connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse' :
    connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'

  const statusLabel =
    connectionStatus === 'connected' ? 'Online (Termux)' :
    connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'

  const isConnected = connectionStatus === 'connected'

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Terminal</h1>
          <p className="text-text-secondary mt-2">
            Live Termux session streamed from your phone via Cloudflare tunnel
          </p>
        </div>

        {/* Bridge status bar */}
        <div className={`flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors ${
          isConnected
            ? 'bg-emerald-500/5 border-emerald-500/30'
            : connectionStatus === 'connecting'
            ? 'bg-yellow-400/5 border-yellow-400/20'
            : 'bg-red-400/5 border-red-400/20'
        }`}>
          <Smartphone className={`w-4 h-4 flex-shrink-0 ${statusColor}`} />
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
          <div className="bg-card-border px-4 py-2.5 flex items-center gap-2 border-b border-card-border flex-shrink-0">
            <div className="flex gap-1.5">
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
            style={{ height: fullscreen ? 'calc(100% - 88px)' : '380px' }}
          >
            <XTerminal
              key={sessionKey}
              ref={terminalRef}
              onStatusChange={setConnectionStatus}
              onLastCommand={handleLastCommand}
              onSessionStart={handleSessionStart}
              onSessionEnd={handleSessionEnd}
            />
          </div>

          {/* ── Command Input Inbox ── */}
          <div className="border-t border-card-border bg-[#0d0d0d] px-3 py-2.5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={cmdInput}
                  onChange={(e) => { setCmdInput(e.target.value); setHistoryIndex(-1) }}
                  onKeyDown={handleInputKeyDown}
                  placeholder={isConnected ? 'Type a command and press Enter...' : 'Waiting for Termux connection...'}
                  disabled={!isConnected}
                  className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-text-tertiary focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed pr-16"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                />
                {cmdHistory.length > 0 && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      onClick={() => {
                        const next = Math.min(historyIndex + 1, cmdHistory.length - 1)
                        setHistoryIndex(next)
                        setCmdInput(cmdHistory[next] ?? '')
                      }}
                      className="p-0.5 text-text-tertiary hover:text-foreground transition-colors"
                      title="Previous command"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        const next = Math.max(historyIndex - 1, -1)
                        setHistoryIndex(next)
                        setCmdInput(next === -1 ? '' : cmdHistory[next] ?? '')
                      }}
                      className="p-0.5 text-text-tertiary hover:text-foreground transition-colors"
                      title="Next command"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={() => sendCommand(cmdInput)}
                disabled={!isConnected || !cmdInput.trim()}
                className="flex items-center gap-1.5 px-3 py-1 bg-accent hover:bg-accent/80 disabled:opacity-30 disabled:cursor-not-allowed rounded text-background text-xs font-semibold transition-colors flex-shrink-0"
              >
                <Send className="w-3 h-3" />
                Run
              </button>
            </div>
          </div>
        </div>

        {/* Quick command buttons */}
        {!fullscreen && (
          <div>
            <p className="text-xs text-text-tertiary font-mono mb-2 uppercase tracking-wider">Quick commands</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CMDS.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => sendCommand(cmd)}
                  disabled={!isConnected}
                  className="px-3 py-1.5 text-xs font-mono bg-card border border-card-border rounded hover:border-accent/50 hover:text-accent text-text-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Command history */}
        {!fullscreen && cmdHistory.length > 0 && (
          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-card-border">
              <p className="text-xs font-semibold text-foreground">Command History</p>
            </div>
            <div className="divide-y divide-card-border max-h-48 overflow-y-auto">
              {cmdHistory.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => sendCommand(cmd)}
                  disabled={!isConnected}
                  className="w-full text-left px-4 py-2 font-mono text-xs text-text-secondary hover:text-accent hover:bg-card-border/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span className="text-text-tertiary select-none">$</span>
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Session log */}
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
