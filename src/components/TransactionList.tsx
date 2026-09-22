import { Icon } from './Icon'
import { EmptyState } from './EmptyState'
import type { Transaction } from '../types/finance'
import { currency, formatDate } from '../utils/format'

export function TransactionList({
  rows,
  onDelete,
}: {
  rows: Transaction[]
  onDelete?: (row: Transaction) => void
}) {
  if (!rows.length)
    return <EmptyState title="Sin movimientos registrados" text="Agrega tu primer ingreso o egreso." />
  return (
    <div className="transaction-list">
      {rows.map((row) => (
        <div className="transaction" key={`${row.tipo}-${row.id}`}>
          <span className="transaction-icon">{row.tipo === 'INGRESO' ? '↙' : '↗'}</span>
          <div className="transaction-info">
            <strong>{row.concepto}</strong>
            <small>
              {row.categoria} · {formatDate(row.fecha)}
            </small>
          </div>
          <strong className={row.tipo === 'INGRESO' ? 'amount income-text' : 'amount'}>
            {row.tipo === 'INGRESO' ? '+ ' : '− '}
            {currency(row.monto)}
          </strong>
          {onDelete && (
            <button className="delete-button" title="Eliminar" onClick={() => onDelete(row)}>
              <Icon name="trash" size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
