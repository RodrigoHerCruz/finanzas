import { Router } from 'express'
import { healthCheck } from '../controllers/healthController.js'
import { getDashboard } from '../controllers/dashboardController.js'
import { categoriesRouter } from './categoriesRoutes.js'
import { goalsRouter } from './goalsRoutes.js'
import { limitsRouter } from './limitsRoutes.js'
import { transactionsRouter } from './transactionsRoutes.js'

export const apiRouter = Router()
apiRouter.get('/health', healthCheck)
apiRouter.get('/dashboard', getDashboard)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/transactions', transactionsRouter)
apiRouter.use('/limits', limitsRouter)
apiRouter.use('/goals', goalsRouter)
