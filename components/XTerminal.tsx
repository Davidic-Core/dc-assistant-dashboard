'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function XTerminal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<any>(null)
  const socketRef = useRef<any>(null)
  const fitAddonRef = useRef<any>(null)
  const cleanedUpRef = useRef(false)

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
      scrollback: 1000,
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
    term.writeln('\x1b[1;32m  DC Assistant Terminal\x1b[0m')
    term.writeln('\x1b[33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m')
    term.writeln('\x1b[90mConnecting to backend shell...\x1b[0m')

    const socket = io('/', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      term.writeln('\x1b[32m✓ Connected — real bash session active\x1b[0m\r\n')
    })

    socket.on('output', (data: string) => {
      term.write(data)
    })

    socket.on('connect_error', (err: Error) => {
      term.writeln(`\x1b[31m✗ Connection error: ${err.message}\x1b[0m`)
    })

    socket.on('disconnect', () => {
      term.writeln('\r\n\x1b[31m✗ Disconnected from server\x1b[0m')
    })

    term.onData((data: string) => {
      socket.emit('input', data)
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
  }, [])

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
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
      className="xterm-container"
    />
  )
}
