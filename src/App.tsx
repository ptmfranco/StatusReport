import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// O app "Gestão de Projetos CET 2026 · Rautaki" é o HTML autocontido anexado pelo
// usuário (fonte de verdade). Importado como URL de asset: o Vite o copia íntegro
// para o build, sem reescrita, e ele tem navegação por hash e login próprios.
import APP_HTML_URL from './assets/gestao-de-projetos-cet-2026-rautaki-3-6a4d2.html?url'

const IrParaAppOriginal = () => {
  useEffect(() => {
    window.location.replace(APP_HTML_URL)
  }, [])
  return null
}

// Qualquer rota (a raiz "/" e as demais) leva ao HTML principal; nenhuma serve o HTML anterior.
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<IrParaAppOriginal />} />
      <Route path="*" element={<IrParaAppOriginal />} />
    </Routes>
  </BrowserRouter>
)

export default App
