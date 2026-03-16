import { apiClient } from './client'
import type { CreateEmployeePayload, Employee, UpdateEmployeePayload } from '../types/models'

type EmployeeApiModel = Partial<Employee> & {
  Id?: string
  Name?: string
  EmailAddress?: string
  PhoneNumber?: string
  Gender?: string
  DaysWorked?: number
  Cafe?: string | null
  CafeId?: string | null
  email_address?: string
  phone_number?: string
  days_worked?: number
}

function normalizeGender(value: unknown): Employee['gender'] | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'male') {
    return 'Male'
  }

  if (normalized === 'female') {
    return 'Female'
  }

  return undefined
}

function normalizeEmployee(employee: EmployeeApiModel): Employee {
  return {
    id: employee.id ?? employee.Id ?? '',
    name: employee.name ?? employee.Name ?? '',
    emailAddress: employee.emailAddress ?? employee.EmailAddress ?? employee.email_address ?? '',
    phoneNumber: employee.phoneNumber ?? employee.PhoneNumber ?? employee.phone_number ?? '',
    gender: normalizeGender(employee.gender ?? employee.Gender),
    daysWorked: employee.daysWorked ?? employee.DaysWorked ?? employee.days_worked ?? 0,
    cafe: employee.cafe ?? employee.Cafe ?? null,
    cafeId: employee.cafeId ?? employee.CafeId ?? null,
  }
}

export async function getEmployees(cafe?: string): Promise<Employee[]> {
  const response = await apiClient.get<EmployeeApiModel[]>('/employees', {
    params: cafe ? { cafe } : undefined,
  })
  return response.data.map(normalizeEmployee)
}

export async function getEmployee(id: string): Promise<Employee> {
  const response = await apiClient.get<EmployeeApiModel>(`/employees/${id}`)
  return normalizeEmployee(response.data)
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<string> {
  const response = await apiClient.post<string>('/employees', payload)
  return response.data
}

export async function updateEmployee(payload: UpdateEmployeePayload): Promise<void> {
  await apiClient.put(`/employees/${payload.id}`, payload)
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiClient.delete(`/employees/${id}`)
}
