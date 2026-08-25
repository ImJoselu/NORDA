import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ApiError } from '@/services/httpClient'
import type { AcidityPreference, BodyPreference, BudgetRange, FinderRequest, FlavorProfile } from '@/types/finder'
import type { BrewMethod } from '@/types/catalog'
import { ChoiceStep } from './ChoiceStep'
import { FinderResults } from './FinderResults'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ACIDITY_OPTIONS, BODY_OPTIONS, BUDGET_OPTIONS, METHOD_OPTIONS, PROFILE_OPTIONS } from './options'
import { useFinder } from './hooks'

interface WizardState {
  method?: BrewMethod
  profiles: FlavorProfile[]
  body?: BodyPreference
  acidity?: AcidityPreference
  budget?: BudgetRange
}

const EMPTY_STATE: WizardState = { profiles: [] }
const TOTAL_STEPS = 5

function toggleInArray<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function FinderWizard() {
  const [step, setStep] = useState(0)
  const [state, setState] = useState<WizardState>(EMPTY_STATE)
  const finder = useFinder()

  function restart() {
    finder.reset()
    setState(EMPTY_STATE)
    setStep(0)
  }

  if (finder.isSuccess) {
    return <FinderResults results={finder.data} onRestart={restart} />
  }

  const canProceed =
    (step === 0 && Boolean(state.method)) ||
    (step === 1 && state.profiles.length > 0) ||
    (step === 2 && Boolean(state.body)) ||
    (step === 3 && Boolean(state.acidity)) ||
    (step === 4 && Boolean(state.budget))

  function submit() {
    if (!state.method || !state.body || !state.acidity || !state.budget) return
    const request: FinderRequest = {
      method: state.method,
      profiles: state.profiles,
      body: state.body,
      acidity: state.acidity,
      budget: state.budget,
    }
    finder.mutate(request)
  }

  return (
    <div className="flex flex-col gap-10">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {step === 0 && (
        <ChoiceStep
          title="¿Qué método utilizas?"
          options={METHOD_OPTIONS}
          selected={state.method ? [state.method] : []}
          onToggle={(value) => setState((s) => ({ ...s, method: value as BrewMethod }))}
        />
      )}
      {step === 1 && (
        <ChoiceStep
          title="¿Qué perfiles te gustan?"
          subtitle="Puedes elegir varios."
          options={PROFILE_OPTIONS}
          selected={state.profiles}
          onToggle={(value) => setState((s) => ({ ...s, profiles: toggleInArray(s.profiles, value as FlavorProfile) }))}
        />
      )}
      {step === 2 && (
        <ChoiceStep
          title="¿Qué cuerpo quieres?"
          options={BODY_OPTIONS}
          selected={state.body ? [state.body] : []}
          onToggle={(value) => setState((s) => ({ ...s, body: value as BodyPreference }))}
        />
      )}
      {step === 3 && (
        <ChoiceStep
          title="¿Qué acidez prefieres?"
          options={ACIDITY_OPTIONS}
          selected={state.acidity ? [state.acidity] : []}
          onToggle={(value) => setState((s) => ({ ...s, acidity: value as AcidityPreference }))}
        />
      )}
      {step === 4 && (
        <ChoiceStep
          title="¿Qué presupuesto tienes?"
          subtitle="Por bolsa de 250 g."
          options={BUDGET_OPTIONS}
          selected={state.budget ? [state.budget] : []}
          onToggle={(value) => setState((s) => ({ ...s, budget: value as BudgetRange }))}
        />
      )}

      {finder.isError && (
        <p className="text-sm text-danger" role="alert">
          {finder.error instanceof ApiError ? finder.error.message : 'No se pudo calcular tu recomendación.'}
        </p>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Atrás
        </Button>
        {step < TOTAL_STEPS - 1 ? (
          <Button disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
            Siguiente
          </Button>
        ) : (
          <Button disabled={!canProceed || finder.isPending} onClick={submit}>
            {finder.isPending ? 'Calculando…' : 'Ver mi café ideal'}
          </Button>
        )}
      </div>
    </div>
  )
}
