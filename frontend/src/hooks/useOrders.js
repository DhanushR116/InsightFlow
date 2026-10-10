import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../api/orders'

export function useOrders(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ['orders', skip, limit],
    queryFn: () => getOrders(skip, limit),
  })
}