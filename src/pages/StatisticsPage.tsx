import { useEffect, useState } from 'react'
import { api } from '../api'
import { MetricCard } from '../components/MetricCard'
import type { Transaction } from '../types/finance'

export function StatisticsPage() {
  const [rows, setRows] = useState<Transaction[]>([])
  useEffect(() => {
    api
      .transactions()
      .then(setRows)
      .catch(() => setRows([]))
  }, [])
  const income = rows
    .filter((row) => row.tipo === 'INGRESO')
    .reduce((total, row) => total + Number(row.monto), 0)
  const expense = rows
    .filter((row) => row.tipo === 'EGRESO')
    .reduce((total, row) => total + Number(row.monto), 0)
  return (
    <section className="metrics stats stats-page">
      <MetricCard icon="arrow" title="Total de ingresos" value={income} type="income" />
      <MetricCard icon="arrow" title="Total de egresos" value={expense} type="expense" />
      <MetricCard icon="target" title="Balance histórico" value={income - expense} type="savings" />
    </section>
  )
}
