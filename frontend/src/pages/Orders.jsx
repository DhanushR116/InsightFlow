import { useState } from 'react'
import { useCustomers } from '../hooks/useCustomers'
import { useProducts } from '../hooks/useProducts'
import { useOrders } from '../hooks/useOrders'
import { useCreateOrder } from '../hooks/useOrderMutations'

function Orders() {
  const {
    data: customers = [],
    isLoading: customersLoading,
  } = useCustomers()

  const {
    data: products = [],
    isLoading: productsLoading,
  } = useProducts()

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError,
    error,
  } = useOrders()

  const createOrderMutation =
    useCreateOrder()

  const [customerId, setCustomerId] =
    useState('')

  const [productId, setProductId] =
    useState('')

  const [quantity, setQuantity] =
    useState(1)

  const [message, setMessage] =
    useState('')

  const [errorMessage, setErrorMessage] =
    useState('')

  const selectedProduct =
    products.find(
      (product) =>
        product.id === Number(productId),
    )

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage('')
    setErrorMessage('')

    if (!customerId) {
      setErrorMessage(
        'Please select a customer.',
      )
      return
    }

    if (!productId) {
      setErrorMessage(
        'Please select a product.',
      )
      return
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      setErrorMessage(
        'Quantity must be greater than 0.',
      )
      return
    }

    if (
      selectedProduct &&
      Number(quantity) >
        Number(selectedProduct.stock)
    ) {
      setErrorMessage(
        `Only ${selectedProduct.stock} units are available.`,
      )
      return
    }

    try {
      await createOrderMutation.mutateAsync({
        customer_id: Number(customerId),

        items: [
          {
            product_id: Number(productId),
            quantity: Number(quantity),
          },
        ],
      })

      setMessage(
        'Order created successfully.',
      )

      setCustomerId('')
      setProductId('')
      setQuantity(1)
    } catch (err) {
      console.error(err)

      setErrorMessage(
        err.response?.data?.detail ||
          'Unable to create order.',
      )
    }
  }

  const loading =
    customersLoading ||
    productsLoading ||
    ordersLoading

  return (
    <div className="page-shell">

      {/* HEADER */}
      <section className="pro-page-header">

        <div>

          <div className="page-title-row">

            <div className="page-title-icon">
              ▤
            </div>

            <div>
              <h1 className="pro-page-title">
                Orders
              </h1>

              <p className="pro-page-description">
                Create customer orders and monitor order history.
              </p>
            </div>

          </div>

        </div>

        <div className="page-header-stat">

          <div className="page-header-stat-icon">
            O
          </div>

          <div>
            <span className="page-header-stat-label">
              TOTAL ORDERS
            </span>

            <strong className="page-header-stat-value">
              {orders.length}
            </strong>
          </div>

        </div>

      </section>

      {/* CREATE ORDER */}
      <div className="order-layout">

        <section className="order-form-card">

          <div className="product-form-title">

            <div className="product-form-title-icon">
              +
            </div>

            <div>
              <h2>
                Create New Order
              </h2>

              <p>
                Select a customer, product and quantity.
              </p>
            </div>

          </div>

          <form
            className="order-form"
            onSubmit={handleSubmit}
          >

            <div className="pro-input-group">

              <label htmlFor="order-customer">
                CUSTOMER
              </label>

              <select
                id="order-customer"
                value={customerId}
                onChange={(event) =>
                  setCustomerId(
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Select customer
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name}
                    </option>
                  ),
                )}
              </select>

            </div>

            <div className="pro-input-group">

              <label htmlFor="order-product">
                PRODUCT
              </label>

              <select
                id="order-product"
                value={productId}
                onChange={(event) =>
                  setProductId(
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Select product
                </option>

                {products.map(
                  (product) => (
                    <option
                      key={product.id}
                      value={product.id}
                      disabled={
                        Number(product.stock) <= 0
                      }
                    >
                      {product.name} — ₹
                      {Number(
                        product.price,
                      ).toFixed(2)}
                    </option>
                  ),
                )}
              </select>

            </div>

            <div className="pro-input-group">

              <label htmlFor="order-quantity">
                QUANTITY
              </label>

              <input
                id="order-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    event.target.value,
                  )
                }
              />

            </div>

            {selectedProduct && (
              <div className="selected-product">

                <div className="selected-product-icon">
                  P
                </div>

                <div className="selected-product-info">

                  <strong>
                    {selectedProduct.name}
                  </strong>

                  <span>
                    ₹
                    {Number(
                      selectedProduct.price,
                    ).toFixed(2)}{' '}
                    per unit
                  </span>

                </div>

                <div className="selected-stock">

                  <small>
                    AVAILABLE
                  </small>

                  <strong>
                    {selectedProduct.stock}
                  </strong>

                </div>

              </div>
            )}

            {message && (
              <div className="success-message">

                <span>
                  ✓
                </span>

                {message}

              </div>
            )}

            {errorMessage && (
              <div className="inline-error">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary order-submit"
              disabled={
                createOrderMutation.isPending
              }
            >
              {createOrderMutation.isPending
                ? 'Creating Order...'
                : 'Create Order'}
            </button>

          </form>

        </section>

        {/* INFORMATION CARD */}
        <aside className="order-info-card">

          <div className="order-info-icon">
            O
          </div>

          <h3>
            Order Management
          </h3>

          <p>
            Create orders directly from your business
            dashboard. Stock is checked before an order
            is created.
          </p>

          <div className="order-info-list">

            <div className="order-info-item">
              <span>1</span>
              <span>Select a customer</span>
            </div>

            <div className="order-info-item">
              <span>2</span>
              <span>Select an available product</span>
            </div>

            <div className="order-info-item">
              <span>3</span>
              <span>Enter the required quantity</span>
            </div>

            <div className="order-info-item">
              <span>4</span>
              <span>Create the order</span>
            </div>

          </div>

        </aside>

      </div>

      {/* ORDER HISTORY */}
      <section className="pro-table-card">

        <div
          style={{
            padding: '20px 20px 0',
          }}
        >
          <div className="product-form-title">
            <div className="product-form-title-icon">
              ◷
            </div>

            <div>
              <h2>
                Order History
              </h2>

              <p>
                Recent orders recorded in InsightFlow.
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="pro-empty">
            <div className="loading-spinner" />

            <h3>
              Loading orders...
            </h3>
          </div>
        )}

        {isError && (
          <div className="pro-empty">

            <div className="pro-empty-icon">
              !
            </div>

            <h3>
              Unable to load orders
            </h3>

            <p>
              {error?.response?.data?.detail ||
                error?.message ||
                'Something went wrong.'}
            </p>

          </div>
        )}

        {!loading &&
          !isError &&
          orders.length === 0 && (
            <div className="pro-empty">

              <div className="pro-empty-icon">
                ▤
              </div>

              <h3>
                No orders yet
              </h3>

              <p>
                Create your first order using the form above.
              </p>

            </div>
          )}

        {!loading &&
          !isError &&
          orders.length > 0 && (
            <div className="pro-table-wrapper">

              <table className="pro-table">

                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Items</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr key={order.id}>

                      <td>
                        <span className="table-id">
                          #{order.id}
                        </span>
                      </td>

                      <td>
                        <strong className="table-primary">
                          Customer #{order.customer_id}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          ₹
                          {Number(
                            order.total_amount,
                          ).toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        {Array.isArray(order.items)
                          ? order.items.length
                          : '—'}
                      </td>

                      <td>
                        <span className="badge badge-success">
                          Completed
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

      </section>

    </div>
  )
}

export default Orders