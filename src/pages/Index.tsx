import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePage } from '@/contexts/PageContext'
import { useAuth } from '@/contexts/AuthContext'
import { projectsService, tasksService } from '@/services/projects'
import { ProjectModal } from '@/components/ProjectModal'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProjectRecord, TaskRecord } from '@/types/database'
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  FolderOpen,
} from 'lucide-react'

// Hook simples de CountUp animado
function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const stepTime = 16
    const totalSteps = Math.max(1, Math.floor(duration / stepTime))
    const increment = target / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [target, duration])

  return count
}

export default function Index() {
  const { user } = useAuth()
  const { setTitle, setAction } = usePage()
  const navigate = useNavigate()

  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      console.error('Erro ao carregar dashboard', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setTitle('Dashboard')
    setAction({
      label: '+ Novo Projeto',
      onClick: () => setIsModalOpen(true),
    })
  }, [setTitle, setAction])

  // Métricas
  const activeProjectsCount = projects.filter((p) => p.status !== 'concluido').length
  const pendingTasksCount = tasks.filter((t) => t.status === 'todo' || t.status === 'doing').length
  const doneTasksCount = tasks.filter((t) => t.status === 'done').length
  const totalTasks = tasks.length
  const overallProgress = totalTasks > 0 ? Math.round((doneTasksCount / totalTasks) * 100) : 0

  const activeProjectsAnimated = useCountUp(activeProjectsCount)
  const pendingTasksAnimated = useCountUp(pendingTasksCount)
  const doneTasksAnimated = useCountUp(doneTasksCount)
  const progressAnimated = useCountUp(overallProgress)

  // Status breakdown para o gráfico
  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const doingCount = tasks.filter((t) => t.status === 'doing').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Olá, {user?.name?.split(' ')[0] || 'Usuário'}!
          </h2>
          <p className="text-sm text-slate-500 capitalize mt-1">
            {todayFormatted} • Acompanhe o andamento geral dos seus projetos
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-slate-200 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Projetos Ativos
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{activeProjectsAnimated}</p>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {projects.length} no total
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tarefas Pendentes
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{pendingTasksAnimated}</p>
                  <span className="text-xs text-amber-600 font-medium mt-1 block">
                    A Fazer e Em Andamento
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tarefas Concluídas
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{doneTasksAnimated}</p>
                  <span className="text-xs text-emerald-600 font-medium mt-1 block">
                    Entregues com sucesso
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Progresso Geral
                  </p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">{progressAnimated}%</p>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Taxa global de conclusão
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut distribution representation */}
        <Card className="border-slate-200 shadow-xs bg-white lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Tarefas</CardTitle>
            <CardDescription>Status atual de todas as atividades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {totalTasks === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">
                Nenhuma tarefa cadastrada ainda.
              </p>
            ) : (
              <>
                {/* SVG Doughnut chart */}
                <div className="relative flex items-center justify-center py-2">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <path
                      className="text-slate-100"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Todo segment (slate) */}
                    <path
                      className="text-slate-400 transition-all duration-1000"
                      strokeDasharray={`${(todoCount / totalTasks) * 100}, 100`}
                      strokeDashoffset="0"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Doing segment (indigo) */}
                    <path
                      className="text-indigo-600 transition-all duration-1000"
                      strokeDasharray={`${(doingCount / totalTasks) * 100}, 100`}
                      strokeDashoffset={`${-((todoCount / totalTasks) * 100)}`}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Done segment (emerald) */}
                    <path
                      className="text-emerald-500 transition-all duration-1000"
                      strokeDasharray={`${(doneCount / totalTasks) * 100}, 100`}
                      strokeDashoffset={`${-(((todoCount + doingCount) / totalTasks) * 100)}`}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-slate-900">{totalTasks}</span>
                    <span className="text-xs text-slate-400">Total</span>
                  </div>
                </div>

                {/* Legend with percentages */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-400" />
                      <span className="text-slate-600 font-medium">A Fazer</span>
                    </span>
                    <span className="font-semibold text-slate-900">
                      {todoCount} ({totalTasks > 0 ? Math.round((todoCount / totalTasks) * 100) : 0}
                      %)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-indigo-600" />
                      <span className="text-slate-600 font-medium">Em Andamento</span>
                    </span>
                    <span className="font-semibold text-slate-900">
                      {doingCount} (
                      {totalTasks > 0 ? Math.round((doingCount / totalTasks) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-slate-600 font-medium">Concluído</span>
                    </span>
                    <span className="font-semibold text-slate-900">
                      {doneCount} ({totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0}
                      %)
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects List */}
        <Card className="border-slate-200 shadow-xs bg-white lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Projetos Recentes</CardTitle>
              <CardDescription>Acesse e gerencie seus quadros de trabalho</CardDescription>
            </div>
            <Link
              to="/projetos"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FolderOpen className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Nenhum projeto ainda</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                    Crie seu primeiro projeto para começar a organizar tarefas em um quadro kanban
                    visual.
                  </p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Criar primeiro projeto
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 4).map((project) => {
                  const projTasks = tasks.filter((t) => t.project === project.id)
                  const projDone = projTasks.filter((t) => t.status === 'done').length
                  const projProgress =
                    projTasks.length > 0 ? Math.round((projDone / projTasks.length) * 100) : 0

                  const statusConfig = {
                    planejamento: {
                      label: 'Planejamento',
                      variant: 'secondary' as const,
                      color: 'bg-slate-100 text-slate-700',
                    },
                    em_andamento: {
                      label: 'Em Andamento',
                      variant: 'default' as const,
                      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    },
                    concluido: {
                      label: 'Concluído',
                      variant: 'outline' as const,
                      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    },
                  }[project.status]

                  return (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/projetos/${project.id}`)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-3.5 h-10 rounded-md shrink-0"
                          style={{ backgroundColor: project.cover_color || '#4F46E5' }}
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {project.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {project.description || 'Sem descrição cadastrada'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>

                        <div className="w-28 sm:w-32 space-y-1">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>
                              {projDone}/{projTasks.length} tarefas
                            </span>
                            <span className="font-semibold text-slate-700">{projProgress}%</span>
                          </div>
                          <Progress value={projProgress} className="h-1.5" />
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProjectModal open={isModalOpen} onOpenChange={setIsModalOpen} onSuccess={() => loadData()} />
    </div>
  )
}
