import { Router } from 'express'
import { createGoal, createGoalMovement, listGoals } from '../controllers/goalsController.js'

export const goalsRouter = Router()
goalsRouter.route('/').get(listGoals).post(createGoal)
goalsRouter.post('/:id/movements', createGoalMovement)
