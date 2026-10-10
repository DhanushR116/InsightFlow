import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkHealth } from '../api/health'

function Home() {
  const [health, setHealth] =
    useState(null)

  const [error, setError] =
    useState(null)

  useEffect(() => {
    async function loadHealth() {
      try {
        const data = await checkHealth()

        setHealth(data)
        setError(null)
      } catch (err) {
        console.error(err)

        setHealth(null)
        setError(
          'Unable to connect to backend.',
        )
      }
    }

    loadHealth()
  }, [])

  return (
    <div className="home-page">

      <div className="home-container">

        {/* HERO */}
        <section className="home-hero">

          <div className="home-badge">
            BUSINESS MANAGEMENT PLATFORM
          </div>

          <h1>
            Run your business smarter with{' '}
            <span>
              InsightFlow.
            </span>
          </h1>

          <p>
            Manage customers, products, orders,
            inventory and business analytics from
            one powerful workspace.
          </p>

          <div className="home-actions">

            <Link
              to="/dashboard"
              className="home-primary-button"
            >
              Open Dashboard →
            </Link>

            <Link
              to="/customers"
              className="home-secondary-button"
            >
              View Customers
            </Link>

          </div>

        </section>

        {/* FEATURES */}
        <section className="home-features">

          <div className="home-feature">

            <div className="home-feature-icon">
              C
            </div>

            <strong>
              Customer Management
            </strong>

            <p>
              Keep customer information organized
              and accessible from one place.
            </p>

          </div>

          <div className="home-feature">

            <div className="home-feature-icon">
              P
            </div>

            <strong>
              Product & Inventory
            </strong>

            <p>
              Track products, pricing and stock
              levels with a clean workspace.
            </p>

          </div>

          <div className="home-feature">

            <div className="home-feature-icon">
              A
            </div>

            <strong>
              Business Analytics
            </strong>

            <p>
              Understand revenue, orders and
              inventory through visual analytics.
            </p>

          </div>

        </section>

        {/* BACKEND STATUS */}
        <section className="backend-status">

          <div className="backend-status-left">

            <span
              className={`status-dot ${
                health
                  ? 'online'
                  : 'offline'
              }`}
            />

            <div>
              <strong>
                Backend API
              </strong>

              <span>
                {health
                  ? ' Connected and operational'
                  : error ||
                    ' Checking connection...'}
              </span>
            </div>

          </div>

          <span>
            {health
              ? 'Online'
              : 'Offline'}
          </span>

        </section>

      </div>

    </div>
  )
}

export default Home