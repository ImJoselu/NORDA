import { Badge } from '@/components/ui/Badge'
import { ApiError } from '@/services/httpClient'

interface PagoStepProps {
  isPending: boolean
  error: unknown
}

export function PagoStep({ isPending, error }: PagoStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-ink">Pago</h2>
      <Badge tone="warning">Modo demo</Badge>
      <p className="text-sm text-ink-soft">
        NØRDA está en modo demostración: no se realizará ningún cargo real ni se solicitarán datos de tarjeta.
        Al confirmar, se simulará el pago y se creará tu pedido.
      </p>
      {isPending && <p className="text-sm text-ink-soft">Procesando pago…</p>}
      {Boolean(error) && (
        <p className="text-sm text-danger" role="alert">
          {error instanceof ApiError ? error.message : 'No se pudo procesar el pago.'}
        </p>
      )}
    </div>
  )
}
