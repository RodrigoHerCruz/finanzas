export type Kind = 'INGRESO' | 'EGRESO'

export type Category = { id: number; nombre: string }
export type Transaction = {
  id: number
  monto: number
  concepto: string
  fecha: string
  tipo: Kind
  categoria: string
}
export type Goal = { id: number; nombre: string; monto_meta: number; saldo: number }
export type Limit = { id: number; monto: number; mes: string; id_cat: number; categoria: string }
export type DashboardData = {
  ingresos: number
  egresos: number
  saldo: number
  ahorro: number
  recent: Transaction[]
  goal: Goal | null
}
