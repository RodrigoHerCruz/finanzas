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
      <form className={`modal form-card movement-modal ${type === 'INGRESO' ? 'income-modal' : 'expense-modal'}`} onClick={(event) => event.stopPropagation()} onSubmit={save}>
        <aside className="movement-modal-aside">
          <button type="button" className="close-modal" onClick={onClose} aria-label="Cerrar">×</button>
          <span className="movement-modal-mark">{type === 'INGRESO' ? '↙' : '↗'}</span>
          <p className="eyebrow">REGISTRO FINANCIERO</p>
          <h2>{type === 'INGRESO' ? 'Un ingreso más.' : '¿En qué se fue?'}</h2>
          <p className="movement-modal-hint"></p>
          <span className="movement-modal-count"><i /> NUEVO MOVIMIENTO</span>
        </aside>
        <section className="movement-modal-fields">
          <div className="movement-modal-heading">
            <div><p className="eyebrow">NUEVO REGISTRO</p><h3>Agregar movimiento</h3></div>
          </div>
          <div className="modal-options">
            <button type="button" className={type === 'INGRESO' ? 'selected income' : ''} onClick={() => setType('INGRESO')}>＋ Ingreso</button>
            <button type="button" className={type === 'EGRESO' ? 'selected expense' : ''} onClick={() => setType('EGRESO')}>− Egreso</button>
          </div>
          <label>Concepto<input name="concepto" required placeholder="Ej. Supermercado" /></label>
          <label>Monto<div className="movement-amount"><span>$</span><input name="monto" type="number" min="0.01" step="0.01" required placeholder="0.00" /></div></label>
          <div className="movement-modal-row">
            <label>Categoría<select name="id_cat" required><option value="">Selecciona</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.nombre}</option>)}</select></label>
            <label>Fecha<input name="fecha" type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} required /></label>
          </div>
          <button className="save-button">Guardar movimiento <span>→</span></button>
        </section>
      </form>
    </div>
  )
}
