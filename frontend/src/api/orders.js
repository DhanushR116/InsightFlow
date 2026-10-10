import apiClient from './client'

export async function getOrders(skip = 0, limit = 20) {
  const response = await apiClient.get('/api/orders/', {
    params: {
      skip,
      limit,
    },
  })

  return response.data
}

export async function getOrder(orderId) {
  const response = await apiClient.get(`/api/orders/${orderId}`)
  return response.data
}

export async function createOrder(order) {
  const response = await apiClient.post('/api/orders/', order)
  return response.data
}