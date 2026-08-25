import { useEffect } from 'react'
import { useToastStore, type ToastTone } from '@/store/toastStore'

const TONE_CLASSES: Record<ToastTone, string> = {
  success: 'bg-success text-paper',
  error: 'bg-danger text-paper',
  info: 'bg-ink text-paper',
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={['pointer-events-auto rounded-lg px-4 py-3 text-sm shadow-sm', TONE_CLASSES[toast.tone]].join(' ')}
        >
          <ToastAutoDismiss id={toast.id} onDismiss={dismiss} />
          {toast.message}
        </div>
      ))}
    </div>
  )
}

function ToastAutoDismiss({ id, onDismiss }: { id: string; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return null
}
