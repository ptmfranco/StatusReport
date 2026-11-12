import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FolderKanban, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ConfirmEmailChange() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { confirmEmailChange } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!token) {
      setErrorMessage('Token de confirmação não encontrado na URL.')
      return
    }
    if (!password) {
      setErrorMessage('Por favor, informe sua senha atual para confirmar a troca.')
      return
    }

    setIsLoading(true)
    try {
      await confirmEmailChange(token, password)
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao confirmar a alteração de email.'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md">
            <FolderKanban className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Confirmar Novo Email</h1>
          <p className="text-sm text-slate-500">Finalize a alteração do seu endereço de email</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          {isSuccess ? (
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Email Alterado com Sucesso!</h2>
              <p className="text-sm text-slate-600">
                Seu novo email foi ativado. Você foi desconectado e deve fazer login novamente.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Ir para o Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Confirmação de Segurança</CardTitle>
                <CardDescription>
                  Informe sua senha atual para confirmar a mudança de email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorMessage && (
                  <div className="p-3 text-sm rounded-lg bg-red-50 text-red-600 border border-red-200">
                    {errorMessage}
                  </div>
                )}
                {!token && (
                  <div className="p-3 text-sm rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                    Nenhum token fornecido na URL. Verifique o link enviado ao seu novo email.
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Senha Atual</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  disabled={isLoading || !token}
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirmar Novo Email
                </Button>
                <Link
                  to="/"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 text-center"
                >
                  Voltar para o Dashboard
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
