import apiClient from './client'

export async function getCurrentUser() {
  const response = await apiClient.get('/api/auth/me')
  return response.data
}