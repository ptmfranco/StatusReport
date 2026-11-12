// Toasts do sistema (pilha no canto inferior direito, padrão do original)
import { createContext, useCallback, useContext, useState, ReactNode } from 'react'

interface Toast {
  id: number
  msg: string
  tipo: 'ok' | 'erro' | 'info'
}

const Ctx = createContext<{ toast: (msg: string, tipo?: Toast['tipo']) => void } | null>(null)

let contador = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<Toast[]>([])

  const toast = useCallback((msg: string, tipo: Toast['tipo'] = 'ok') => {
    const id = contador++
    setItens((prev) => [...prev, { id, msg, tipo }])
    setTimeout(() => setItens((prev) => prev.filter((t) => t.id !== id)), 4200)
  }, [])

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-32px))]"
        aria-live="polite"
      >
        {itens.map((t) => (
          <div
            key={t.id}
            className={
              'rounded-lg px-4 py-3 text-sm shadow-lg border animate-fade-in ' +
              (t.tipo === 'erro'
                ? 'bg-red-50 border-red-200 text-red-700'
                : t.tipo === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800')
            }
          >
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToastRautaki() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useToastRautaki fora do provedor')
  return v.toast
}
