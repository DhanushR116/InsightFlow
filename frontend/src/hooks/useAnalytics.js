import { useQuery } from '@tanstack/react-query'
import { getDashboardAnalytics } from '../api/analytics'

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: getDashboardAnalytics,
  })
}