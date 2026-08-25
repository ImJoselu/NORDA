import { Card } from '@/components/ui/Card'
import { ResetPasswordForm } from '@/features/auth/ResetPasswordForm'

export function ResetPassword() {
  return (
    <section className="mx-auto flex max-w-md flex-col gap-8 px-6 py-24">
      <div>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">NØRDA</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Nueva contraseña</h1>
      </div>
      <Card className="p-8">
        <ResetPasswordForm />
      </Card>
    </section>
  )
}
