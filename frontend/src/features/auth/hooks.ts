import { useMutation } from '@tanstack/react-query'
import { authApi, type LoginPayload, type RegisterPayload } from './api'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => setSession(data.accessToken, data.user),
  })
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession)
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => setSession(data.accessToken, data.user),
  })
}

export function useLogout() {
  const clear = useAuthStore((state) => state.clear)
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => clear(),
  })
}

export function useForgotPassword() {
  const push = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (data) => push(data.message, 'success'),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
  })
}

export function useChangePassword() {
  const push = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
    onSuccess: (data) => push(data.message, 'success'),
  })
}
