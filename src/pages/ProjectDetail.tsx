import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePage } from '@/contexts/PageContext'
import { projectsService, tasksService } from '@/services/projects'
import { useRealtime } from '@/hooks/use-realtime'
import { TaskModal } from '@/components/TaskModal'
import { ProjectModal } from '@/components/ProjectModal'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import type { ProjectRecord, TaskRecord, ProjectMemberRecord, TaskStatus } from '@/types/database'
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { setTitle, setAction } = usePage()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [project, setProject] = useState<ProjectRecord | null>(null)
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [members, setMembers] = useState<ProjectMemberRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  // Modais
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<TaskRecord | null>(null)
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>('todo')
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [deletingTask, setDeletingTask] = useState<TaskRecord | null>(null)

  const loadProjectData = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const [projData, tasksData, membersData] = await Promise.all([
        projectsService.getById(id),
        tasksService.listByProject(id),
        projectsService.getMembers(id),
      ])
      setProject(projData)
      setTasks(tasksData)
      setMembers(membersData)
      setTitle(projData.name)
    } catch (err) {
      console.error('Erro ao carregar dados do projeto', err)
      toast({
        title: 'Projeto não encontrado',
        description: 'O projeto solicitado não existe ou você não tem permissão.',
        variant: 'destructive',
      })
      navigate('/projetos')
    } finally {
      setIsLoading(false)
    }
  }, [id, setTitle, navigate, toast])

  useEffect(() => {
    loadProjectData()
  }, [loadProjectData])

  // Contextual Header Action
  useEffect(() => {
    setAction({
      label: '+ Nova Tarefa',
      onClick: () => {
        setTaskToEdit(null)
        setDefaultTaskStatus('todo')
        setIsTaskModalOpen(true)
      },
    })
  }, [setAction])

  // Real-time synchronization
  useRealtime<TaskRecord>('tasks', (event) => {
    if (event.action === 'create' && event.record.project === id) {
      setTasks((prev) => [...prev.filter((t) => t.id !== event.record.id), event.record])
    } else if (event.action === 'update' && event.record.project === id) {
      setTasks((prev) => prev.map((t) => (t.id === event.record.id ? event.record : t)))
    } else if (event.action === 'delete') {
      setTasks((prev) => prev.filter((t) => t.id !== event.record.id))
    }
  })

  useRealtime<ProjectRecord>('projects', (event) => {
    if (event.record.id === id) {
      if (event.action === 'update') {
        setProject(event.record)
        setTitle(event.record.name)
      } else if (event.action === 'delete') {
        navigate('/projetos')
      }
    }
  })

  useRealtime<ProjectMemberRecord>('project_members', (event) => {
    if (event.record.project === id) {
      if (event.action === 'create') {
        setMembers((prev) => [...prev, event.record])
      } else if (event.action === 'delete') {
        setMembers((prev) => prev.filter((m) => m.id !== event.record.id))
      }
    }
  })

  // Kanban Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== status) {
      setDragOverColumn(status)
    }
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    setDragOverColumn(null)
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    if (!taskId) return

    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === targetStatus) return

    // Optimistic UI update
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t)))

    try {
      await tasksService.update(taskId, {
        status: targetStatus,
        order: Date.now(),
      })
      toast({
        title: 'Status atualizado',
        description: `Tarefa movida para "${
          targetStatus === 'todo'
            ? 'A Fazer'
            : targetStatus === 'doing'
              ? 'Em Andamento'
              : 'Concluído'
        }".`,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao mover tarefa.'
      toast({ title: 'Erro', description: msg, variant: 'destructive' })
      loadProjectData()
    } finally {
      setDraggedTaskId(null)
    }
  }

  const handleDeleteTask = async () => {
    if (!deletingTask) return
    try {
      await tasksService.delete(deletingTask.id)
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id))
      toast({ title: 'Tarefa excluída com sucesso!' })
      setDeletingTask(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao excluir tarefa.'
      toast({ title: 'Erro', description: msg, variant: 'destructive' })
    }
  }

  if (isLoading || !project) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    )
  }

  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const columns: { status: TaskStatus; label: string; icon: React.ReactNode; color: string }[] = [
    {
      status: 'todo',
      label: 'A Fazer',
      icon: <Layers className="w-4 h-4 text-slate-500" />,
      color: 'border-slate-300',
    },
    {
      status: 'doing',
      label: 'Em Andamento',
      icon: <Clock className="w-4 h-4 text-indigo-600" />,
      color: 'border-indigo-400',
    },
    {
      status: 'done',
      label: 'Concluído',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-400',
    },
  ]

  const ownerName = project.expand?.owner?.name || project.expand?.owner?.email || 'Admin'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Project Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div
              className="w-4 h-12 rounded-md shrink-0 mt-0.5 sm:mt-0"
              style={{ backgroundColor: project.cover_color || '#4F46E5' }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {project.name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-slate-100 text-slate-700 capitalize">
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                {project.description || 'Sem descrição cadastrada para este projeto.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsProjectModalOpen(true)}
              className="text-slate-700 font-semibold gap-1.5"
            >
              <Edit className="w-4 h-4" />
              Editar Projeto
            </Button>
            <Button
              onClick={() => {
                setTaskToEdit(null)
                setDefaultTaskStatus('todo')
                setIsTaskModalOpen(true)
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Progress & Members Subheader */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3 w-full sm:w-72">
            <span className="font-semibold text-slate-700 shrink-0">
              Progresso ({progressPercent}%)
            </span>
            <Progress value={progressPercent} className="h-2 flex-1" />
            <span className="shrink-0">
              {completedTasks}/{tasks.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-600">Líder: {ownerName}</span>
            {members.length > 0 && (
              <div className="flex items-center -space-x-1.5 ml-2">
                {members.slice(0, 4).map((m) => {
                  const mName = m.expand?.user?.name || m.expand?.user?.email || 'M'
                  return (
                    <Avatar key={m.id} className="h-6 w-6 border-2 border-white shadow-xs">
                      <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700 font-bold">
                        {mName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = tasks
            .filter((t) => t.status === col.status)
            .sort((a, b) => (a.order || 0) - (b.order || 0))

          const isOver = dragOverColumn === col.status

          return (
            <div
              key={col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`flex flex-col bg-slate-100/70 rounded-xl p-4 min-h-[500px] border-2 transition-all ${
                isOver ? 'border-indigo-500 bg-indigo-50/40 shadow-md' : 'border-transparent'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <span className="font-bold text-sm text-slate-800">{col.label}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {colTasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-white"
                  onClick={() => {
                    setTaskToEdit(null)
                    setDefaultTaskStatus(col.status)
                    setIsTaskModalOpen(true)
                  }}
                  title={`Adicionar tarefa em ${col.label}`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Tasks Cards Container */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs text-center p-4">
                    <span>Arraste uma tarefa aqui ou clique no "+" acima</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const priorityStyles = {
                      alta: 'bg-red-50 text-red-700 border-red-200',
                      media: 'bg-amber-50 text-amber-700 border-amber-200',
                      baixa: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    }[task.priority]

                    const overdue =
                      task.due_date &&
                      task.status !== 'done' &&
                      new Date(task.due_date) < new Date()

                    const assignee = members.find((m) => m.user === task.assigned_to)

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`group bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing space-y-3 ${
                          draggedTaskId === task.id ? 'opacity-40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 leading-snug">
                            {task.title}
                          </h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mr-1 text-slate-400 hover:text-slate-700 shrink-0"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setTaskToEdit(task)
                                  setIsTaskModalOpen(true)
                                }}
                              >
                                <Edit className="w-3.5 h-3.5 mr-2" />
                                Editar Tarefa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletingTask(task)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Excluir Tarefa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          {/* Priority badge */}
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityStyles}`}
                          >
                            {task.priority}
                          </span>

                          <div className="flex items-center gap-2 text-slate-400">
                            {/* Due date */}
                            {task.due_date && (
                              <span
                                className={`flex items-center gap-1 ${overdue ? 'text-red-600 font-semibold' : ''}`}
                              >
                                <Calendar className="w-3 h-3" />
                                {new Date(task.due_date).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                })}
                              </span>
                            )}

                            {/* Assignee Avatar */}
                            {assignee?.expand?.user?.name && (
                              <Avatar
                                className="h-5 w-5 border border-indigo-100"
                                title={assignee.expand.user.name}
                              >
                                <AvatarFallback className="text-[9px] bg-indigo-50 text-indigo-700 font-bold">
                                  {assignee.expand.user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Modal (Create / Edit) */}
      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        taskToEdit={taskToEdit}
        projectId={id!}
        members={members}
        defaultStatus={defaultTaskStatus}
        onSuccess={() => loadProjectData()}
      />

      {/* Project Modal (Edit) */}
      <ProjectModal
        open={isProjectModalOpen}
        onOpenChange={setIsProjectModalOpen}
        projectToEdit={project}
        onSuccess={(updated) => {
          setProject(updated)
          setTitle(updated.name)
        }}
      />

      {/* Confirm Delete Task Dialog */}
      <AlertDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja remover a tarefa <strong>{deletingTask?.title}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
