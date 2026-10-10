import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useDashboardAnalytics } from '../hooks/useAnalytics'

function Dashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useDashboardAnalytics()

  if (isLoading) {
    return (
      <div className="page-state">
        <div className="loading-card">
          <div className="loading-spinner" />

          <h2>
            Loading dashboard
          </h2>

          <p>
            Fetching your business data...
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
            Unable to load dashboard
          </h2>

          <p>
            {error?.message ||
              'Something went wrong while loading your dashboard.'}
          </p>
        </div>
      </div>
    )
  }

  const inventory = Array.isArray(data?.inventory)
    ? data.inventory
    : []

  const revenue = Array.isArray(data?.revenue)
    ? data.revenue
    : []

  const totalCustomers = data?.total_customers ?? 0
  const totalProducts = data?.total_products ?? 0
  const totalOrders = data?.total_orders ?? 0
  const totalRevenue = data?.total_revenue ?? 0
  const totalInventory = data?.total_inventory ?? 0

  return (
    <div className="dashboard-page">

      {/* HERO */}
      <section className="dashboard-hero">
        <div>
          <div className="eyebrow">
            BUSINESS OVERVIEW
          </div>

          <h1>
            Dashboard
          </h1>

          <p>
            Monitor your business performance and activity
            from one place.
          </p>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <span className="stat-label">
                Total Customers
              </span>

              <span className="stat-value">
                {totalCustomers}
              </span>
            </div>

            <div className="stat-icon customers-icon">
              C
            </div>
          </div>

          <div className="stat-footer">
            Active customer records
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <span className="stat-label">
                Total Products
              </span>

              <span className="stat-value">
                {totalProducts}
              </span>
            </div>

            <div className="stat-icon products-icon">
              P
            </div>
          </div>

          <div className="stat-footer">
            Products in catalog
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <span className="stat-label">
                Total Orders
              </span>

              <span className="stat-value">
                {totalOrders}
              </span>
            </div>

            <div className="stat-icon orders-icon">
              O
            </div>
          </div>

          <div className="stat-footer">
            Orders processed
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <span className="stat-label">
                Total Revenue
              </span>

              <span className="stat-value revenue-value">
                ₹{Number(totalRevenue).toFixed(2)}
              </span>
            </div>

            <div className="stat-icon revenue-icon">
              ₹
            </div>
          </div>

          <div className="stat-footer">
            Revenue generated
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <span className="stat-label">
                Total Inventory
              </span>

              <span className="stat-value">
                {totalInventory}
              </span>
            </div>

            <div className="stat-icon inventory-icon">
              I
            </div>
          </div>

          <div className="stat-footer">
            Units currently available
          </div>
        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>
              Quick Actions
            </h2>

            <p>
              Quickly access the main areas of your business.
            </p>
          </div>
        </div>

        <div className="quick-actions">

          <a
            href="/customers"
            className="quick-action-card"
          >
            <div className="quick-action-icon customers-icon">
              C
            </div>

            <div>
              <strong>
                Manage Customers
              </strong>

              <span>
                View and manage customer records
              </span>
            </div>

            <span className="quick-action-arrow">
              →
            </span>
          </a>

          <a
            href="/products"
            className="quick-action-card"
          >
            <div className="quick-action-icon products-icon">
              P
            </div>

            <div>
              <strong>
                Manage Products
              </strong>

              <span>
                Manage products and inventory
              </span>
            </div>

            <span className="quick-action-arrow">
              →
            </span>
          </a>

          <a
            href="/orders"
            className="quick-action-card"
          >
            <div className="quick-action-icon orders-icon">
              O
            </div>

            <div>
              <strong>
                Manage Orders
              </strong>

              <span>
                Create and view customer orders
              </span>
            </div>

            <span className="quick-action-arrow">
              →
            </span>
          </a>

        </div>
      </section>

      {/* ANALYTICS */}
      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <h2>
              Business Analytics
            </h2>

            <p>
              Monitor inventory and revenue activity.
            </p>
          </div>

          <div className="analytics-status">
            <span />
            Live data
          </div>
        </div>

        <div className="charts-grid">

          {/* INVENTORY */}
          <div className="chart-card">

            <div className="chart-header">
              <div>
                <h3>
                  Inventory Overview
                </h3>

                <p>
                  Current stock by product
                </p>
              </div>
            </div>

            <div className="chart-body">
              {inventory.length === 0 ? (
                <div className="chart-empty">
                  No inventory data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={inventory}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      tick={{ fontSize: 10 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="stock"
                      fill="#4f46e5"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* REVENUE */}
          <div className="chart-card">

            <div className="chart-header">
              <div>
                <h3>
                  Revenue by Order
                </h3>

                <p>
                  Revenue generated from orders
                </p>
              </div>
            </div>

            <div className="chart-body">
              {revenue.length === 0 ? (
                <div className="chart-empty">
                  No revenue data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart data={revenue}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />

                    <XAxis
                      dataKey="order_id"
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      tick={{ fontSize: 10 }}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: '#16a34a',
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Dashboard