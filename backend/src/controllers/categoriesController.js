import { pool } from '../config/database.js'
import { categoryTables, normalizeType } from '../utils/finance.js'

export async function listCategories(request, response, next) {
  try {
    const type = normalizeType(request.params.type)
    if (!type) return response.status(400).json({ message: 'Tipo inválido.' })
    const [categories] = await pool.query(`SELECT id, nombre FROM ${categoryTables[type]} ORDER BY nombre`)
    response.json(categories)
  } catch (error) { next(error) }
}

export async function createCategory(request, response, next) {
  try {
    const type = normalizeType(request.params.type)
    const name = String(request.body.nombre || '').trim()
    if (!type || !name) return response.status(400).json({ message: 'Tipo y nombre son obligatorios.' })
    const [result] = await pool.execute(`INSERT INTO ${categoryTables[type]} (nombre) VALUES (?)`, [name])
    response.status(201).json({ id: result.insertId, nombre: name })
  } catch (error) { next(error) }
}
