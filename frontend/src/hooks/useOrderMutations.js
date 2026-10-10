import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrder } from '../api/orders'

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      })

      queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      })

      queryClient.invalidateQueries({
        queryKey: ['analytics', 'dashboard'],
      })
    },
  })
}