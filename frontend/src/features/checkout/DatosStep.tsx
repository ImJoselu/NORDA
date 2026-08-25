import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import type { CheckoutFormValues } from './schema'

interface DatosStepProps {
  register: UseFormRegister<CheckoutFormValues>
  errors: FieldErrors<CheckoutFormValues>
}

export function DatosStep({ register, errors }: DatosStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-ink">Tus datos</h2>
      <Input label="Nombre completo" autoComplete="name" error={errors.fullName?.message} {...register('fullName')} />
      <Input label="Teléfono" type="tel" autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
    </div>
  )
}
