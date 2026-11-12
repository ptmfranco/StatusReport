import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { tasksService } from '@/services/projects'
import { useToast } from '@/hooks/use-toast'
import type { TaskRecord, TaskStatus, TaskPriority, ProjectMemberRecord } from '@/types/database'
import { Loader2 } from 'lucide-react'

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskToEdit?: TaskRecord | null
  projectId: string
  members?: ProjectMemberRecord[]
  defaultStatus?: TaskStatus
  onSuccess: (task: TaskRecord) => void
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onOpenChange,
  taskToEdit,
  projectId,
  members = [],
  defaultStatus = 'todo',
  onSuccess,
}) => {
  const { toast } = useToast()

  const [title, setTitle] = useState(taskToEdit?.title || '')
  const [description, setDescription] = useState(taskToEdit?.description || '')
  const [status, setStatus] = useState<TaskStatus>(taskToEdit?.status || defaultStatus)
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || 'media')
  const [assignedTo, setAssignedTo] = useState<string>(taskToEdit?.assigned_to || 'unassigned')
  const [dueDate, setDueDate] = useState<string>(
    taskToEdit?.due_date ? taskToEdit.due_date.slice(0, 10) : '',
  )
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description || '')
      setStatus(taskToEdit.status)
      setPriority(taskToEdit.priority)
      setAssignedTo(taskToEdit.assigned_to || 'unassigned')
      setDueDate(taskToEdit.due_date ? taskToEdit.due_date.slice(0, 10) : '')
    } else {
      setTitle('')
      setDescription('')
      setStatus(defaultStatus)
      setPriority('media')
      setAssignedTo('unassigned')
      setDueDate('')
    }
  }, [taskToEdit, defaultStatus, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      const payload: Partial<TaskRecord> = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        project: projectId,
        assigned_to: assignedTo === 'unassigned' ? undefined : assignedTo,
        due_date: dueDate ? `${dueDate} 18:00:00.000Z` : undefined,
      }

      if (taskToEdit) {
        const updated = await tasksService.update(taskToEdit.id, payload)
        toast({ title: 'Tarefa atualizada com sucesso!' })
        onSuccess(updated)
      } else {
        const created = await tasksService.create({
          ...payload,
          order: Date.now(),
        })
        toast({ title: 'Tarefa criada com sucesso!' })
        onSuccess(created)
      }
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar tarefa.'
      toast({
        title: 'Erro ao salvar',
        description: msg,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
            <DialogDescription>
              {taskToEdit
                ? 'Atualize os dados, responsável ou prazo da tarefa.'
                : 'Adicione uma nova tarefa ao projeto.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Título da Tarefa *</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Desenvolver componente de header"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-desc">Descrição / Detalhes</Label>
              <Textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Critérios de aceitação, dependências ou notas..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(val: TaskStatus) => setStatus(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">A Fazer</SelectItem>
                    <SelectItem value="doing">Em Andamento</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={priority} onValueChange={(val: TaskPriority) => setPriority(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Atribuir a..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Nenhum responsável</SelectItem>
                    {members.map((m) => (
                      <SelectItem key={m.user} value={m.user}>
                        {m.expand?.user?.name || m.expand?.user?.email || 'Membro'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-due">Prazo de Entrega</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading || !title.trim()}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
