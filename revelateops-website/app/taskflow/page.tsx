'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  CheckSquare, Folder, Clock, AlertTriangle,
  ArrowRight, Calendar, Flag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { format, isAfter, isBefore, addDays } from 'date-fns'

import { StatsCard } from '@/components/taskflow/dashboard/StatsCard'
import { TaskChart } from '@/components/taskflow/dashboard/TaskChart'
import { ActivityFeed } from '@/components/taskflow/dashboard/ActivityFeed'
import { useTasks, useProjects } from '@/lib/taskflow/hooks'

const priorityColors: Record<string, string> = {
  low: 'bg-slate/20 text-slate',
  medium: 'bg-blue/20 text-blue',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

export default function Dashboard() {
  const { data: session } = useSession()
  const { data: tasks = [], isLoading: tasksLoading } = useTasks({ limit: 100 })
  const { data: projects = [], isLoading: projectsLoading } = useProjects()

  const stats = useMemo(() => {
    const now = new Date()
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      overdue: tasks.filter(t =>
        t.due_date && isBefore(new Date(t.due_date), now) && t.status !== 'done'
      ).length,
      myTasks: tasks.filter(t => t.assignee === session?.user?.email && t.status !== 'done'),
      upcoming: tasks.filter(t =>
        t.due_date &&
        isAfter(new Date(t.due_date), now) &&
        isBefore(new Date(t.due_date), addDays(now, 7)) &&
        t.status !== 'done'
      ).slice(0, 5),
    }
  }, [tasks, session?.user?.email])

  const chartData = useMemo(() => ({
    status: [
      { name: 'Backlog', value: tasks.filter(t => t.status === 'backlog').length },
      { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
      { name: 'In Review', value: tasks.filter(t => t.status === 'in_review').length },
      { name: 'Done', value: tasks.filter(t => t.status === 'done').length },
    ],
    priority: [
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
      { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length },
    ],
  }), [tasks])

  const userName = session?.user?.name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy">
            Welcome back, {userName}
          </h1>
          <p className="text-slate mt-1">Here&apos;s what&apos;s happening with your projects</p>
        </div>
        <div className="flex gap-3">
          <Link href="/taskflow/board">
            <Button className="bg-cyan hover:bg-cyan/90 text-navy font-medium">
              <CheckSquare className="w-4 h-4 mr-2" />
              Go to Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={CheckSquare}
          color="#00d9ff"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckSquare}
          color="#22c55e"
          trend="up"
          trendValue={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`}
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="#0084ff"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          color="#ef4444"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskChart
              data={chartData.status}
              type="bar"
              title="Tasks by Status"
            />
            <TaskChart
              data={chartData.priority.filter(d => d.value > 0)}
              type="pie"
              title="Tasks by Priority"
            />
          </div>

          {/* My Tasks */}
          <Card className="border-slate/20">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold">My Tasks</CardTitle>
              <Link href="/taskflow/board">
                <Button variant="ghost" size="sm" className="text-cyan hover:text-navy">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.myTasks.length === 0 ? (
                <div className="text-center py-8 text-slate">
                  <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks assigned to you</p>
                </div>
              ) : (
                stats.myTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-lightgray transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'in_progress' ? 'bg-cyan' :
                        task.status === 'in_review' ? 'bg-magenta' : 'bg-blue'
                      }`} />
                      <div>
                        <p className="font-medium text-navy text-sm">{task.title}</p>
                        {task.project && (
                          <p className="text-xs text-slate">{task.project.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </Badge>
                      {task.due_date && (
                        <span className="text-xs text-slate">
                          {format(new Date(task.due_date), 'MMM d')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="border-slate/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.upcoming.length === 0 ? (
                <div className="text-center py-8 text-slate">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming deadlines</p>
                </div>
              ) : (
                stats.upcoming.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-lightgray transition-colors duration-200">
                    <div className="w-10 h-10 rounded-xl bg-cyan/10 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-navy font-medium">
                        {format(new Date(task.due_date!), 'MMM').toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-navy">
                        {format(new Date(task.due_date!), 'd')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy text-sm truncate">{task.title}</p>
                      <p className="text-xs text-slate">
                        {format(new Date(task.due_date!), 'EEEE')}
                      </p>
                    </div>
                    <Flag className={`w-4 h-4 ${
                      task.priority === 'urgent' ? 'text-red-500' :
                      task.priority === 'high' ? 'text-orange-500' :
                      task.priority === 'medium' ? 'text-blue' : 'text-slate'
                    }`} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <ActivityFeed />

          {/* Projects Overview */}
          <Card className="border-slate/20">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Folder className="w-5 h-5 text-slate" />
                Projects
              </CardTitle>
              <Link href="/taskflow/projects">
                <Button variant="ghost" size="sm" className="text-cyan hover:text-navy">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.slice(0, 4).map(project => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color || '#00d9ff' }}
                      />
                      <span className="text-sm font-medium text-navy">{project.name}</span>
                    </div>
                    <span className="text-xs text-slate">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
