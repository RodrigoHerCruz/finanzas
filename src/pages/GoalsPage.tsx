import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../api'
import { EmptyState } from '../components/EmptyState'
import { FormCard } from '../components/FormCard'
import type { Goal } from '../types/finance'
import { currency } from '../utils/format'

export function GoalsPage({ onError }: { onError: (message: string) => void }) {
  const [goals, setGoals] = useState<Goal[]>([])
  const load = useCallback(
    () =>
      api
        .goals()
        .then(setGoals)
        .catch((error: Error) => onError(error.message)),
    [onError]
  )
  useEffect(() => {
    load()
  }, [load])
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      await api.addGoal({ nombre: values.get('nombre'), monto_meta: Number(values.get('monto_meta')) })
      form.reset()
      load()
    } catch (error) {
      onError((error as Error).message)
    }
  }
  const add = async (goal: Goal) => {
    const amount = prompt(`Monto para “${goal.nombre}”`)
    if (!amount) return
    try {
      await api.addGoalMovement(goal.id, { monto: Number(amount), tipo: 'INGRESO' })
      load()
    } catch (error) {
      onError((error as Error).message)
    }
  }
  return (
    <div className="page-grid">
      <article className="panel">
        <h2>Tus metas</h2>
        {goals.length ? (
          goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.saldo / goal.monto_meta) * 100))
            return (
              <div className="goal-list" key={goal.id}>
                <div>
                  <strong>{goal.nombre}</strong>
                  <small>
                    {currency(goal.saldo)} de {currency(goal.monto_meta)}
                  </small>
                  <div className="progress">
                    <span className="purple" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
                <button className="goal-button" onClick={() => add(goal)}>
                  Aportar
                </button>
              </div>
            )
          })
        ) : (
          <EmptyState title="Sin metas" text="Crea una meta para empezar a ahorrar." />
        )}
      </article>
      <FormCard title="Nueva meta" onSubmit={save}>
        <label>
          Nombre
          <input name="nombre" required placeholder="Ej. Viaje a Japón" />
        </label>
        <label>
          Monto meta
          <input name="monto_meta" type="number" min="1" step="0.01" required />
        </label>
        <button className="save-button">Crear meta</button>
      </FormCard>
    </div>
  )
}
