import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCart } from '@/features/cart/hooks'
import { useCheckout } from '@/features/orders/hooks'
import { CheckoutSummary } from './CheckoutSummary'
import { ConfirmacionStep } from './ConfirmacionStep'
import { DatosStep } from './DatosStep'
import { DireccionStep } from './DireccionStep'
import { EnvioStep } from './EnvioStep'
import { PagoStep } from './PagoStep'
import { checkoutSchema, DATOS_FIELDS, DIRECCION_FIELDS, ENVIO_FIELDS, type CheckoutFormValues } from './schema'
import { estimateShippingCents } from './shippingEstimate'

const STEP_TITLES = ['Datos', 'Dirección', 'Envío', 'Pago', 'Confirmación']

export function CheckoutWizard() {
  const [step, setStep] = useState(0)
  const { data: cart, isLoading: isCartLoading } = useCart()
  const checkout = useCheckout()

  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'España', shippingMethod: 'STANDARD' },
  })

  const shippingMethod = watch('shippingMethod')

  if (isCartLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (checkout.isSuccess) {
    return <ConfirmacionStep order={checkout.data} />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-ink-soft">Tu carrito está vacío.</p>
        <Link to="/coffee">
          <Button>Explorar cafés</Button>
        </Link>
      </div>
    )
  }

  const shippingCents = estimateShippingCents(shippingMethod, cart.subtotalCents)

  async function goNext() {
    const fieldsToValidate =
      step === 0 ? DATOS_FIELDS : step === 1 ? DIRECCION_FIELDS : step === 2 ? ENVIO_FIELDS : []
    const valid = await trigger(fieldsToValidate as (keyof CheckoutFormValues)[])
    if (valid) setStep((s) => s + 1)
  }

  function onSubmit(values: CheckoutFormValues) {
    checkout.mutate({
      shippingAddress: {
        fullName: values.fullName,
        phone: values.phone,
        line1: values.line1,
        line2: values.line2,
        city: values.city,
        region: values.region,
        postalCode: values.postalCode,
        country: values.country,
      },
      shippingMethod: values.shippingMethod,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-8">
        <ProgressBar current={step} total={STEP_TITLES.length} label={`Paso ${step + 1} de ${STEP_TITLES.length}: ${STEP_TITLES[step]}`} />

        <form onSubmit={(event) => event.preventDefault()}>
          {step === 0 && <DatosStep register={register} errors={errors} />}
          {step === 1 && <DireccionStep register={register} errors={errors} />}
          {step === 2 && (
            <EnvioStep
              value={shippingMethod}
              onChange={(method) => setValue('shippingMethod', method)}
              subtotalCents={cart.subtotalCents}
            />
          )}
          {step === 3 && <PagoStep isPending={checkout.isPending} error={checkout.error} />}

          <div className="mt-8 flex justify-between">
            <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Atrás
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={goNext}>
                Siguiente
              </Button>
            ) : (
              <Button type="button" disabled={checkout.isPending} onClick={handleSubmit(onSubmit)}>
                {checkout.isPending ? 'Procesando…' : 'Confirmar y pagar'}
              </Button>
            )}
          </div>
        </form>
      </div>

      <CheckoutSummary items={cart.items} subtotalCents={cart.subtotalCents} shippingCents={shippingCents} />
    </div>
  )
}
