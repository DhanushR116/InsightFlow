import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../api/customers'

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, customer }) =>
      updateCustomer(customerId, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      })
    },
  })
}