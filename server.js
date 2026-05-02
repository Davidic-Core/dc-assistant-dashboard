const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { spawn } = require('child_process')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT || '3001', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })

  const io = new Server(httpServer, {
    cors: { origin: '*' },
  })

  io.on('connection', (socket) => {
    console.log('[terminal] client connected:', socket.id)

    const shell = spawn('bash', ['--login'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor',
        LANG: 'en_US.UTF-8',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    shell.stdout.on('data', (data) => {
      socket.emit('output', data.toString())
    })

    shell.stderr.on('data', (data) => {
      socket.emit('output', data.toString())
    })

    shell.on('close', (code) => {
      socket.emit('output', `\r\n\x1b[33mShell exited (code ${code}). Reconnect to start a new session.\x1b[0m\r\n`)
    })

    shell.on('error', (err) => {
      socket.emit('output', `\r\n\x1b[31mShell error: ${err.message}\x1b[0m\r\n`)
    })

    socket.on('input', (data) => {
      if (shell.stdin.writable) {
        shell.stdin.write(data)
      }
    })

    socket.on('resize', ({ cols, rows }) => {
      if (shell.pid) {
        try {
          process.kill(shell.pid, 'SIGWINCH')
        } catch (_) {}
      }
    })

    socket.on('disconnect', () => {
      console.log('[terminal] client disconnected:', socket.id)
      try { shell.kill() } catch (_) {}
    })
  })

  httpServer.listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
