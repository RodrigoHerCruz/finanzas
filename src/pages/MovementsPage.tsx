import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import { TransactionList } from '../components/TransactionList'
import type { Transaction } from '../types/finance'

export function MovementsPage({
  onError,
  refreshToken,
}: {
  onError: (message: string) => void
  refreshToken: number
}) {
  const [filter, setFilter] = useState('TODOS')
  const [rows, setRows] = useState<Transaction[]>([])
  const load = useCallback(
    () =>
      api
        .transactions(filter)
        .then(setRows)
        .catch((error: Error) => onError(error.message)),
    [filter, onError]
  )
  useEffect(() => {
    load()
  }, [load, refreshToken])
  const remove = async (row: Transaction) => {
    if (!confirm(`¿Eliminar “${row.concepto}”?`)) return
    try {
      await api.deleteTransaction(row.tipo, row.id)
      load()
    } catch (error) {
      onError((error as Error).message)
    }
  }
  return (
    <article className="panel page-panel movements-page">
      <div className="filter-row">
        {['TODOS', 'INGRESO', 'EGRESO'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={filter === type ? 'filter active-filter' : 'filter'}
          >
            {type === 'TODOS' ? 'Todos' : type === 'INGRESO' ? 'Ingresos' : 'Egresos'}
          </button>
        ))}
      </div>
      <TransactionList rows={rows} onDelete={remove} />
    </article>
  )
}
