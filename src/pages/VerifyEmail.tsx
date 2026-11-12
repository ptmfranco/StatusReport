import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FolderKanban, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { confirmVerification } = useAuth()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Token de verificação ausente na URL.')
      return
    }

    const run = async () => {
      try {
        await confirmVerification(token)
        setStatus('success')
      } catch (err: unknown) {
        setStatus('error')
        const msg = err instanceof Error ? err.message : 'Falha ao confirmar verificação de email.'
        setErrorMessage(msg)
      }
    }

    run()
  }, [token, confirmVerification])

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md">
            <FolderKanban className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verificação de Email</h1>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6 text-center space-y-4">
            {status === 'loading' && (
              <div className="py-8 space-y-3">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                <p className="text-sm text-slate-600">Validando seu token de confirmação...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Email Verificado com Sucesso!
                </h2>
                <p className="text-sm text-slate-600">
                  Sua conta está ativa e verificada. Você já pode acessar todas as funcionalidades
                  da aplicação.
                </p>
                <div className="pt-2">
                  <Link to="/">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      Ir para o Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Não foi possível verificar</h2>
                <p className="text-sm text-slate-600">
                  {errorMessage ||
                    'O link de verificação pode ter expirado ou já ter sido utilizado.'}
                </p>
                <div className="pt-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Voltar ao Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
