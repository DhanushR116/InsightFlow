import apiClient from './client'

export async function getDashboardData() {
  const [customersResponse, productsResponse] = await Promise.all([
    apiClient.get('/api/customers/'),
    apiClient.get('/api/products/'),
  ])

  return {
    customers: customersResponse.data,
    products: productsResponse.data,
  }
}