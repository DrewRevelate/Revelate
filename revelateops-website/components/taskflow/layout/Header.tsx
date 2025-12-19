'use client'

import Link from 'next/link'
import { Menu, Plus, Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications, useMarkNotificationsRead } from '@/lib/taskflow/hooks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { data: notifications = [] } = useNotifications(true)
  const markRead = useMarkNotificationsRead()
  const unreadCount = notifications.length

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate/20">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 hover:bg-lightgray rounded-xl transition-colors duration-200"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5 text-navy" />
          </button>
          <h1 className="text-lg font-heading font-semibold text-navy hidden sm:block">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-slate hover:text-navy">
            <Search className="w-5 h-5" />
          </Button>

          <Link href="/taskflow/board">
            <Button size="sm" className="hidden sm:flex bg-cyan hover:bg-cyan/90 text-navy font-medium">
              <Plus className="w-4 h-4 mr-1" />
              New Task
            </Button>
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-slate hover:text-navy">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-magenta text-white text-[10px]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="font-medium text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="text-xs text-cyan hover:underline"
                    onClick={() => markRead.mutate()}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate">
                  No new notifications
                </div>
              ) : (
                notifications.slice(0, 5).map(notification => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-slate line-clamp-2">{notification.message}</span>
                    <span className="text-xs text-slate/70">
                      {formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
