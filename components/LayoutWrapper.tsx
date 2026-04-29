'use client'

import Sidebar from './Sidebar'
import Header from './Header'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto pt-16 pb-16 sm:pb-0 sm:pl-0">
          {children}
        </main>
      </div>
    </div>
  )
}
