'use client'

import { Activity, CheckCircle, Plus, ArrowRight, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useActivities } from '@/lib/taskflow/hooks'
import { formatDistanceToNow, format } from 'date-fns'

const activityIcons: Record<string, { icon: any; color: string; bg: string }> = {
  task_created: { icon: Plus, color: 'text-green-600', bg: 'bg-green-100' },
  task_status_changed: { icon: ArrowRight, color: 'text-cyan', bg: 'bg-cyan/20' },
  task_completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  project_created: { icon: Plus, color: 'text-magenta', bg: 'bg-magenta/20' },
  default: { icon: Activity, color: 'text-slate', bg: 'bg-slate/20' },
}

export default function ActivityFeed() {
  const { data: activities = [], isLoading } = useActivities({ limit: 100 })

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = format(new Date(activity.created_date), 'yyyy-MM-dd')
    if (!acc[date]) acc[date] = []
    acc[date].push(activity)
    return acc
  }, {} as Record<string, typeof activities>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-heading font-semibold text-navy">Activity Feed</h2>
        <p className="text-sm text-slate mt-1">Track all changes and updates</p>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <Card className="border-dashed border-2 border-slate/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="w-12 h-12 text-slate/40 mb-4" />
            <h3 className="text-lg font-medium text-navy mb-2">No activity yet</h3>
            <p className="text-sm text-slate">Your activity will appear here as you work</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-slate mb-4">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <Card className="border-slate/20">
                <CardContent className="p-0">
                  <div className="divide-y divide-slate/10">
                    {dayActivities.map((activity, index) => {
                      const config = activityIcons[activity.type] || activityIcons.default
                      const Icon = config.icon

                      return (
                        <div key={activity.id} className="flex gap-4 p-4">
                          <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-navy text-sm">{activity.title}</p>
                            {activity.description && (
                              <p className="text-sm text-slate mt-1">{activity.description}</p>
                            )}
                            {activity.task && (
                              <p className="text-xs text-slate mt-1">
                                Task: {activity.task.title}
                              </p>
                            )}
                            <p className="text-xs text-slate/70 mt-2">
                              {formatDistanceToNow(new Date(activity.created_date), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
