import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'xterm/css/xterm.css'

export const metadata: Metadata = {
  title: 'DC Assistant - GitHub Dashboard',
  description: 'Premium GitHub Personal Assistant Dashboard for Davidic-Core',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
