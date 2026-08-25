import { Card } from '@/components/ui/Card'
import { LoginForm } from '@/features/auth/LoginForm'

export function Login() {
  return (
    <section className="mx-auto flex max-w-md flex-col gap-8 px-6 py-24">
      <div>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">NØRDA</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Inicia sesión</h1>
      </div>
      <Card className="p-8">
        <LoginForm />
      </Card>
    </section>
  )
}
