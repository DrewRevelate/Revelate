'use client'

import { Droppable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskCard } from './TaskCard'
import type { Task } from '@/lib/taskflow/hooks'

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  backlog: { bg: 'bg-slate/10', border: 'border-slate/30', text: 'text-slate' },
  todo: { bg: 'bg-blue/10', border: 'border-blue/30', text: 'text-blue' },
  in_progress: { bg: 'bg-cyan/10', border: 'border-cyan/30', text: 'text-cyan' },
  in_review: { bg: 'bg-magenta/10', border: 'border-magenta/30', text: 'text-magenta' },
  done: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-600' },
}

const statusLabels: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}

interface KanbanColumnProps {
  status: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: () => void
}

export function KanbanColumn({ status, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const colors = statusColors[status] || statusColors.todo
  const label = statusLabels[status] || status

  return (
    <div className="flex-shrink-0 w-72">
      {/* Column Header */}
      <div className={`flex items-center justify-between p-3 rounded-t-xl ${colors.bg} border-b-2 ${colors.border}`}>
        <div className="flex items-center gap-2">
          <h3 className={`font-medium text-sm ${colors.text}`}>{label}</h3>
          <span className="px-2 py-0.5 text-xs rounded-full bg-white/50 text-slate font-medium">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onAddTask}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Column Content */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-[500px] p-2 space-y-2 rounded-b-xl border border-t-0 border-slate/20
              transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-cyan/5' : 'bg-white/50'}
            `}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-8 text-slate/50">
                <p className="text-sm">No tasks</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
