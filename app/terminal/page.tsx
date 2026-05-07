'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import LayoutWrapper from '@/components/LayoutWrapper'
import { Maximize2, Minimize2, RefreshCw, Smartphone } from 'lucide-react'

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
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting')

  const newSession = useCallback(() => setSessionKey((k) => k + 1), [])

  const statusColor =
    connectionStatus === 'connected'
      ? 'text-accent'
      : connectionStatus === 'connecting'
      ? 'text-yellow-400'
      : 'text-red-400'

  const statusDot =
    connectionStatus === 'connected'
      ? 'bg-accent animate-pulse'
      : connectionStatus === 'connecting'
      ? 'bg-yellow-400 animate-pulse'
      : 'bg-red-400'

  const statusLabel =
    connectionStatus === 'connected'
      ? 'Phone linked'
      : connectionStatus === 'connecting'
      ? 'Waiting for phone...'
      : connectionStatus === 'error'
      ? 'Bridge error'
      : 'Disconnected'

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
            <div className={`w-2 h-2 rounded-full ${statusDot}`} />
            <span className="text-xs font-mono">{statusLabel}</span>
          </div>
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
            <span className="text-xs text-text-secondary ml-2 font-mono">termux — Davidic-Core</span>
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusDot}`} />
              <span className={`text-xs font-mono ${statusColor}`}>{statusLabel}</span>
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
            <XTerminal key={sessionKey} onStatusChange={setConnectionStatus} />
          </div>
        </div>

        {!fullscreen && (
          <div className="bg-card border border-card-border rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">How it works</p>
            <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
              <li>Your phone runs a Socket.io bridge server inside Termux</li>
              <li>Cloudflare Tunnel exposes it publicly — no port-forwarding needed</li>
              <li>This dashboard connects to the tunnel URL and streams your shell in real time</li>
              <li>Use the <RefreshCw className="w-3 h-3 inline mx-0.5" /> button to reconnect if the bridge drops</li>
            </ul>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}
