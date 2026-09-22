import { Router } from 'express'
import { createCategory, listCategories } from '../controllers/categoriesController.js'

export const categoriesRouter = Router()
categoriesRouter.route('/:type').get(listCategories).post(createCategory)
