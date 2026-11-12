import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePage } from '@/contexts/PageContext'
import { tasksService, projectsService } from '@/services/projects'
import { TaskModal } from '@/components/TaskModal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import type { TaskRecord, TaskStatus, TaskPriority, ProjectRecord } from '@/types/database'
import {
  Search,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Edit,
  FolderKanban,
  AlertCircle,
  CheckSquare,
} from 'lucide-react'

export default function Tasks() {
  const { setTitle, setAction } = usePage()
  const { toast } = useToast()

  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')

  // Modais
  const [editingTask, setEditingTask] = useState<TaskRecord | null>(null)
  const [deletingTask, setDeletingTask] = useState<TaskRecord | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [allTasks, allProjects] = await Promise.all([
        tasksService.listAll(),
        projectsService.list(),
      ])
      setTasks(allTasks)
      setProjects(allProjects)
    } catch (err) {
      console.error('Erro ao carregar tarefas', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setTitle('Tarefas')
    setAction(null)
  }, [setTitle, setAction])

  const handleToggleDone = async (task: TaskRecord) => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done'
    try {
      const updated = await tasksService.update(task.id, { status: newStatus })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))
      toast({
        title: newStatus === 'done' ? 'Tarefa concluída!' : 'Tarefa reaberta',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao atualizar tarefa.'
      toast({ title: 'Erro', description: msg, variant: 'destructive' })
    }
  }

  const handleDelete = async () => {
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

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
    const matchesProject = projectFilter === 'all' || t.project === projectFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  const isOverdue = (dueDate?: string, status?: TaskStatus) => {
    if (!dueDate || status === 'done') return false
    const due = new Date(dueDate)
    const now = new Date()
    return due < now
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status */}
        <Select value={statusFilter} onValueChange={(v: 'all' | TaskStatus) => setStatusFilter(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="todo">A Fazer</SelectItem>
            <SelectItem value="doing">Em Andamento</SelectItem>
            <SelectItem value="done">Concluído</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={priorityFilter}
          onValueChange={(v: 'all' | TaskPriority) => setPriorityFilter(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Prioridades</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        {/* Project */}
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Projetos</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
        <CardContent className="p-0 divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16 p-6 space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <CheckSquare className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-slate-900">Nenhuma tarefa encontrada</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Tente ajustar os filtros ou acesse o detalhe de um projeto para criar novas tarefas
                no kanban.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const overdue = isOverdue(task.due_date, task.status)
              const project = projects.find((p) => p.id === task.project) || task.expand?.project

              const priorityStyles = {
                alta: 'bg-red-50 text-red-700 border-red-200',
                media: 'bg-amber-50 text-amber-700 border-amber-200',
                baixa: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              }[task.priority]

              const statusLabels = {
                todo: 'A Fazer',
                doing: 'Em Andamento',
                done: 'Concluído',
              }[task.status]

              return (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-slate-50/70 transition-all ${
                    task.status === 'done' ? 'bg-slate-50/30' : ''
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    {/* Animated checkbox */}
                    <button
                      onClick={() => handleToggleDone(task)}
                      className="mt-0.5 sm:mt-0 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                      title={
                        task.status === 'done' ? 'Marcar como pendente' : 'Marcar como concluída'
                      }
                    >
                      {task.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-sm ${
                            task.status === 'done'
                              ? 'line-through text-slate-400'
                              : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityStyles}`}
                        >
                          {task.priority}
                        </span>

                        {/* Overdue Badge */}
                        {overdue && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Atrasada
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end text-xs text-slate-500 pl-8 sm:pl-0">
                    {/* Project link */}
                    {project && (
                      <Link
                        to={`/projetos/${project.id}`}
                        className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-indigo-600 max-w-[150px] truncate"
                      >
                        <FolderKanban className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    )}

                    {/* Due Date */}
                    {task.due_date && (
                      <span
                        className={`inline-flex items-center gap-1 ${overdue ? 'text-red-600 font-semibold' : ''}`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(task.due_date).toLocaleDateString('pt-BR')}
                      </span>
                    )}

                    {/* Status badge */}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {statusLabels}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-slate-700"
                        onClick={() => setEditingTask(task)}
                        title="Editar tarefa"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-red-600"
                        onClick={() => setDeletingTask(task)}
                        title="Excluir tarefa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Modal Editar */}
      {editingTask && (
        <TaskModal
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          taskToEdit={editingTask}
          projectId={editingTask.project}
          onSuccess={() => loadData()}
        />
      )}

      {/* Diálogo de Exclusão */}
      <AlertDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir a tarefa <strong>{deletingTask?.title}</strong>? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
