import { apiClient } from './client'
import type { Cafe, CreateCafePayload, UpdateCafePayload } from '../types/models'

export async function getCafes(location?: string): Promise<Cafe[]> {
  const response = await apiClient.get<Cafe[]>('/cafes', {
    params: location ? { location } : undefined,
  })
  return response.data
}

export async function createCafe(payload: CreateCafePayload): Promise<string> {
  const response = await apiClient.post<string>('/cafes', payload)
  return response.data
}

export async function updateCafe(payload: UpdateCafePayload): Promise<void> {
  await apiClient.put('/cafes', payload)
}

export async function deleteCafe(id: string): Promise<void> {
  await apiClient.delete(`/cafes/${id}`)
}
