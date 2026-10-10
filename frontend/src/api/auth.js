import apiClient from './client'

export async function loginUser(username, password) {
  const response = await apiClient.post('/api/auth/login', {
    username,
    password,
  })

  return response.data
}