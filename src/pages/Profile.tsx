import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePage } from '@/contexts/PageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { Loader2, Mail, Shield, User } from 'lucide-react'

export default function Profile() {
  const { user, requestEmailChange, refreshUser } = useAuth()
  const { setTitle, setAction } = usePage()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || '')
  const [newEmail, setNewEmail] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)
  const [isRequestingEmail, setIsRequestingEmail] = useState(false)

  useEffect(() => {
    setTitle('Meu Perfil')
    setAction(null)
  }, [setTitle, setAction])

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
  }, [user])

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSavingName(true)
    try {
      await pb.collection('users').update(user.id, { name })
      await refreshUser()
      toast({
        title: 'Perfil atualizado',
        description: 'Seu nome foi alterado com sucesso.',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao atualizar nome.'
      toast({
        title: 'Erro',
        description: msg,
        variant: 'destructive',
      })
    } finally {
      setIsSavingName(false)
    }
  }

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return

    setIsRequestingEmail(true)
    try {
      await requestEmailChange(newEmail.trim())
      toast({
        title: 'Confirmação enviada',
        description: `Um link de confirmação foi enviado para ${newEmail}.`,
      })
      setNewEmail('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao solicitar alteração de email.'
      toast({
        title: 'Erro',
        description: msg,
        variant: 'destructive',
      })
    } finally {
      setIsRequestingEmail(false)
    }
  }

  const userInitials = (user?.name || user?.email || 'U').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Header Card */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-indigo-200 bg-indigo-100 text-indigo-700 text-xl font-bold">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Usuário'}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Shield className="w-3 h-3" />
              Conta Ativa e Protegida
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>Atualize como você aparece nos projetos e tarefas</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateName}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nome de Exibição</Label>
                <Input
                  id="displayName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentEmail">Email Atual</Label>
                <Input
                  id="currentEmail"
                  value={user?.email || ''}
                  disabled
                  className="bg-slate-50 text-slate-500"
                />
              </div>
              <Button
                type="submit"
                disabled={isSavingName}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSavingName && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Change Email */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Alterar Endereço de Email
            </CardTitle>
            <CardDescription>
              Um link de confirmação será enviado para o novo endereço
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRequestEmailChange}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">Novo Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="novo.email@empresa.com"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">
                Você precisará confirmar o link enviado ao novo email e informar sua senha atual
                para concluir.
              </p>
              <Button
                type="submit"
                disabled={isRequestingEmail}
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                {isRequestingEmail && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Solicitar Mudança de Email
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}
