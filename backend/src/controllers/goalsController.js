import { pool } from '../config/database.js'
import { normalizeType } from '../utils/finance.js'

export async function listGoals(_request, response, next) {
  try {
    const [goals] = await pool.query('SELECT * FROM meta_ahorro ORDER BY id DESC')
    response.json(goals)
  } catch (error) {
    next(error)
  }
}

export async function createGoal(request, response, next) {
  try {
    const name = String(request.body.nombre || '').trim()
    const target = Number(request.body.monto_meta)
    const balance = Number(request.body.saldo || 0)
    if (!name || !target)
      return response.status(400).json({ message: 'Nombre y monto meta son obligatorios.' })
    const [result] = await pool.execute(
      'INSERT INTO meta_ahorro (nombre, monto_meta, saldo) VALUES (?, ?, ?)',
      [name, target, balance]
    )
    response.status(201).json({ id: result.insertId })
  } catch (error) {
    next(error)
  }
}

export async function createGoalMovement(request, response, next) {
  const connection = await pool.getConnection()
  try {
    const amount = Number(request.body.monto)
    const type = normalizeType(request.body.tipo)
    if (!amount || !type)
      return response.status(400).json({ message: 'Tipo y monto válidos son obligatorios.' })
    await connection.beginTransaction()
    await connection.execute('INSERT INTO movimiento (monto, tipo, fecha, id_meta) VALUES (?, ?, NOW(), ?)', [
      amount,
      type,
      request.params.id,
    ])
    const operator = type === 'INGRESO' ? '+' : '-'
    await connection.execute(`UPDATE meta_ahorro SET saldo = saldo ${operator} ? WHERE id = ?`, [
      amount,
      request.params.id,
    ])
    await connection.commit()
    response.status(201).json({ ok: true })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
}
