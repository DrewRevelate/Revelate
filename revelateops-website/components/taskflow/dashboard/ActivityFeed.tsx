'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useActivities } from '@/lib/taskflow/hooks'

export function ActivityFeed() {
  const { data: activities = [], isLoading } = useActivities({ limit: 10 })

  return (
    <Card className="border-slate/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate/20" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate/20 rounded w-3/4" />
                  <div className="h-2 bg-slate/10 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-slate">
            <Activity className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-lightgray transition-colors duration-200">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'task_created' ? 'bg-cyan/20 text-cyan' :
                activity.type === 'task_status_changed' ? 'bg-magenta/20 text-magenta' :
                'bg-slate/20 text-slate'
              }`}>
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-navy">
                  <span className="font-medium">{activity.title}</span>
                </p>
                {activity.description && (
                  <p className="text-xs text-slate truncate">{activity.description}</p>
                )}
                <p className="text-xs text-slate/70 mt-1">
                  {formatDistanceToNow(new Date(activity.created_date), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
