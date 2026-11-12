import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePage } from '@/contexts/PageContext'
import { projectsService, tasksService } from '@/services/projects'
import { ProjectModal } from '@/components/ProjectModal'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import type { ProjectRecord, TaskRecord, ProjectStatus } from '@/types/database'
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  FolderOpen,
  Users,
  CheckSquare,
} from 'lucide-react'

export default function Projects() {
  const { setTitle, setAction } = usePage()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | ProjectStatus>('todos')

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null)
  const [deletingProject, setDeletingProject] = useState<ProjectRecord | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [allProjects, allTasks] = await Promise.all([
        projectsService.list(),
        tasksService.listAll(),
      ])
      setProjects(allProjects)
      setTasks(allTasks)
    } catch (err) {
      console.error('Erro ao carregar projetos', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setTitle('Projetos')
    setAction({
      label: '+ Novo Projeto',
      onClick: () => {
        setEditingProject(null)
        setIsModalOpen(true)
      },
    })
  }, [setTitle, setAction])

  const handleDelete = async () => {
    if (!deletingProject) return
    try {
      await projectsService.delete(deletingProject.id)
      toast({ title: 'Projeto excluído com sucesso!' })
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id))
      setDeletingProject(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao excluir projeto.'
      toast({ title: 'Erro', description: msg, variant: 'destructive' })
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search & Tabs Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg self-start">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${
              statusFilter === 'todos'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('planejamento')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${
              statusFilter === 'planejamento'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Planejamento
          </button>
          <button
            onClick={() => setStatusFilter('em_andamento')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${
              statusFilter === 'em_andamento'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Em Andamento
          </button>
          <button
            onClick={() => setStatusFilter('concluido')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${
              statusFilter === 'concluido'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Concluídos
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar projetos por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <FolderOpen className="w-7 h-7" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Nenhum projeto encontrado</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm || statusFilter !== 'todos'
                ? 'Tente ajustar os filtros ou o termo de busca.'
                : 'Comece adicionando seu primeiro projeto agora mesmo.'}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProject(null)
              setIsModalOpen(true)
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const projTasks = tasks.filter((t) => t.project === project.id)
            const projDone = projTasks.filter((t) => t.status === 'done').length
            const projProgress =
              projTasks.length > 0 ? Math.round((projDone / projTasks.length) * 100) : 0

            const statusConfig = {
              planejamento: {
                label: 'Planejamento',
                color: 'bg-slate-100 text-slate-700 border-slate-200',
              },
              em_andamento: {
                label: 'Em Andamento',
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              },
              concluido: {
                label: 'Concluído',
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              },
            }[project.status]

            const ownerName = project.expand?.owner?.name || project.expand?.owner?.email || 'Admin'
            const ownerInitials = ownerName.slice(0, 2).toUpperCase()

            return (
              <Card
                key={project.id}
                className="group border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col cursor-pointer overflow-hidden bg-white"
                onClick={() => navigate(`/projetos/${project.id}`)}
              >
                {/* Colored Top Bar */}
                <div
                  className="h-2 w-full transition-all"
                  style={{ backgroundColor: project.cover_color || '#4F46E5' }}
                />

                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1 min-w-0 pr-2">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig.color} mb-1`}
                    >
                      {statusConfig.label}
                    </span>
                    <CardTitle className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {project.name}
                    </CardTitle>
                  </div>

                  {/* Actions Dropdown */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-slate-700"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingProject(project)
                            setIsModalOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Projeto
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletingProject(project)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir Projeto
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                    {project.description || 'Sem descrição cadastrada.'}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Progresso</span>
                      <span className="text-slate-900 font-semibold">{projProgress}%</span>
                    </div>
                    <Progress value={projProgress} className="h-2" />
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-slate-200">
                      <AvatarFallback className="text-[10px] bg-slate-100 font-bold text-slate-600">
                        {ownerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[120px] font-medium">{ownerName}</span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {projDone}/{projTasks.length}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal Criar/Editar */}
      <ProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        projectToEdit={editingProject}
        onSuccess={() => loadData()}
      />

      {/* Diálogo de Exclusão */}
      <AlertDialog
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Projeto?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir o projeto <strong>{deletingProject?.name}</strong>?
              Esta ação removerá permanentemente o projeto e todas as suas tarefas vinculadas.
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
