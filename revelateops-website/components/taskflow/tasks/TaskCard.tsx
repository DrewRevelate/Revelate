'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Calendar, MessageSquare, Flag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { Task } from '@/lib/taskflow/hooks'

const priorityColors: Record<string, string> = {
  low: 'bg-slate/20 text-slate',
  medium: 'bg-blue/20 text-blue',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

const taskTypeIcons: Record<string, string> = {
  story: '📖',
  task: '✓',
  subtask: '◦',
  bug: '🐛',
}

interface TaskCardProps {
  task: Task
  index: number
  onClick: () => void
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`
            p-3 rounded-xl bg-white border border-slate/20 cursor-pointer
            transition-all duration-200 hover:shadow-cyan-sm
            ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
          `}
        >
          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels.slice(0, 3).map((label, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] rounded-full bg-cyan/10 text-cyan"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <div className="flex items-start gap-2">
            <span className="text-sm">{taskTypeIcons[task.task_type] || '✓'}</span>
            <h3 className="text-sm font-medium text-navy line-clamp-2 flex-1">
              {task.title}
            </h3>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Badge className={`text-[10px] ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-slate">
              {task.due_date && (
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(task.due_date), 'MMM d')}
                </div>
              )}
              {(task.comment_count ?? 0) > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <MessageSquare className="w-3 h-3" />
                  {task.comment_count}
                </div>
              )}
            </div>
          </div>

          {/* Project indicator */}
          {task.project && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate/10">
              <div
                className="w-2 h-2 rounded-full bg-cyan"
                style={task.project.color ? { backgroundColor: task.project.color } : undefined}
              />
              <span className="text-xs text-slate truncate">{task.project.name}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
