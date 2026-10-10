import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <div className="not-found-number">404</div>

      <div className="eyebrow">
        PAGE NOT FOUND
      </div>

      <h1>We couldn't find that page.</h1>

      <p>
        The page you're looking for doesn't exist or
        may have been moved.
      </p>

      <button
        className="btn btn-primary"
        type="button"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
    </div>
  )
}

export default NotFound