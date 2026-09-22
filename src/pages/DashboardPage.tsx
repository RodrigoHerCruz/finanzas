import { useEffect, useState } from 'react'
import { api } from '../api'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { MetricCard } from '../components/MetricCard'
import { TransactionList } from '../components/TransactionList'
import type { PageName } from '../components/AppLayout'
import type { DashboardData } from '../types/finance'
import { currency } from '../utils/format'

export function DashboardPage({
  onPageChange,
  refreshToken,
}: {
  onPageChange: (page: PageName) => void
  refreshToken: number
}) {
  const [data, setData] = useState<DashboardData>()
  const [error, setError] = useState('')
  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((reason: Error) => setError(reason.message))
  }, [refreshToken])
  if (error) return <EmptyState title="Conecta MySQL para ver tu resumen" text={error} />
  if (!data) return <p>Cargando resumen…</p>
  const percentage = data.goal ? Math.min(100, Math.round((data.goal.saldo / data.goal.monto_meta) * 100)) : 0
  return (
    <>
      <div className="balance-card">
        <div className="balance-copy">
          <p>Saldo del mes</p>
          <h2>{currency(data.saldo)}</h2>
          <div className="trend">Ingresos menos egresos de este mes</div>
        </div>
        <div className="balance-art">
          <div className="circle c1" />
          <div className="circle c2" />
          <div className="mini-chart">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <section className="metrics">
        <MetricCard icon="arrow" title="Ingresos del mes" value={data.ingresos} type="income" />
        <MetricCard icon="arrow" title="Gastos del mes" value={data.egresos} type="expense" />
        <MetricCard icon="target" title="Ahorro acumulado" value={data.ahorro} type="savings" />
      </section>
      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-title">
            <div>
              <h2>Últimos movimientos</h2>
              <p>Actividad registrada</p>
            </div>
            <button className="text-button" onClick={() => onPageChange('Movimientos')}>
              Ver todos <Icon name="chevron" size={16} />
            </button>
          </div>
          <TransactionList rows={data.recent} />
        </article>
        <article className="panel">
          <div className="panel-title">
            <div>
              <h2>Accesos rápidos</h2>
              <p>Organiza tus finanzas</p>
            </div>
          </div>
          <button className="outline-button" onClick={() => onPageChange('Presupuesto')}>
            Crear límite de gasto <Icon name="chevron" size={16} />
          </button>
          <button className="outline-button" onClick={() => onPageChange('Metas')}>
            Gestionar metas de ahorro <Icon name="chevron" size={16} />
          </button>
        </article>
      </section>
      {data.goal ? (
        <article className="goal-card">
          <div className="goal-icon">
            <Icon name="target" size={23} />
          </div>
          <div className="goal-main">
            <p>Meta de ahorro</p>
            <h2>{data.goal.nombre}</h2>
            <div className="goal-progress">
              <div>
                <span style={{ width: `${percentage}%` }} />
              </div>
              <strong>{percentage}%</strong>
            </div>
            <small>
              {currency(data.goal.saldo)} de {currency(data.goal.monto_meta)}
            </small>
          </div>
          <button className="goal-button" onClick={() => onPageChange('Metas')}>
            Aportar <Icon name="chevron" size={16} />
          </button>
        </article>
      ) : (
        <EmptyState title="Aún no tienes una meta" text="Crea una desde la sección Metas." />
      )}
    </>
  )
}
