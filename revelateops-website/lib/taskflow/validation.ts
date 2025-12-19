import { z } from 'zod'

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().optional().nullable(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  taskType: z.enum(['STORY', 'TASK', 'SUBTASK', 'BUG']).default('TASK'),
  labels: z.array(z.string()).default([]),
  estimatedDays: z.number().int().positive().optional().nullable(),
  order: z.number().int().default(0),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  dependencies: z.array(z.string().uuid()).default([]),
  assigneeId: z.string().optional().nullable(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const reorderTasksSchema = z.object({
  tasks: z.array(z.object({
    id: z.string().uuid(),
    status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
    order: z.number().int(),
  }))
})

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional().nullable(),
  color: z.string().max(20).optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'COMPLETED']).default('ACTIVE'),
})

export const updateProjectSchema = createProjectSchema.partial()

// Comment validation schema
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required'),
})

// Saved filter validation schema
export const createSavedFilterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  filters: z.record(z.any()),
  viewType: z.string().max(50),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type CreateSavedFilterInput = z.infer<typeof createSavedFilterSchema>
