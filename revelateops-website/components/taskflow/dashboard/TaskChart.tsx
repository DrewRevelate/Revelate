'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// Brand colors for Recharts (requires hex strings)
// Maps to: slate, blue, cyan, magenta, green
const CHART_COLORS = {
  slate: '#64748b',
  blue: '#0084ff',
  cyan: '#00d9ff',
  magenta: '#d946ef',
  green: '#22c55e',
  navy: '#1a1f3a',
  border: '#dbe3f0',
}

const PIE_COLORS = [
  CHART_COLORS.slate,
  CHART_COLORS.blue,
  CHART_COLORS.cyan,
  CHART_COLORS.magenta,
  CHART_COLORS.green,
]

interface ChartData {
  name: string
  value: number
}

interface TaskChartProps {
  data: ChartData[]
  type: 'bar' | 'pie'
  title: string
}

export function TaskChart({ data, type, title }: TaskChartProps) {
  if (data.every(d => d.value === 0)) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-slate">No data to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
              <XAxis dataKey="name" fontSize={12} tick={{ fill: CHART_COLORS.slate }} />
              <YAxis fontSize={12} tick={{ fill: CHART_COLORS.slate }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${CHART_COLORS.border}`,
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="value" fill={CHART_COLORS.cyan} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data.filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {data.filter(d => d.value > 0).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${CHART_COLORS.border}`,
                  borderRadius: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: CHART_COLORS.navy, fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
