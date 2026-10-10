import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../hooks/useProductMutations'

function Products() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useProducts()

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
  })

  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')

  if (isLoading) {
    return (
      <div className="page-state">
        <div className="loading-card">
          <div className="loading-spinner" />

          <h2>Loading products</h2>

          <p>
            Fetching your product catalog...
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-state">
        <div className="error-card">
          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to load products
          </h2>

          <p>
            {error?.response?.data?.detail ||
              error?.message ||
              'Something went wrong.'}
          </p>
        </div>
      </div>
    )
  }

  const products = Array.isArray(data)
    ? data
    : []

  const filteredProducts = products.filter(
    (product) =>
      product.name
        ?.toLowerCase()
        .includes(search.toLowerCase()),
  )

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function resetForm() {
    setForm({
      name: '',
      price: '',
      stock: '',
    })

    setEditingId(null)
    setFormError('')
  }

  function handleEdit(product) {
    setEditingId(product.id)

    setForm({
      name: product.name || '',
      price: product.price || '',
      stock: product.stock ?? '',
    })

    setFormError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    setFormError('')

    const name = form.name.trim()
    const price = Number(form.price)
    const stock = Number(form.stock)

    if (!name) {
      setFormError('Product name is required.')
      return
    }

    if (!form.price || price <= 0) {
      setFormError('Price must be greater than 0.')
      return
    }

    if (
      form.stock === '' ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      setFormError(
        'Stock must be a whole number greater than or equal to 0.',
      )
      return
    }

    const payload = {
      name,
      price,
      stock,
    }

    if (editingId) {
      updateMutation.mutate(
        {
          productId: editingId,
          data: payload,
        },
        {
          onSuccess: resetForm,
          onError: (mutationError) => {
            setFormError(
              mutationError?.response?.data?.detail ||
                'Unable to update product.',
            )
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: resetForm,
        onError: (mutationError) => {
          setFormError(
            mutationError?.response?.data?.detail ||
              'Unable to create product.',
          )
        },
      })
    }
  }

  function handleDelete(productId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (!confirmed) {
      return
    }

    deleteMutation.mutate(productId)
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending

  const lowStockCount = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 5,
  ).length

  return (
    <div className="page-shell">

      {/* HEADER */}
      <section className="pro-page-header">

        <div>
          <div className="page-title-row">

            <div className="page-title-icon">
              ▣
            </div>

            <div>
              <h1 className="pro-page-title">
                Products
              </h1>

              <p className="pro-page-description">
                Manage your catalog, pricing and inventory levels.
              </p>
            </div>

          </div>
        </div>

        <div className="page-header-stat">

          <div className="page-header-stat-icon">
            P
          </div>

          <div>
            <span className="page-header-stat-label">
              TOTAL PRODUCTS
            </span>

            <strong className="page-header-stat-value">
              {products.length}
            </strong>
          </div>

        </div>

      </section>

      {/* MAIN CONTENT */}
      <div className="product-layout">

        {/* PRODUCT TABLE */}
        <section>

          <div className="pro-toolbar">

            <div className="search-box">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            <span className="table-secondary">
              {lowStockCount} low-stock product
              {lowStockCount === 1 ? '' : 's'}
            </span>

          </div>

          <div className="pro-table-card">

            {filteredProducts.length === 0 ? (
              <div className="pro-empty">

                <div className="pro-empty-icon">
                  ▣
                </div>

                <h3>
                  No products found
                </h3>

                <p>
                  Add your first product using the form.
                </p>

              </div>
            ) : (
              <div className="pro-table-wrapper">

                <table className="pro-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredProducts.map(
                      (product) => {
                        const stock =
                          Number(product.stock)

                        return (
                          <tr key={product.id}>

                            <td>
                              <span className="table-id">
                                #{product.id}
                              </span>
                            </td>

                            <td>
                              <div className="table-user">

                                <div className="table-avatar">
                                  {product.name
                                    ?.charAt(0)
                                    .toUpperCase() || 'P'}
                                </div>

                                <div>
                                  <div className="table-primary">
                                    {product.name}
                                  </div>

                                  <div className="table-secondary">
                                    Product
                                  </div>
                                </div>

                              </div>
                            </td>

                            <td>
                              <strong>
                                ₹{Number(product.price).toFixed(2)}
                              </strong>
                            </td>

                            <td>
                              {stock === 0 ? (
                                <span className="stock-pill stock-empty">
                                  Out of stock
                                </span>
                              ) : stock <= 5 ? (
                                <span className="stock-pill stock-low">
                                  {stock} units
                                </span>
                              ) : (
                                <span className="stock-pill stock-good">
                                  {stock} units
                                </span>
                              )}
                            </td>

                            <td>
                              <div className="product-table-actions">

                                <button
                                  type="button"
                                  className="table-action edit"
                                  onClick={() =>
                                    handleEdit(product)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="table-action delete"
                                  onClick={() =>
                                    handleDelete(product.id)
                                  }
                                  disabled={
                                    deleteMutation.isPending
                                  }
                                >
                                  Delete
                                </button>

                              </div>
                            </td>

                          </tr>
                        )
                      },
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>

        {/* FORM */}
        <section className="product-form-card">

          <div className="product-form-title">

            <div className="product-form-title-icon">
              {editingId ? '✎' : '+'}
            </div>

            <div>
              <h2>
                {editingId
                  ? 'Edit Product'
                  : 'Add Product'}
              </h2>

              <p>
                {editingId
                  ? 'Update product information'
                  : 'Create a new product'}
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="product-form-grid">

              <div className="pro-input-group full">

                <label htmlFor="product-name">
                  PRODUCT NAME
                </label>

                <input
                  id="product-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />

              </div>

              <div className="pro-input-group">

                <label htmlFor="product-price">
                  PRICE
                </label>

                <input
                  id="product-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />

              </div>

              <div className="pro-input-group">

                <label htmlFor="product-stock">
                  STOCK
                </label>

                <input
                  id="product-stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                />

              </div>

            </div>

            {formError && (
              <div className="inline-error">
                {formError}
              </div>
            )}

            <div className="product-actions">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Product'
                    : 'Add Product'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

      </div>

    </div>
  )
}

export default Products