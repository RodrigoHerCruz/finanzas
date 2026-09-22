import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type PageName =
  'Resumen' | 'Movimientos' | 'Categorías' | 'Presupuesto' | 'Estadísticas' | 'Metas' | 'Configuración'
const navigation: [PageName, IconName][] = [
  ['Resumen', 'grid'],
  ['Movimientos', 'arrow'],
  ['Categorías', 'more'],
  ['Presupuesto', 'wallet'],
  ['Estadísticas', 'chart'],
  ['Metas', 'target'],
]

export function AppLayout({
  page,
  onPageChange,
  onAddMovement,
  error,
  children,
}: {
  page: PageName
  onPageChange: (page: PageName) => void
  onAddMovement: () => void
  error: string
  children: ReactNode
}) {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => onPageChange('Resumen')}>
          <span className="brand-mark">a</span>
          <span>Ahorra</span>
        </button>
        <nav className="main-nav">
          {navigation.map(([label, icon]) => (
            <button
              key={label}
              className={page === label ? 'nav-item active' : 'nav-item'}
              onClick={() => onPageChange(label)}
            >
              <Icon name={icon} />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className={page === 'Configuración' ? 'nav-item active' : 'nav-item'}
            onClick={() => onPageChange('Configuración')}
          >
            <Icon name="settings" />
            Configuración
          </button>
          <div className="user-card">
            <div className="avatar">RM</div>
            <div>
              <strong>Rodrigo Hernandez</strong>
              <small>Plan personal</small>
            </div>
          </div>
        </div>
      </aside>
      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">FINANZAS PERSONALES</p>
            <h1>{page}</h1>
            <p className="subtitle">Administra tus ingresos, egresos y metas de ahorro.</p>
          </div>
          <div className="header-actions">
            {/* <button className="icon-button" aria-label="Notificaciones">
              <Icon name="bell" />
            </button> */}
            <button className="add-button" onClick={onAddMovement}>
              <Icon name="plus" size={18} />
              Agregar movimiento
            </button>
          </div>
        </header>
        {error && <p className="alert">{error}</p>}
        {children}
      </section>
    </main>
  )
}
