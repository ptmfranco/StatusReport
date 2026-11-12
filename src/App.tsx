import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// O app "Gestão de Projetos CET 2026 · Rautaki" é o HTML autocontido anexado pelo
// usuário (fonte de verdade), servido como página estática a partir de public/.
// Qualquer rota do React leva até ele: a raiz "/" e todas as demais, pois o HTML
// tem navegação por hash e login próprios (via localStorage).
const ARQUIVO_APP = '/gestao-de-projetos-cet-2026-rautaki-3-e7d21.html'

const IrParaAppOriginal = () => {
  useEffect(() => {
    window.location.replace(ARQUIVO_APP)
  }, [])
  return null
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<IrParaAppOriginal />} />
      <Route path="*" element={<IrParaAppOriginal />} />
    </Routes>
  </BrowserRouter>
)

export default App
