export const TYPES = Object.freeze({ INCOME: 'INGRESO', EXPENSE: 'EGRESO' })
export const categoryTables = Object.freeze({ INGRESO: 'cat_ingresos', EGRESO: 'cat_egresos' })
export const transactionTables = Object.freeze({ INGRESO: 'ingresos', EGRESO: 'egresos' })

export function normalizeType(value) {
  const type = String(value || '').toUpperCase()
  return Object.values(TYPES).includes(type) ? type : null
}

export function toSqlDate(value) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

export function normalizeMonth(value) {
  const month = String(value || '')
  if (/^\d{4}-\d{2}$/.test(month)) return `${month}-01`
  return /^\d{4}-\d{2}-\d{2}$/.test(month) ? month : null
}
