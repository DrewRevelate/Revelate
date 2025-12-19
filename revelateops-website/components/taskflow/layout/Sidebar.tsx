'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Kanban, FolderKanban, CheckSquare,
  Settings, X, ChevronDown, Network, Activity
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTasks } from '@/lib/taskflow/hooks'

// TODO: Re-enable when Google OAuth is configured
const userEmail = 'drew@revelateops.com'
const userName = 'Drew Lambert'

const navigation = [
  { name: 'Dashboard', href: '/taskflow', icon: LayoutDashboard },
  { name: 'Board', href: '/taskflow/board', icon: Kanban },
  { name: 'Timeline', href: '/taskflow/timeline', icon: Network },
  { name: 'Projects', href: '/taskflow/projects', icon: FolderKanban },
  { name: 'My Tasks', href: '/taskflow/my-tasks', icon: CheckSquare },
  { name: 'Activity', href: '/taskflow/activity', icon: Activity },
  { name: 'Settings', href: '/taskflow/settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: tasks = [] } = useTasks()

  const myTasksCount = tasks.filter(t =>
    t.assignee === userEmail && t.status !== 'done'
  ).length

  const isActive = (href: string) => {
    if (href === '/taskflow') return pathname === '/taskflow'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate/20 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-slate/20">
            <Link href="/taskflow" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-cyan flex items-center justify-center shadow-cyan-sm">
                <Kanban className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-navy">TaskFlow</span>
            </Link>
            <button
              className="lg:hidden p-1 hover:bg-lightgray rounded-xl transition-colors duration-200"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-navy" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive(item.href)
                    ? 'bg-cyan/10 text-navy font-medium'
                    : 'text-charcoal hover:bg-lightgray hover:text-navy'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.href === '/taskflow/my-tasks' && myTasksCount > 0 && (
                  <Badge className="ml-auto bg-cyan/20 text-cyan text-[10px]">
                    {myTasksCount}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-lightgray transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy to-cyan flex items-center justify-center text-white font-medium">
                    {userEmail.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-navy truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-slate truncate">{userEmail}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/taskflow/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  )
}
