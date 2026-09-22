import type { Category, DashboardData, Goal, Kind, Limit, Transaction } from './types/finance'
export type { Category, DashboardData, Goal, Kind, Limit, Transaction } from './types/finance'
const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`/api${path}`, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'No fue posible realizar la operación')
  }
  return response.status === 204 ? (undefined as T) : response.json()
}
export const api = {
  health: () => request<{ ok: boolean }>('/health'),
  dashboard: () => request<DashboardData>('/dashboard'),
  categories: (type: Kind) => request<Category[]>(`/categories/${type}`),
  addCategory: (type: Kind, nombre: string) =>
    request(`/categories/${type}`, { method: 'POST', body: JSON.stringify({ nombre }) }),
  transactions: (type = 'TODOS') => request<Transaction[]>(`/transactions?type=${type}`),
  addTransaction: (data: object) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  deleteTransaction: (type: Kind, id: number) => request(`/transactions/${type}/${id}`, { method: 'DELETE' }),
  limits: () => request<Limit[]>('/limits'),
  addLimit: (data: object) => request('/limits', { method: 'POST', body: JSON.stringify(data) }),
  goals: () => request<Goal[]>('/goals'),
  addGoal: (data: object) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),
  addGoalMovement: (id: number, data: object) =>
    request(`/goals/${id}/movements`, { method: 'POST', body: JSON.stringify(data) }),
}
