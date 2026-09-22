import { Router } from 'express'
import { createLimit, listLimits } from '../controllers/limitsController.js'

export const limitsRouter = Router()
limitsRouter.route('/').get(listLimits).post(createLimit)
