
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'

import { useCustomers } from '../hooks/useCustomers'

function Customers() {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isError,
    error,
  } = useCustomers()

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const customers = Array.isArray(data) ? data : []

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase()

    return (
      customer.name?.toLowerCase().includes(value) ||
      customer.email?.toLowerCase().includes(value) ||
      customer.phone?.toLowerCase().includes(value)
    )
  })

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function openForm() {
    setForm({ name: '', email: '', phone: '' })
    setFormError('')
    setSuccessMessage('')
    setShowForm(true)
  }

  function closeForm() {
    if (saving) return

    setShowForm(false)
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setSuccessMessage('')

    const name = form.name.trim()
    const email = form.email.trim()
    const phone = form.phone.trim()

    if (!name || !email) {
      setFormError('Customer name and email are required.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.')
      return
    }

    setSaving(true)

    try {
      await apiClient.post('/api/customers/', {
        name,
        email,
        phone: phone || null,
      })

      await queryClient.invalidateQueries({
        queryKey: ['customers'],
      })

      setShowForm(false)
      setForm({ name: '', email: '', phone: '' })
      setSuccessMessage('Customer added successfully.')
    } catch (err) {
      const detail = err.response?.data?.detail

      setFormError(
        typeof detail === 'string'
          ? detail
          : 'Unable to create customer. Please check the details and try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-state">
        <div className="loading-card">
          <div className="loading-spinner" />
          <h2>Loading customers</h2>
          <p>Fetching your customer records...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-state">
        <div className="error-card">
          <div className="error-icon">!</div>
          <h2>Unable to load customers</h2>
          <p>
            {error?.response?.data?.detail ||
              error?.message ||
              'Something went wrong.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <section className="pro-page-header">
        <div className="page-title-row">
          <div className="page-title-icon">◉</div>

          <div>
            <h1 className="pro-page-title">Customers</h1>
            <p className="pro-page-description">
              Manage your customer relationships and contact information.
            </p>
          </div>
        </div>

        <div className="customer-header-actions">
          <div className="page-header-stat">
            <div className="page-header-stat-icon">C</div>
            <div>
              <span className="page-header-stat-label">
                TOTAL CUSTOMERS
              </span>
              <strong className="page-header-stat-value">
                {customers.length}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="customer-add-button"
            onClick={openForm}
          >
            <span aria-hidden="true">＋</span>
            Add Customer
          </button>
        </div>
      </section>

      {successMessage && (
        <div className="customer-alert customer-alert-success" role="status">
          <span aria-hidden="true">✓</span>
          {successMessage}
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      <div className="pro-toolbar">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search customers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search customers"
          />
        </div>

        <span className="table-secondary">
          Showing {filteredCustomers.length} of {customers.length} customers
        </span>
      </div>

      <div className="pro-table-card">
        {filteredCustomers.length === 0 ? (
          <div className="pro-empty">
            <div className="pro-empty-icon">◉</div>
            <h3>{search ? 'No customers found' : 'No customers yet'}</h3>
            <p>
              {search
                ? 'Try a different search term.'
                : 'Add your first customer to get started.'}
            </p>

            {!search && (
              <button
                type="button"
                className="customer-add-button"
                onClick={openForm}
              >
                ＋ Add Customer
              </button>
            )}
          </div>
        ) : (
          <div className="pro-table-wrapper">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <span className="table-id">#{customer.id}</span>
                    </td>

                    <td>
                      <div className="table-user">
                        <div className="table-avatar">
                          {customer.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div className="table-primary">
                            {customer.name}
                          </div>
                          <div className="table-secondary">Customer</div>
                        </div>
                      </div>
                    </td>

                    <td>{customer.email}</td>
                    <td>{customer.phone || '—'}</td>

                    <td>
                      <span className="badge badge-success">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="customer-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm()
          }}
        >
          <section
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-modal-title"
          >
            <div className="customer-modal-header">
              <div>
                <span className="customer-modal-eyebrow">CUSTOMER MANAGEMENT</span>
                <h2 id="customer-modal-title">Add New Customer</h2>
                <p>Enter the customer's contact information below.</p>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="customer-form-body">
                <div className="customer-field">
                  <label htmlFor="customer-name">Customer Name *</label>
                  <input
                    id="customer-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Rahul Kumar"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={100}
                    autoFocus
                    required
                  />
                </div>

                <div className="customer-field">
                  <label htmlFor="customer-email">Email Address *</label>
                  <input
                    id="customer-email"
                    name="email"
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={form.email}
                    onChange={handleChange}
                    maxLength={255}
                    required
                  />
                </div>

                <div className="customer-field">
                  <label htmlFor="customer-phone">Phone Number</label>
                  <input
                    id="customer-phone"
                    name="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={30}
                  />
                  <span className="customer-field-hint">
                    Phone number is optional.
                  </span>
                </div>

                {formError && (
                  <div className="customer-alert customer-alert-error" role="alert">
                    <span aria-hidden="true">!</span>
                    {formError}
                  </div>
                )}
              </div>

              <div className="customer-modal-footer">
                <button
                  type="button"
                  className="customer-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="customer-add-button"
                  disabled={saving}
                >
                  {saving ? 'Saving Customer...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Customers