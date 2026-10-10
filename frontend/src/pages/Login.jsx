import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { saveToken } from '../utils/auth'

function Login() {
  const navigate = useNavigate()

  const [username, setUsername] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = await loginUser(
        username,
        password,
      )

      saveToken(data.access_token)

      navigate('/dashboard')
    } catch (err) {
      console.error(err)

      if (err.response?.data?.detail) {
        setError(
          err.response.data.detail,
        )
      } else {
        setError(
          'Login failed. Please check your credentials.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      {/* LEFT BRAND PANEL */}
      <section className="login-brand-panel">

        <div className="login-brand-content">

          <div className="login-logo">
            I
          </div>

          <h1>
            Welcome to{' '}
            <span>
              InsightFlow
            </span>
          </h1>

          <p>
            A modern business management workspace
            for customers, products, orders,
            inventory and analytics.
          </p>

          <div className="login-benefits">

            <div className="login-benefit">

              <div className="login-benefit-icon">
                ✓
              </div>

              Centralized business data
            </div>

            <div className="login-benefit">

              <div className="login-benefit-icon">
                ✓
              </div>

              Real-time inventory visibility
            </div>

            <div className="login-benefit">

              <div className="login-benefit-icon">
                ✓
              </div>

              Business analytics dashboard
            </div>

            <div className="login-benefit">

              <div className="login-benefit-icon">
                ✓
              </div>

              Secure authenticated access
            </div>

          </div>

        </div>

      </section>

      {/* LOGIN FORM */}
      <section className="login-form-panel">

        <div className="login-card">

          <div className="login-card-header">

            <h2>
              Sign in
            </h2>

            <p>
              Enter your credentials to access your workspace.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-field">

              <label htmlFor="username">
                USERNAME
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value,
                  )
                }
                placeholder="Enter your username"
                autoComplete="username"
                required
              />

            </div>

            <div className="login-field">

              <label htmlFor="password">
                PASSWORD
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? 'Signing in...'
                : 'Sign in to InsightFlow'}
            </button>

          </form>

          <div className="login-footer">
            InsightFlow Business Intelligence
          </div>

        </div>

      </section>

    </div>
  )
}

export default Login