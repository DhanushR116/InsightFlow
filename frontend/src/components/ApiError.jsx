import { getApiErrorMessage } from '../utils/apiError'

function ApiError({ error, onRetry }) {
  return (
    <div>
      <h3>Something went wrong</h3>

      <p>{getApiErrorMessage(error)}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}

export default ApiError