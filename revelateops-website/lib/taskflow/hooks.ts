'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types
export interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  task_type: string
  labels: string[]
  estimated_days: number | null
  order: number
  due_date: string | null
  project_id: string | null
  project: { id: string; name: string; color: string | null } | null
  parent_id: string | null
  dependencies: string[]
  assignee: string | null
  created_by: string
  created_date: string
  updated_date: string
  subtasks?: { id: string; title: string; status: string }[]
  comment_count?: number
  comments?: Comment[]
}

export interface Project {
  id: string
  name: string
  description: string | null
  color: string | null
  status: string
  owner_id: string
  created_date: string
  updated_date: string
  task_count: number
  completed_tasks: number
  progress: number
  tasks?: Task[]
}

export interface Activity {
  id: string
  type: string
  entity_type: string
  entity_id: string
  title: string
  description: string | null
  metadata: any
  user_id: string
  project_id: string | null
  task_id: string | null
  task: { id: string; title: string } | null
  created_date: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  task_id: string | null
  user_id: string
  created_date: string
}

export interface Comment {
  id: string
  content: string
  author_id: string
  created_date: string
  updated_date: string
}

// API Helper
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return res.json()
}

// Task Hooks
export interface TaskFilters {
  projectId?: string
  status?: string
  priority?: string
  assigneeId?: string
  sortBy?: string
  limit?: number
}

export function useTasks(filters: TaskFilters = {}) {
  const params = new URLSearchParams()
  if (filters.projectId) params.set('projectId', filters.projectId)
  if (filters.status) params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  if (filters.assigneeId) params.set('assigneeId', filters.assigneeId)
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.limit) params.set('limit', filters.limit.toString())

  return useQuery({
    queryKey: ['taskflow', 'tasks', filters],
    queryFn: () => fetchAPI<Task[]>(`/api/taskflow/tasks?${params}`),
    staleTime: 30000,
  })
}

export function useTask(id: string | null) {
  return useQuery({
    queryKey: ['taskflow', 'tasks', id],
    queryFn: () => fetchAPI<Task>(`/api/taskflow/tasks/${id}`),
    enabled: !!id,
    staleTime: 30000,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Task>) =>
      fetchAPI<Task>('/api/taskflow/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'activities'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Task>) =>
      fetchAPI<Task>(`/api/taskflow/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'tasks', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'activities'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      fetchAPI<{ success: boolean }>(`/api/taskflow/tasks/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'tasks'] })
    },
  })
}

export function useReorderTasks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tasks: { id: string; status: string; order: number }[]) =>
      fetchAPI<{ success: boolean }>('/api/taskflow/tasks', {
        method: 'PATCH',
        body: JSON.stringify({ tasks }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'tasks'] })
    },
  })
}

// Project Hooks
export function useProjects(status?: string) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)

  return useQuery({
    queryKey: ['taskflow', 'projects', { status }],
    queryFn: () => fetchAPI<Project[]>(`/api/taskflow/projects?${params}`),
    staleTime: 60000,
  })
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: ['taskflow', 'projects', id],
    queryFn: () => fetchAPI<Project>(`/api/taskflow/projects/${id}`),
    enabled: !!id,
    staleTime: 30000,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Project>) =>
      fetchAPI<Project>('/api/taskflow/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'projects'] })
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'activities'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Project>) =>
      fetchAPI<Project>(`/api/taskflow/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'projects'] })
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'projects', variables.id] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      fetchAPI<{ success: boolean }>(`/api/taskflow/projects/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'projects'] })
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'tasks'] })
    },
  })
}

// Activity Hook
export function useActivities(options: { projectId?: string; taskId?: string; limit?: number } = {}) {
  const params = new URLSearchParams()
  if (options.projectId) params.set('projectId', options.projectId)
  if (options.taskId) params.set('taskId', options.taskId)
  if (options.limit) params.set('limit', options.limit.toString())

  return useQuery({
    queryKey: ['taskflow', 'activities', options],
    queryFn: () => fetchAPI<Activity[]>(`/api/taskflow/activities?${params}`),
    staleTime: 30000,
  })
}

// Notification Hooks
export function useNotifications(unreadOnly = false) {
  const params = new URLSearchParams()
  if (unreadOnly) params.set('unread', 'true')

  return useQuery({
    queryKey: ['taskflow', 'notifications', { unreadOnly }],
    queryFn: () => fetchAPI<Notification[]>(`/api/taskflow/notifications?${params}`),
    staleTime: 30000,
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetchAPI<{ success: boolean }>('/api/taskflow/notifications', {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskflow', 'notifications'] })
    },
  })
}
