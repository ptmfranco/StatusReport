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
import { projectsService } from '@/services/projects'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import type { ProjectRecord, ProjectStatus } from '@/types/database'
import { Loader2 } from 'lucide-react'

interface ProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectToEdit?: ProjectRecord | null
  onSuccess: (project: ProjectRecord) => void
}

const COLOR_OPTIONS = [
  { label: 'Índigo', hex: '#4F46E5' },
  { label: 'Azul Celeste', hex: '#0EA5E9' },
  { label: 'Verde Petróleo', hex: '#14B8A6' },
  { label: 'Âmbar', hex: '#F59E0B' },
  { label: 'Rosa Coral', hex: '#F43F5E' },
  { label: 'Roxo Violeta', hex: '#8B5CF6' },
]

export const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onOpenChange,
  projectToEdit,
  onSuccess,
}) => {
  const { user } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState(projectToEdit?.name || '')
  const [description, setDescription] = useState(projectToEdit?.description || '')
  const [status, setStatus] = useState<ProjectStatus>(projectToEdit?.status || 'planejamento')
  const [coverColor, setCoverColor] = useState(projectToEdit?.cover_color || '#4F46E5')
  const [isLoading, setIsLoading] = useState(false)

  // Reset fields when opened/changed
  React.useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name)
      setDescription(projectToEdit.description || '')
      setStatus(projectToEdit.status)
      setCoverColor(projectToEdit.cover_color || '#4F46E5')
    } else {
      setName('')
      setDescription('')
      setStatus('planejamento')
      setCoverColor('#4F46E5')
    }
  }, [projectToEdit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (!user) return

    setIsLoading(true)
    try {
      if (projectToEdit) {
        const updated = await projectsService.update(projectToEdit.id, {
          name: name.trim(),
          description: description.trim(),
          status,
          cover_color: coverColor,
        })
        toast({ title: 'Projeto atualizado com sucesso!' })
        onSuccess(updated)
      } else {
        const created = await projectsService.create({
          name: name.trim(),
          description: description.trim(),
          status,
          owner: user.id,
          cover_color: coverColor,
        })
        // Adiciona o criador como membro do projeto
        try {
          await projectsService.addMember(created.id, user.id, 'Líder de Projeto')
        } catch {
          /* intentionally ignored */
        }
        toast({ title: 'Projeto criado com sucesso!' })
        onSuccess(created)
      }
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar projeto.'
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
            <DialogTitle>{projectToEdit ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
            <DialogDescription>
              {projectToEdit
                ? 'Atualize os dados e o status do projeto.'
                : 'Defina os detalhes fundamentais para iniciar o acompanhamento.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="proj-name">Nome do Projeto *</Label>
              <Input
                id="proj-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lançamento do Novo Site"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-desc">Descrição</Label>
              <Textarea
                id="proj-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Objetivo principal, escopo e entregáveis esperados..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(val: ProjectStatus) => setStatus(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cor do Cartão</Label>
                <div className="flex items-center gap-2 pt-1">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      title={c.label}
                      onClick={() => setCoverColor(c.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        coverColor === c.hex
                          ? 'border-slate-900 scale-110 shadow-xs'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
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
              disabled={isLoading || !name.trim()}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {projectToEdit ? 'Salvar Alterações' : 'Criar Projeto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
