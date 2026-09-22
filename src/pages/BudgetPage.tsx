import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../api'
import { FormCard } from '../components/FormCard'
import { EmptyState } from '../components/EmptyState'
import type { Category, Limit } from '../types/finance'
import { currency } from '../utils/format'

export function BudgetPage({ onError }: { onError: (message: string) => void }) {
  const [limits, setLimits] = useState<Limit[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const load = useCallback(() => {
    api
      .limits()
      .then(setLimits)
      .catch((error: Error) => onError(error.message))
    api
      .categories('EGRESO')
      .then(setCategories)
      .catch((error: Error) => onError(error.message))
  }, [onError])
  useEffect(() => {
    load()
  }, [load])
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      await api.addLimit({
        monto: Number(values.get('monto')),
        mes: values.get('mes'),
        id_cat: Number(values.get('id_cat')),
      })
      form.reset()
      load()
    } catch (error) {
      onError((error as Error).message)
    }
  }
  return (
    <div className="page-grid">
      <article className="panel">
        <h2>Límites registrados</h2>
        {limits.length ? (
          limits.map((limit) => (
            <div className="limit-item" key={limit.id}>
              <strong>{limit.categoria}</strong>
              <span>
                {currency(limit.monto)} · {limit.mes.slice(0, 7)}
              </span>
            </div>
          ))
        ) : (
          <EmptyState title="Sin límites" text="Registra un presupuesto mensual." />
        )}
      </article>
      <FormCard title="Nuevo límite" onSubmit={save}>
        <label>
          Categoría
          <select name="id_cat" required>
            <option value="">Selecciona</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Monto
          <input name="monto" type="number" min="1" step="0.01" required />
        </label>
        <label>
          Mes
          <input name="mes" type="month" required />
        </label>
        <button className="save-button">Guardar límite</button>
      </FormCard>
    </div>
  )
}
