import apiClient from './client'

export async function getCustomers() {
  const response = await apiClient.get('/api/customers/')
  return response.data
}

export async function getCustomer(customerId) {
  const response = await apiClient.get(`/api/customers/${customerId}`)
  return response.data
}

export async function createCustomer(customer) {
  const response = await apiClient.post('/api/customers/', customer)
  return response.data
}

export async function updateCustomer(customerId, customer) {
  const response = await apiClient.patch(
    `/api/customers/${customerId}`,
    customer
  )
  return response.data
}

export async function deleteCustomer(customerId) {
  await apiClient.delete(`/api/customers/${customerId}`)
}