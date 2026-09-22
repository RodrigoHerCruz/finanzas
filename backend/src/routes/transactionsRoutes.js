import { Router } from 'express'
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
} from '../controllers/transactionsController.js'

export const transactionsRouter = Router()
transactionsRouter.route('/').get(listTransactions).post(createTransaction)
transactionsRouter.delete('/:type/:id', deleteTransaction)
