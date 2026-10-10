export function getApiErrorMessage(error) {
  const status = error?.response?.status
  const data = error?.response?.data

  if (!error?.response) {
    return 'Unable to connect to the server. Please check that the backend is running.'
  }

  if (status === 400) {
    return data?.message || 'Invalid request. Please check your input.'
  }

  if (status === 401) {
    return 'Your session has expired. Please log in again.'
  }

  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }

  if (status === 404) {
    return 'The requested resource was not found.'
  }

  if (status === 409) {
    return data?.message || 'This action conflicts with existing data.'
  }

  if (status === 422) {
    return data?.message || 'Please check the entered data and try again.'
  }

  if (status >= 500) {
    return 'The server encountered an unexpected error. Please try again later.'
  }

  return data?.message || 'Something went wrong. Please try again.'
}