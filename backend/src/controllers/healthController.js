import { pool } from '../config/database.js'

export async function healthCheck(_request, response, next) {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true })
  } catch (error) {
    next(error)
  }
}
