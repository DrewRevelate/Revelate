'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: string
  trend?: 'up' | 'down'
  trendValue?: string
}

export function StatsCard({ title, value, icon: Icon, color = '#00d9ff', trend, trendValue }: StatsCardProps) {
  return (
    <Card className="border-slate/20 hover:shadow-cyan-sm transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate">{title}</p>
            <p className="text-3xl font-heading font-bold text-navy mt-1">
              {value}
            </p>
            {trendValue && (
              <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </p>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
