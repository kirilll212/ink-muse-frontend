import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi } from '../api/auth'
import { TOKEN_STORAGE_KEY } from '../api/client'
import type { AuthResponse, User } from '../types'

/** Authentication lifecycle status. */
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: User | null
  status: AuthStatus
  login: (email: string, password: string) => Promise<void>
  register: (input: { fullName: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Holds the authenticated user and exposes login / register / logout actions.
 *
 * On mount it validates any persisted token by calling `/auth/me`, so a stale
 * token never leaves the app in a broken "logged in" state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      setStatus('unauthenticated')
      return
    }

    authApi
      .me()
      .then((me) => {
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setStatus('unauthenticated')
      })
  }, [])

  /** Persist a successful auth response into state and storage. */
  const persistSession = (response: AuthResponse) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
    setUser(response.user)
    setStatus('authenticated')
  }

  const login = async (email: string, password: string) => {
    persistSession(await authApi.login({ email, password }))
  }

  const register = async (input: { fullName: string; email: string; password: string }) => {
    persistSession(await authApi.register(input))
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Even if the server call fails, drop the local session.
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setUser(null)
    setStatus('unauthenticated')
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Access the auth context.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
