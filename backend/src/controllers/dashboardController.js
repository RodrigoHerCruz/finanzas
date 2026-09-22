import { pool } from '../config/database.js'
import { transactionsSql } from './transactionsController.js'

export async function getDashboard(_request, response, next) {
  try {
    const [[income]] = await pool.query(
      'SELECT COALESCE(SUM(monto), 0) total FROM ingresos WHERE YEAR(fecha) = YEAR(CURDATE()) AND MONTH(fecha) = MONTH(CURDATE())'
    )
    const [[expense]] = await pool.query(
      'SELECT COALESCE(SUM(monto), 0) total FROM egresos WHERE YEAR(fecha) = YEAR(CURDATE()) AND MONTH(fecha) = MONTH(CURDATE())'
    )
    const [recent] = await pool.query(`${transactionsSql} ORDER BY fecha DESC LIMIT 5`)
    const [goals] = await pool.query('SELECT * FROM meta_ahorro ORDER BY id DESC LIMIT 1')
    const ingresos = Number(income.total)
    const egresos = Number(expense.total)
    response.json({
      ingresos,
      egresos,
      saldo: ingresos - egresos,
      ahorro: goals.length ? Number(goals[0].saldo) : 0,
      recent,
      goal: goals[0] || null,
    })
  } catch (error) {
    next(error)
  }
}
