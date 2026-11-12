import React, { createContext, useContext, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import type { UserRecord } from '@/types/database'

interface AuthContextType {
  user: UserRecord | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, pass: string) => Promise<void>
  signup: (name: string, email: string, pass: string) => Promise<void>
  logout: () => void
  requestPasswordReset: (email: string) => Promise<void>
  confirmPasswordReset: (token: string, newPass: string) => Promise<void>
  confirmVerification: (token: string) => Promise<void>
  requestEmailChange: (newEmail: string) => Promise<void>
  confirmEmailChange: (token: string, password: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserRecord | null>(
    (pb.authStore.record as unknown as UserRecord) || null,
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setUser((pb.authStore.record as unknown as UserRecord) || null)
    setIsLoading(false)

    const unsubscribe = pb.authStore.onChange((_, model) => {
      setUser((model as unknown as UserRecord) || null)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const refreshUser = async () => {
    if (pb.authStore.isValid && pb.authStore.record) {
      try {
        const refreshed = await pb.collection('users').getOne<UserRecord>(pb.authStore.record.id)
        setUser(refreshed)
      } catch (_) {
        setUser((pb.authStore.record as unknown as UserRecord) || null)
      }
    }
  }

  const login = async (email: string, pass: string) => {
    const authData = await pb.collection('users').authWithPassword(email, pass)
    setUser(authData.record as unknown as UserRecord)
  }

  const signup = async (name: string, email: string, pass: string) => {
    await pb.collection('users').create({
      name,
      email,
      password: pass,
      passwordConfirm: pass,
    })
    try {
      await pb.collection('users').requestVerification(email)
    } catch {
      /* intentionally ignored */
    }
    await login(email, pass)
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
  }

  const requestPasswordReset = async (email: string) => {
    await pb.collection('users').requestPasswordReset(email)
  }

  const confirmPasswordReset = async (token: string, newPass: string) => {
    await pb.collection('users').confirmPasswordReset(token, newPass, newPass)
  }

  const confirmVerification = async (token: string) => {
    await pb.collection('users').confirmVerification(token)
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh()
    }
  }

  const requestEmailChange = async (newEmail: string) => {
    await pb.collection('users').requestEmailChange(newEmail)
  }

  const confirmEmailChange = async (token: string, password: string) => {
    await pb.collection('users').confirmEmailChange(token, password)
    logout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && pb.authStore.isValid,
        login,
        signup,
        logout,
        requestPasswordReset,
        confirmPasswordReset,
        confirmVerification,
        requestEmailChange,
        confirmEmailChange,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}
