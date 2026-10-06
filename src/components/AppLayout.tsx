import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type PageName =
  | 'Resumen'
  | 'Movimientos'
  | 'Categorías'
  | 'Presupuesto'
  | 'Estadísticas'
  | 'Metas'

const navigation: [PageName, string, IconName][] = [
  ['Resumen', 'Tu dinero', 'grid'],
  ['Movimientos', 'Movimientos', 'arrow'],
  ['Categorías', 'Categorías', 'more'],
  ['Presupuesto', 'Presupuesto', 'wallet'],
  ['Estadísticas', 'Estadísticas', 'chart'],
  ['Metas', 'Metas de ahorro', 'target'],
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
      <section className="content">
        <header className="site-header">
          <button className="brand" onClick={() => onPageChange('Resumen')}>
            <span className="brand-mark">FZ</span>
            <span>Finanzas<span className="brand-period">.</span></span>
          </button>
          <div className="header-menu">
            <details className="menu-dropdown">
              <summary aria-label="Abrir menú de secciones">
                <span className="menu-glyph"><i /><i /><i /></span>
                <span>Secciones</span>
                <span className="menu-caret">⌄</span>
              </summary>
              <nav className="dropdown-panel" aria-label="Navegación principal">
                <p className="dropdown-label">IR A</p>
                {navigation.map(([target, label, icon], index) => (
                  <button
                    key={target}
                    className={page === target ? 'dropdown-item selected' : 'dropdown-item'}
                    onClick={(event) => {
                      onPageChange(target)
                      event.currentTarget.closest('details')?.removeAttribute('open')
                    }}
                  >
                    <span className="dropdown-icon"><Icon name={icon} size={17} /></span>
                    <span>{label}</span>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                  </button>
                ))}
              </nav>
            </details>
          </div>
          <div className="header-right">
            <button className="add-button" onClick={onAddMovement}>
              <Icon name="plus" size={17} />
              <span>Nuevo movimiento</span>
            </button>
          </div>
        </header>
        <div className="page-heading">
          <div>
            <p className="eyebrow">TU ESPACIO FINANCIERO</p>
            <h1>{page}<span className="heading-period">.</span></h1>
          </div>
        </div>
        {error && <p className="alert">{error}</p>}
        {children}
        <footer className="page-footer"><span>AHORRA · FINANZAS PERSONALES</span><span>Anenqui <b>↗</b></span></footer>
      </section>
    </main>
  )
}
