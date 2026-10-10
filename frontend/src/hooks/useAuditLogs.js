import { useQuery } from '@tanstack/react-query'
import { getAuditLogs } from '../api/auditLogs'

export function useAuditLogs(skip = 0, limit = 50) {
  return useQuery({
    queryKey: ['audit-logs', skip, limit],
    queryFn: () => getAuditLogs(skip, limit),
  })
}