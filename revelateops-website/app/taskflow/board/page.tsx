'use client'

import { useState, useMemo } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KanbanColumn } from '@/components/taskflow/tasks/KanbanColumn'
import { CreateTaskModal } from '@/components/taskflow/tasks/CreateTaskModal'
import { useTasks, useProjects, useReorderTasks, type Task } from '@/lib/taskflow/hooks'

const STATUSES = ['backlog', 'todo', 'in_progress', 'in_review', 'done']

export default function Board() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createStatus, setCreateStatus] = useState('todo')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const { data: tasks = [], isLoading } = useTasks()
  const { data: projects = [] } = useProjects()
  const reorderTasks = useReorderTasks()

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (selectedProject !== 'all' && task.project_id !== selectedProject) return false
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false
      return true
    })
  }, [tasks, selectedProject, selectedPriority])

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    STATUSES.forEach(status => {
      grouped[status] = filteredTasks
        .filter(t => t.status === status)
        .sort((a, b) => a.order - b.order)
    })
    return grouped
  }, [filteredTasks])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const sourceStatus = source.droppableId
    const destStatus = destination.droppableId

    // Get all tasks in the destination column
    const destTasks = [...tasksByStatus[destStatus]]

    // If moving within the same column
    if (sourceStatus === destStatus) {
      const [movedTask] = destTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, movedTask)

      // Update order for all tasks in this column
      const updates = destTasks.map((task, index) => ({
        id: task.id,
        status: destStatus.toUpperCase(),
        order: index,
      }))

      await reorderTasks.mutateAsync(updates)
    } else {
      // Moving to a different column
      const sourceTasks = [...tasksByStatus[sourceStatus]]
      const [movedTask] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, { ...movedTask, status: destStatus })

      // Update both columns
      const updates = [
        ...sourceTasks.map((task, index) => ({
          id: task.id,
          status: sourceStatus.toUpperCase(),
          order: index,
        })),
        ...destTasks.map((task, index) => ({
          id: task.id,
          status: destStatus.toUpperCase(),
          order: index,
        })),
      ]

      await reorderTasks.mutateAsync(updates)
    }
  }

  const handleAddTask = (status: string) => {
    setCreateStatus(status)
    setCreateModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate" />
          <span className="text-sm text-slate">Filters:</span>
        </div>

        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {(selectedProject !== 'all' || selectedPriority !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProject('all')
              setSelectedPriority('all')
            }}
            className="text-slate hover:text-navy"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onTaskClick={(task) => setSelectedTask(task)}
              onAddTask={() => handleAddTask(status)}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultStatus={createStatus}
      />
    </div>
  )
}
