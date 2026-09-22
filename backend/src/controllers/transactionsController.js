import { pool } from '../config/database.js'
import { normalizeType, toSqlDate, transactionTables } from '../utils/finance.js'

const transactionsSql = `SELECT * FROM (
  SELECT i.id, i.monto, i.concepto, i.fecha, 'INGRESO' tipo, c.nombre categoria FROM ingresos i JOIN cat_ingresos c ON c.id=i.id_cat
  UNION ALL
  SELECT e.id, e.monto, e.concepto, e.fecha, 'EGRESO' tipo, c.nombre categoria FROM egresos e JOIN cat_egresos c ON c.id=e.id_cat
) movimientos`

export async function listTransactions(request, response, next) {
  try {
    const requestedType = String(request.query.type || 'TODOS').toUpperCase()
    const type = requestedType === 'TODOS' ? null : normalizeType(requestedType)
    if (requestedType !== 'TODOS' && !type) return response.status(400).json({ message: 'Tipo inválido.' })
    const sql = `${transactionsSql}${type ? ' WHERE tipo = ?' : ''} ORDER BY fecha DESC LIMIT 100`
    const [transactions] = await pool.query(sql, type ? [type] : [])
    response.json(transactions)
  } catch (error) { next(error) }
}

export async function createTransaction(request, response, next) {
  try {
    const type = normalizeType(request.body.tipo)
    const amount = Number(request.body.monto)
    const categoryId = Number(request.body.id_cat)
    const concept = String(request.body.concepto || '').trim()
    const date = toSqlDate(request.body.fecha)
    if (!type || !amount || !categoryId || !concept || !date) return response.status(400).json({ message: 'Completa tipo, monto, concepto, fecha y categoría.' })
    const [result] = await pool.execute(`INSERT INTO ${transactionTables[type]} (monto, concepto, fecha, id_cat) VALUES (?, ?, ?, ?)`, [amount, concept, date, categoryId])
    response.status(201).json({ id: result.insertId })
  } catch (error) { next(error) }
}

export async function deleteTransaction(request, response, next) {
  try {
    const type = normalizeType(request.params.type)
    if (!type) return response.status(400).json({ message: 'Tipo inválido.' })
    await pool.execute(`DELETE FROM ${transactionTables[type]} WHERE id = ?`, [request.params.id])
    response.status(204).end()
  } catch (error) { next(error) }
}

export { transactionsSql }
