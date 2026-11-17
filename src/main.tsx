/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'

// @skip-protected: Do not remove. Required for React rendering.
createRoot(document.getElementById('root')!).render(<App />)

// Injeta a URL do PocketBase para o HTML original (fonte de verdade),
// que lê window.__PB_URL__ / localStorage '__PB_URL__' (pbBase()).
try {
  const pbUrl = import.meta.env.VITE_POCKETBASE_URL || ''
  if (pbUrl) localStorage.setItem('__PB_URL__', pbUrl)
} catch {
  /* intentionally ignored */
}
