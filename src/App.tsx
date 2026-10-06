import { useState } from 'react'
import type { ReactNode } from 'react'
import { AppLayout, type PageName } from './components/AppLayout'
import { MovementModal } from './components/MovementModal'
import { BudgetPage } from './pages/BudgetPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { DashboardPage } from './pages/DashboardPage'
import { GoalsPage } from './pages/GoalsPage'
import { MovementsPage } from './pages/MovementsPage'
import { StatisticsPage } from './pages/StatisticsPage'
import './App.css'

function App() {
  const [page, setPage] = useState<PageName>('Resumen')
  const [isMovementModalOpen, setMovementModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)
  const onMovementSaved = () => setRefreshToken((current) => current + 1)

  const pages: Record<PageName, ReactNode> = {
    Resumen: <DashboardPage onPageChange={setPage} refreshToken={refreshToken} />,
    Movimientos: <MovementsPage onError={setError} refreshToken={refreshToken} />,
    Categorías: <CategoriesPage onError={setError} />,
    Presupuesto: <BudgetPage onError={setError} />,
    Estadísticas: <StatisticsPage />,
    Metas: <GoalsPage onError={setError} />,
  }

  return (
    <>
      <AppLayout
        page={page}
        onPageChange={setPage}
        onAddMovement={() => setMovementModalOpen(true)}
        error={error}
      >
        {pages[page]}
      </AppLayout>
      {isMovementModalOpen && (
        <MovementModal
          onClose={() => setMovementModalOpen(false)}
          onSaved={onMovementSaved}
          onError={setError}
        />
      )}
    </>
  )
}

export default App
