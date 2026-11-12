import React, { createContext, useContext, useState } from 'react'

interface HeaderAction {
  label: string
  onClick: () => void
  icon?: React.ReactNode
}

interface PageContextType {
  title: string
  setTitle: (title: string) => void
  action: HeaderAction | null
  setAction: (action: HeaderAction | null) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState<string>('Dashboard')
  const [action, setAction] = useState<HeaderAction | null>(null)

  return (
    <PageContext.Provider value={{ title, setTitle, action, setAction }}>
      {children}
    </PageContext.Provider>
  )
}

export const usePage = () => {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePage deve ser utilizado dentro de um PageProvider')
  }
  return context
}
