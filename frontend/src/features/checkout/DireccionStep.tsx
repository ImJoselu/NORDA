import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import type { CheckoutFormValues } from './schema'

interface DireccionStepProps {
  register: UseFormRegister<CheckoutFormValues>
  errors: FieldErrors<CheckoutFormValues>
}

export function DireccionStep({ register, errors }: DireccionStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-ink">Dirección de envío</h2>
      <Input label="Dirección" autoComplete="address-line1" error={errors.line1?.message} {...register('line1')} />
      <Input label="Piso, puerta (opcional)" autoComplete="address-line2" error={errors.line2?.message} {...register('line2')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Ciudad" autoComplete="address-level2" error={errors.city?.message} {...register('city')} />
        <Input label="Provincia" autoComplete="address-level1" error={errors.region?.message} {...register('region')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Código postal" autoComplete="postal-code" error={errors.postalCode?.message} {...register('postalCode')} />
        <Input label="País" autoComplete="country-name" error={errors.country?.message} {...register('country')} />
      </div>
    </div>
  )
}
