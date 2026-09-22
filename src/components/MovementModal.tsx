import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../api'
import type { Category, Kind } from '../types/finance'

export function MovementModal({
  onClose,
  onSaved,
  onError,
}: {
  onClose: () => void
  onSaved: () => void
  onError: (message: string) => void
}) {
  const [type, setType] = useState<Kind>('EGRESO')
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    api
      .categories(type)
      .then(setCategories)
      .catch((error: Error) => onError(error.message))
  }, [type, onError])
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      await api.addTransaction({
        tipo: type,
        monto: Number(values.get('monto')),
        concepto: values.get('concepto'),
        fecha: values.get('fecha'),
        id_cat: Number(values.get('id_cat')),
      })
      onSaved()
      onClose()
    } catch (error) {
      onError((error as Error).message)
    }
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal form-card" onClick={(event) => event.stopPropagation()} onSubmit={save}>
        <button type="button" className="close-modal" onClick={onClose}>
          ×
        </button>
        <p className="eyebrow">NUEVO REGISTRO</p>
        <h2>Agregar movimiento</h2>
        <div className="modal-options">
          <button
            type="button"
            className={type === 'INGRESO' ? 'selected income' : ''}
            onClick={() => setType('INGRESO')}
          >
            Ingreso
          </button>
          <button
            type="button"
            className={type === 'EGRESO' ? 'selected expense' : ''}
            onClick={() => setType('EGRESO')}
          >
            Egreso
          </button>
        </div>
        <label>
          Concepto
          <input name="concepto" required placeholder="Ej. Supermercado" />
        </label>
        <label>
          Monto
          <input name="monto" type="number" min="0.01" step="0.01" required />
        </label>
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
          Fecha
          <input
            name="fecha"
            type="datetime-local"
            defaultValue={new Date().toISOString().slice(0, 16)}
            required
          />
        </label>
        <button className="save-button">Guardar movimiento</button>
      </form>
    </div>
  )
}
