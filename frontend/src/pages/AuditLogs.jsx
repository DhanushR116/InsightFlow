import { useAuditLogs } from '../hooks/useAuditLogs'

function formatDate(dateValue) {
  if (!dateValue) {
    return '—'
  }

  return new Date(dateValue).toLocaleString()
}

function AuditLogs() {
  const {
    data: auditLogs = [],
    isLoading,
    isError,
    error,
  } = useAuditLogs()

  if (isLoading) {
    return (
      <div className="page-state">
        <div className="loading-card">
          <div className="loading-spinner" />

          <h2>
            Loading activity
          </h2>

          <p>
            Fetching system audit records...
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
            Unable to load audit logs
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

  const logs = Array.isArray(auditLogs)
    ? auditLogs
    : []

  const uniqueUsers = new Set(
    logs
      .map((log) => log.user_id)
      .filter(Boolean),
  ).size

  const uniqueEntities = new Set(
    logs
      .map((log) => log.entity_type)
      .filter(Boolean),
  ).size

  return (
    <div className="page-shell">

      {/* HEADER */}
      <section className="pro-page-header">

        <div>

          <div className="page-title-row">

            <div className="page-title-icon">
              ◷
            </div>

            <div>
              <h1 className="pro-page-title">
                Audit Logs
              </h1>

              <p className="pro-page-description">
                Monitor important actions and system activity.
              </p>
            </div>

          </div>

        </div>

        <div className="page-header-stat">

          <div className="page-header-stat-icon">
            A
          </div>

          <div>
            <span className="page-header-stat-label">
              TOTAL EVENTS
            </span>

            <strong className="page-header-stat-value">
              {logs.length}
            </strong>
          </div>

        </div>

      </section>

      {/* SUMMARY */}
      <div className="audit-summary">

        <div className="audit-summary-card">

          <span>
            TOTAL EVENTS
          </span>

          <strong>
            {logs.length}
          </strong>

        </div>

        <div className="audit-summary-card">

          <span>
            ACTIVE USERS
          </span>

          <strong>
            {uniqueUsers}
          </strong>

        </div>

        <div className="audit-summary-card">

          <span>
            ENTITY TYPES
          </span>

          <strong>
            {uniqueEntities}
          </strong>

        </div>

      </div>

      {/* TABLE */}
      <div className="pro-table-card">

        {logs.length === 0 ? (
          <div className="pro-empty">

            <div className="pro-empty-icon">
              ◷
            </div>

            <h3>
              No audit activity yet
            </h3>

            <p>
              System activity will appear here as actions are performed.
            </p>

          </div>
        ) : (
          <div className="pro-table-wrapper">

            <table className="pro-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Description</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>

                {logs.map((log) => (
                  <tr key={log.id}>

                    <td>
                      <span className="table-id">
                        #{log.id}
                      </span>
                    </td>

                    <td>
                      {log.user_id
                        ? `User #${log.user_id}`
                        : 'System'}
                    </td>

                    <td>
                      <span className="action-badge">
                        {log.action || 'Activity'}
                      </span>
                    </td>

                    <td>
                      <span className="table-primary">
                        {log.entity_type || '—'}
                      </span>
                    </td>

                    <td>
                      {log.entity_id ?? '—'}
                    </td>

                    <td>
                      {log.description ||
                        log.details ||
                        '—'}
                    </td>

                    <td>
                      {formatDate(
                        log.created_at,
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default AuditLogs