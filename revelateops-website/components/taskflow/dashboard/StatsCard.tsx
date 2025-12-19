'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type ColorVariant = 'cyan' | 'blue' | 'green' | 'red' | 'magenta' | 'slate'

const colorStyles: Record<ColorVariant, { bg: string; text: string }> = {
  cyan: { bg: 'bg-cyan/10', text: 'text-cyan' },
  blue: { bg: 'bg-blue/10', text: 'text-blue' },
  green: { bg: 'bg-green-500/10', text: 'text-green-600' },
  red: { bg: 'bg-red-500/10', text: 'text-red-600' },
  magenta: { bg: 'bg-magenta/10', text: 'text-magenta' },
  slate: { bg: 'bg-slate/10', text: 'text-slate' },
}

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: ColorVariant
  trend?: 'up' | 'down'
  trendValue?: string
}

export function StatsCard({ title, value, icon: Icon, color = 'cyan', trend, trendValue }: StatsCardProps) {
  const styles = colorStyles[color]

  return (
    <Card>
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
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.bg}`}>
            <Icon className={`w-6 h-6 ${styles.text}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
