'use client'

import { useState } from 'react'
import { Plus, Folder, MoreHorizontal, Trash2, Edit, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, type Project } from '@/lib/taskflow/hooks'

const PROJECT_COLORS = [
  '#00d9ff', '#0084ff', '#d946ef', '#22c55e', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b',
]

export default function Projects() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#00d9ff')

  const { data: projects = [], isLoading } = useProjects()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          name: name.trim(),
          description: description.trim() || null,
          color,
        })
      } else {
        await createProject.mutateAsync({
          name: name.trim(),
          description: description.trim() || null,
          color,
        })
      }
      resetForm()
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setColor('#00d9ff')
    setCreateOpen(false)
    setEditingProject(null)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setName(project.name)
    setDescription(project.description || '')
    setColor(project.color || '#00d9ff')
    setCreateOpen(true)
  }

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete "${project.name}"? This will also delete all tasks in this project.`)) {
      return
    }
    await deleteProject.mutateAsync(project.id)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold text-navy">Projects</h2>
          <p className="text-sm text-slate mt-1">Organize your tasks into projects</p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-cyan hover:bg-cyan/90 text-navy"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="border-dashed border-2 border-slate/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="w-12 h-12 text-slate/40 mb-4" />
            <h3 className="text-lg font-medium text-navy mb-2">No projects yet</h3>
            <p className="text-sm text-slate mb-4">Create your first project to organize tasks</p>
            <Button onClick={() => setCreateOpen(true)} className="bg-cyan hover:bg-cyan/90 text-navy">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="border-slate/20 hover:shadow-cyan-sm transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <Folder className="w-5 h-5" style={{ color: project.color || '#00d9ff' }} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="mt-1 text-[10px]">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(project)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(project)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                {project.description && (
                  <p className="text-sm text-slate line-clamp-2 mb-4">{project.description}</p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate">Progress</span>
                    <span className="font-medium text-navy">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t border-slate/10">
                <div className="flex items-center gap-4 text-sm text-slate">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {project.completed_tasks}/{project.task_count} tasks
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={createOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingProject ? 'Edit Project' : 'Create Project'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this project about?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {PROJECT_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-navy scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || createProject.isPending || updateProject.isPending}
                className="bg-cyan hover:bg-cyan/90 text-navy"
              >
                {editingProject ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
