import { create } from 'zustand'
import type { UserSummary } from '@/types/auth'

type AuthStatus = 'idle' | 'authenticated' | 'anonymous'

interface AuthState {
  accessToken: string | null
  user: UserSummary | null
  status: AuthStatus
  setSession: (accessToken: string, user: UserSummary) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: 'idle',
  setSession: (accessToken, user) => set({ accessToken, user, status: 'authenticated' }),
  clear: () => set({ accessToken: null, user: null, status: 'anonymous' }),
}))
