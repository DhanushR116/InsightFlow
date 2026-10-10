import apiClient from './client'

export async function getAuditLogs(skip = 0, limit = 50) {
  const response = await apiClient.get('/api/audit-logs/', {
    params: {
      skip,
      limit,
    },
  })

  return response.data
}
