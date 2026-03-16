import { apiClient } from './client'
import type { CreateEmployeePayload, Employee, UpdateEmployeePayload } from '../types/models'

export async function getEmployees(cafe?: string): Promise<Employee[]> {
  const response = await apiClient.get<Employee[]>('/employees', {
    params: cafe ? { cafe } : undefined,
  })
  return response.data
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<string> {
  const response = await apiClient.post<string>('/employees', payload)
  return response.data
}

export async function updateEmployee(payload: UpdateEmployeePayload): Promise<void> {
  await apiClient.put('/employees', payload)
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiClient.delete(`/employees/${id}`)
}
