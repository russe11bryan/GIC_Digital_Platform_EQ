import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../api/employees'
import type { CreateEmployeePayload, UpdateEmployeePayload } from '../types/models'

export function useEmployees(cafeFilter: string) {
  return useQuery({
    queryKey: ['employees', cafeFilter],
    queryFn: () => getEmployees(cafeFilter || undefined),
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
      await queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => updateEmployee(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
      await queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
      await queryClient.invalidateQueries({ queryKey: ['cafes'] })
    },
  })
}
