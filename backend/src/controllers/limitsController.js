import { pool } from '../config/database.js'
import { normalizeMonth } from '../utils/finance.js'

export async function listLimits(_request, response, next) {
  try {
    const [limits] = await pool.query('SELECT l.id, l.monto, l.mes, l.id_cat, c.nombre categoria FROM limite l JOIN cat_egresos c ON c.id = l.id_cat ORDER BY l.mes DESC')
    response.json(limits)
  } catch (error) { next(error) }
}

export async function createLimit(request, response, next) {
  try {
    const amount = Number(request.body.monto)
    const categoryId = Number(request.body.id_cat)
    const month = normalizeMonth(request.body.mes)
    if (!amount || !categoryId || !month) return response.status(400).json({ message: 'Completa monto, mes y categoría.' })
    const [result] = await pool.execute('INSERT INTO limite (monto, mes, id_cat) VALUES (?, ?, ?)', [amount, month, categoryId])
    response.status(201).json({ id: result.insertId })
  } catch (error) { next(error) }
}
