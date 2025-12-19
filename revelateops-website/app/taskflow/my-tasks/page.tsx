'use client'

import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { CheckSquare, Clock, Calendar, Flag } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useTasks, useUpdateTask } from '@/lib/taskflow/hooks'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

const priorityColors: Record<string, string> = {
  low: 'bg-slate/20 text-slate',
  medium: 'bg-blue/20 text-blue',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

export default function MyTasks() {
  const { data: session } = useSession()
  const { data: tasks = [], isLoading } = useTasks()
  const updateTask = useUpdateTask()

  const myTasks = useMemo(() => {
    return tasks.filter(t =>
      t.assignee === session?.user?.email && t.status !== 'done'
    )
  }, [tasks, session?.user?.email])

  const groupedTasks = useMemo(() => {
    const overdue: typeof myTasks = []
    const today: typeof myTasks = []
    const tomorrow: typeof myTasks = []
    const upcoming: typeof myTasks = []
    const noDueDate: typeof myTasks = []

    myTasks.forEach(task => {
      if (!task.due_date) {
        noDueDate.push(task)
      } else {
        const dueDate = new Date(task.due_date)
        if (isPast(dueDate) && !isToday(dueDate)) {
          overdue.push(task)
        } else if (isToday(dueDate)) {
          today.push(task)
        } else if (isTomorrow(dueDate)) {
          tomorrow.push(task)
        } else {
          upcoming.push(task)
        }
      }
    })

    return { overdue, today, tomorrow, upcoming, noDueDate }
  }, [myTasks])

  const handleToggleComplete = async (taskId: string) => {
    await updateTask.mutateAsync({ id: taskId, status: 'done' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan" />
      </div>
    )
  }

  const TaskGroup = ({ title, tasks, icon: Icon, iconColor }: { title: string; tasks: typeof myTasks; icon: any; iconColor: string }) => {
    if (tasks.length === 0) return null

    return (
      <Card className="border-slate/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
            {title}
            <Badge variant="secondary" className="ml-2 text-xs">
              {tasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-lightgray transition-colors duration-200"
            >
              <Checkbox
                checked={false}
                onCheckedChange={() => handleToggleComplete(task.id)}
                className="border-slate"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy text-sm truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {task.project && (
                    <span className="text-xs text-slate">{task.project.name}</span>
                  )}
                  {task.due_date && (
                    <span className="text-xs text-slate flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(task.due_date), 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
              <Badge className={`text-[10px] ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-navy">{myTasks.length}</p>
                <p className="text-xs text-slate">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-navy">{groupedTasks.overdue.length}</p>
                <p className="text-xs text-slate">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-navy">{groupedTasks.today.length}</p>
                <p className="text-xs text-slate">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-magenta/10 flex items-center justify-center">
                <Flag className="w-5 h-5 text-magenta" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-navy">
                  {myTasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length}
                </p>
                <p className="text-xs text-slate">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Groups */}
      {myTasks.length === 0 ? (
        <Card className="border-dashed border-2 border-slate/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="w-12 h-12 text-slate/40 mb-4" />
            <h3 className="text-lg font-medium text-navy mb-2">No tasks assigned to you</h3>
            <p className="text-sm text-slate">Tasks assigned to you will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <TaskGroup title="Overdue" tasks={groupedTasks.overdue} icon={Clock} iconColor="#ef4444" />
          <TaskGroup title="Today" tasks={groupedTasks.today} icon={Calendar} iconColor="#f59e0b" />
          <TaskGroup title="Tomorrow" tasks={groupedTasks.tomorrow} icon={Calendar} iconColor="#00d9ff" />
          <TaskGroup title="Upcoming" tasks={groupedTasks.upcoming} icon={Calendar} iconColor="#64748b" />
          <TaskGroup title="No Due Date" tasks={groupedTasks.noDueDate} icon={Flag} iconColor="#64748b" />
        </div>
      )}
    </div>
  )
}
