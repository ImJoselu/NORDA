import { httpClient } from '@/services/httpClient'
import type { AuthResponse } from '@/types/auth'

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  register: (payload: RegisterPayload) => httpClient.post<AuthResponse>('/auth/register', payload),
  login: (payload: LoginPayload) => httpClient.post<AuthResponse>('/auth/login', payload),
  logout: () => httpClient.post<void>('/auth/logout'),
  forgotPassword: (email: string) =>
    httpClient.post<{ message: string }>('/auth/password/forgot', { email }),
  resetPassword: (token: string, newPassword: string) =>
    httpClient.post<{ message: string }>('/auth/password/reset', { token, newPassword }),
  changePassword: (currentPassword: string, newPassword: string) =>
    httpClient.post<{ message: string }>('/auth/password/change', { currentPassword, newPassword }),
}
