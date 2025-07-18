import { create } from 'zustand'

// Interface for the decoded JWT payload
interface JwtPayload {
  role?: string // Optional in case token is malformed
  [key: string]: unknown // Allow extra properties
}

// Type guard to validate decoded token shape
function isJwtPayload(payload: unknown): payload is JwtPayload {
  return typeof payload === 'object' && payload !== null
}

// Helper function to decode JWT token
const decodeToken = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    const parsed = JSON.parse(jsonPayload)
    return isJwtPayload(parsed) ? parsed : null
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

// Zustand store types
interface CredentialState {
  token: string | null
  isAuth: boolean
  role: 'user' | 'provider' | undefined
  setToken: (token: string | null) => void
  clearAuth: () => void
}

export const useCredential = create<CredentialState>((set) => ({
  token: null,
  isAuth: false,
  role: undefined,

  setToken: (token: string | null) => {
    if (token) {
      const decoded = decodeToken(token)
      const role = (decoded?.role ?? undefined) as
        | 'user'
        | 'provider'
        | undefined

      set({
        token,
        isAuth: true,
        role,
      })
    } else {
      set({
        token: null,
        isAuth: false,
        role: undefined,
      })
    }
  },

  clearAuth: () => {
    set({
      token: null,
      isAuth: false,
      role: undefined,
    })
  },
}))
