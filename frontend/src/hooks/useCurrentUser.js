import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api/currentUser'
import { isAuthenticated } from '../utils/auth'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated(),
    retry: false,
  })
}