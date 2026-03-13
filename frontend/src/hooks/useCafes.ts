import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCafe, deleteCafe, getCafes, updateCafe } from '../api/cafes'
import type { CreateCafePayload, UpdateCafePayload } from '../types/models'

export function useCafes(locationFilter: string) {
  return useQuery({
    queryKey: ['cafes', locationFilter],
    queryFn: () => getCafes(locationFilter || undefined),
  })
}

export function useCreateCafe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCafePayload) => createCafe(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}

export function useUpdateCafe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateCafePayload) => updateCafe(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}

export function useDeleteCafe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCafe(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cafes'] })
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
