import apiClient from './client'

export async function getProducts() {
  const response = await apiClient.get('/api/products/')
  return response.data
}

export async function getProduct(productId) {
  const response = await apiClient.get(`/api/products/${productId}`)
  return response.data
}

export async function createProduct(product) {
  const response = await apiClient.post('/api/products/', product)
  return response.data
}

export async function updateProduct(productId, product) {
  const response = await apiClient.patch(
    `/api/products/${productId}`,
    product
  )

  return response.data
}

export async function deleteProduct(productId) {
  await apiClient.delete(`/api/products/${productId}`)
}