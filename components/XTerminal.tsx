'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

const TERMUX_BRIDGE_URL = 'https://respiratory-noted-per-theatre.trycloudflare.com'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface XTerminalProps {
  onStatusChange?: (status: ConnectionStatus) => void
  onLastCommand?: (cmd: string) => void
  onSessionStart?: (time: Date) => void
  onSessionEnd?: () => void
}

export default function XTerminal({
  onStatusChange,
  onLastCommand,
  onSessionStart,
  onSessionEnd,
}: XTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<any>(null)
  const socketRef = useRef<any>(null)
  const fitAddonRef = useRef<any>(null)
  const cleanedUpRef = useRef(false)
  const inputBufferRef = useRef('')
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  const updateStatus = useCallback((s: ConnectionStatus) => {
    setStatus(s)
    onStatusChange?.(s)
  }, [onStatusChange])

  const initTerminal = useCallback(async () => {
    if (!containerRef.current || cleanedUpRef.current) return

    const [
      { Terminal },
      { FitAddon },
      { io },
    ] = await Promise.all([
      import('xterm'),
      import('xterm-addon-fit'),
      import('socket.io-client'),
    ])

    if (cleanedUpRef.current || !containerRef.current) return

    const term = new Terminal({
      theme: {
        background: '#0a0a0a',
        foreground: '#e5e7eb',
        cursor: '#10b981',
        cursorAccent: '#0a0a0a',
        selectionBackground: 'rgba(16,185,129,0.2)',
        black: '#1a1a1a',
        brightBlack: '#404040',
        red: '#f87171',
        brightRed: '#fca5a5',
        green: '#10b981',
        brightGreen: '#34d399',
        yellow: '#fbbf24',
        brightYellow: '#fcd34d',
        blue: '#60a5fa',
        brightBlue: '#93c5fd',
        magenta: '#c084fc',
        brightMagenta: '#d8b4fe',
        cyan: '#22d3ee',
        brightCyan: '#67e8f9',
        white: '#e5e7eb',
        brightWhite: '#f9fafb',
      },
      fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Menlo, monospace',
      fontSize: 14,
      lineHeight: 1.4,
      cursorBlink: true,
      convertEol: true,
      scrollback: 2000,
      allowTransparency: true,
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(containerRef.current)

    setTimeout(() => {
      try { fitAddon.fit() } catch (_) {}
    }, 50)

    termRef.current = term
    fitAddonRef.current = fitAddon

    term.writeln('\x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m')
    term.writeln('\x1b[1;32m  DC Assistant  ·  Termux Bridge\x1b[0m')
    term.writeln('\x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m')
    term.writeln(`\x1b[90mBridge: ${TERMUX_BRIDGE_URL}\x1b[0m`)
    term.writeln('\x1b[90mWaiting for your phone to connect...\x1b[0m\r\n')

    updateStatus('connecting')

    const socket = io(TERMUX_BRIDGE_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      if (cleanedUpRef.current) return
      updateStatus('connected')
      onSessionStart?.(new Date())
      inputBufferRef.current = ''
      term.writeln('\x1b[32m✓ Online (Termux) — live session active\x1b[0m\r\n')
    })

    socket.on('terminal-output', (data: string) => {
      if (cleanedUpRef.current) return
      term.write(data)
    })

    socket.on('connect_error', (err: Error) => {
      if (cleanedUpRef.current) return
      updateStatus('error')
      term.writeln(`\x1b[31m✗ Bridge unreachable: ${err.message}\x1b[0m`)
      term.writeln('\x1b[90m  Retrying — make sure the Cloudflare tunnel is running on your phone.\x1b[0m')
    })

    socket.on('disconnect', (reason: string) => {
      if (cleanedUpRef.current) return
      updateStatus('disconnected')
      onSessionEnd?.()
      term.writeln(`\r\n\x1b[33m⚡ Offline — phone disconnected (${reason})\x1b[0m`)
      term.writeln('\x1b[90m  Session paused — reconnect your phone to resume.\x1b[0m')
    })

    socket.on('reconnect', (attempt: number) => {
      if (cleanedUpRef.current) return
      updateStatus('connecting')
      term.writeln(`\x1b[90m  Connecting... (attempt ${attempt})\x1b[0m`)
    })

    socket.on('reconnect_failed', () => {
      if (cleanedUpRef.current) return
      updateStatus('error')
      term.writeln('\x1b[31m✗ Could not re-establish bridge after multiple attempts.\x1b[0m')
      term.writeln('\x1b[90m  Use the refresh button to try again.\x1b[0m')
    })

    term.onData((data: string) => {
      socket.emit('terminal-input', data)

      if (data === '\r' || data === '\n') {
        const trimmed = inputBufferRef.current.trim()
        if (trimmed) onLastCommand?.(trimmed)
        inputBufferRef.current = ''
      } else if (data === '\x7f') {
        inputBufferRef.current = inputBufferRef.current.slice(0, -1)
      } else if (data.length === 1 && data >= ' ') {
        inputBufferRef.current += data
      }
    })

    const handleResize = () => {
      try {
        fitAddon.fit()
        socket.emit('resize', { cols: term.cols, rows: term.rows })
      } catch (_) {}
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateStatus, onLastCommand, onSessionStart, onSessionEnd])

  useEffect(() => {
    cleanedUpRef.current = false
    let cleanup: (() => void) | undefined

    initTerminal().then((fn) => {
      cleanup = fn
    })

    return () => {
      cleanedUpRef.current = true
      cleanup?.()
      socketRef.current?.disconnect()
      termRef.current?.dispose()
    }
  }, [initTerminal])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
        className="xterm-container"
      />
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
          background: 'rgba(10,10,10,0.75)',
          borderRadius: 6,
          padding: '2px 8px',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            display: 'inline-block',
            backgroundColor:
              status === 'connected' ? '#10b981' :
              status === 'connecting' ? '#fbbf24' : '#f87171',
            boxShadow:
              status === 'connected' ? '0 0 6px #10b981' :
              status === 'connecting' ? '0 0 6px #fbbf24' : 'none',
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontFamily: 'monospace',
            color:
              status === 'connected' ? '#10b981' :
              status === 'connecting' ? '#fbbf24' : '#f87171',
          }}
        >
          {status === 'connected' ? 'Online (Termux)' :
           status === 'connecting' ? 'Connecting...' :
           status === 'error' ? 'Offline' : 'Offline'}
        </span>
      </div>
    </div>
  )
}
