import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { tryRefresh } from '@/services/httpClient'

/**
 * Al cargar la app, intenta restaurar la sesion con el refresh token
 * (cookie httpOnly). El access token nunca se persiste en el navegador.
 */
export function useAuthBootstrap() {
  const status = useAuthStore((state) => state.status)

  useEffect(() => {
    if (status !== 'idle') return
    tryRefresh().then((success) => {
      if (!success) useAuthStore.getState().clear()
    })
  }, [status])
}
