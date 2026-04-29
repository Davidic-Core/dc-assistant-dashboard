import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DC Assistant - GitHub Dashboard',
  description: 'Premium GitHub Personal Assistant Dashboard for Davidic-Core',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
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
