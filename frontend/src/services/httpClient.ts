import { env } from '@/config/env'
import { useAuthStore } from '@/store/authStore'
import type { AuthResponse } from '@/types/auth'

export class ApiError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

interface RequestOptions extends RequestInit {
  skipAuthRetry?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuthRetry, headers: rawHeaders, ...init } = options
  const headers = new Headers(rawHeaders)
  headers.set('Content-Type', 'application/json')

  const token = useAuthStore.getState().accessToken
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  if (response.status === 401 && !skipAuthRetry && path !== '/auth/refresh') {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return request<T>(path, { ...options, skipAuthRetry: true })
    }
    useAuthStore.getState().clear()
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      body?.code ?? 'UNKNOWN',
      body?.message ?? 'Ha ocurrido un error inesperado.',
    )
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export async function tryRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${env.apiUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) return false

    const data = (await response.json()) as AuthResponse
    useAuthStore.getState().setSession(data.accessToken, data.user)
    return true
  } catch {
    return false
  }
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
