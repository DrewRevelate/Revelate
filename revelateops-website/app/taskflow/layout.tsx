'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { TaskFlowProviders } from '@/components/taskflow/providers'
import { Sidebar } from '@/components/taskflow/layout/Sidebar'
import { Header } from '@/components/taskflow/layout/Header'

const pageTitles: Record<string, string> = {
  '/taskflow': 'Dashboard',
  '/taskflow/board': 'Task Board',
  '/taskflow/timeline': 'Timeline',
  '/taskflow/projects': 'Projects',
  '/taskflow/my-tasks': 'My Tasks',
  '/taskflow/activity': 'Activity Feed',
  '/taskflow/settings': 'Settings',
}

export default function TaskFlowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Don't apply layout to login page
  if (pathname === '/taskflow/login') {
    return <>{children}</>
  }

  const title = pageTitles[pathname] || 'TaskFlow'

  return (
    <TaskFlowProviders>
      <div className="min-h-screen bg-verylightgray">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-64">
          <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </TaskFlowProviders>
  )
}
