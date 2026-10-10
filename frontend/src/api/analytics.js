import apiClient from './client'

export async function getDashboardAnalytics() {
  const response = await apiClient.get(
    '/api/analytics/dashboard'
  )

  return response.data
}