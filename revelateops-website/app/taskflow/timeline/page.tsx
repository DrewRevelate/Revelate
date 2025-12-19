'use client'

import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTasks, useProjects } from '@/lib/taskflow/hooks'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const priorityColors: Record<string, string> = {
  low: 'bg-slate/70',
  medium: 'bg-blue',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
}

export default function Timeline() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { data: tasks = [], isLoading } = useTasks()
  const { data: projects = [] } = useProjects()

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const tasksByDay = useMemo(() => {
    const grouped: Record<string, typeof tasks> = {}
    days.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      grouped[dateStr] = tasks.filter(task =>
        task.due_date && isSameDay(new Date(task.due_date), day)
      )
    })
    return grouped
  }, [tasks, days])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-heading font-semibold text-navy">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-7 gap-4">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayTasks = tasksByDay[dateStr] || []
          const isToday = isSameDay(day, new Date())

          return (
            <div key={dateStr} className="min-h-[300px]">
              {/* Day Header */}
              <div className={`p-3 rounded-t-xl text-center ${
                isToday ? 'bg-cyan text-navy' : 'bg-slate/10 text-slate'
              }`}>
                <p className="text-xs font-medium uppercase">
                  {format(day, 'EEE')}
                </p>
                <p className={`text-lg font-heading font-bold ${isToday ? 'text-navy' : 'text-navy'}`}>
                  {format(day, 'd')}
                </p>
              </div>

              {/* Day Content */}
              <div className={`p-2 rounded-b-xl border border-t-0 min-h-[250px] ${
                isToday ? 'border-cyan/30 bg-cyan/5' : 'border-slate/20 bg-white'
              }`}>
                {dayTasks.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate/40">
                    <Calendar className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-2 rounded-lg ${priorityColors[task.priority]} text-white text-xs`}
                      >
                        <p className="font-medium line-clamp-2">{task.title}</p>
                        {task.project && (
                          <p className="opacity-75 text-[10px] mt-1 truncate">
                            {task.project.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate/70" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>Urgent</span>
        </div>
      </div>
    </div>
  )
}
