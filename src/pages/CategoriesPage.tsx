import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../api'
import { EmptyState } from '../components/EmptyState'
import type { Category, Kind } from '../types/finance'

export function CategoriesPage({ onError }: { onError: (message: string) => void }) {
  const [type, setType] = useState<Kind>('EGRESO')
  const [categories, setCategories] = useState<Category[]>([])
  const load = useCallback(
    () =>
      api
        .categories(type)
        .then(setCategories)
        .catch((error: Error) => onError(error.message)),
    [type, onError]
  )
  useEffect(() => {
    load()
  }, [load])
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      await api.addCategory(type, String(values.get('nombre')))
      form.reset()
      load()
    } catch (error) {
      onError((error as Error).message)
    }
  }
  return (
    <div className="page-grid">
      <article className="panel">
        <div className="panel-title">
          <div>
            <h2>Categorías de {type === 'EGRESO' ? 'egresos' : 'ingresos'}</h2>
            <p>Úsalas al registrar tus movimientos.</p>
          </div>
        </div>
        {categories.length ? (
          <div className="category-list">
            {categories.map((category) => (
              <div key={category.id} className="category-row">
                <span
                  className={type === 'EGRESO' ? 'category-dot expense-dot' : 'category-dot income-dot'}
                />
                <strong>{category.nombre}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Aún no hay categorías" text="Crea la primera categoría con el formulario." />
        )}
      </article>
      <form className="panel form-card" onSubmit={save}>
        <h2>Nueva categoría</h2>
        <label>
          Tipo
          <select value={type} onChange={(event) => setType(event.target.value as Kind)}>
            <option value="EGRESO">Egreso</option>
            <option value="INGRESO">Ingreso</option>
          </select>
        </label>
        <label>
          Nombre
          <input name="nombre" required placeholder={type === 'EGRESO' ? 'Ej. Alimentación' : 'Ej. Nómina'} />
        </label>
        <button className="save-button">Crear categoría</button>
      </form>
    </div>
  )
}
