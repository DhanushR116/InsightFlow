import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { isAuthenticated } from '../utils/auth'

function MainLayout({ children }) {
  const location = useLocation()

  const {
    data: currentUser,
    isLoading: isUserLoading,
  } = useCurrentUser()

  if (location.pathname === '/login') {
    return (
      <div className="login-layout">
        {children}
      </div>
    )
  }

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR */}
      <Navbar />

      {/* RIGHT APPLICATION AREA */}
      <div className="app-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>InsightFlow</span>

            <span className="breadcrumb-separator">
              /
            </span>

            <strong>
              {getPageName(location.pathname)}
            </strong>
          </div>

          <div className="topbar-right">
            {isAuthenticated() && (
              <div className="user-profile">
                <div className="user-avatar">
                  {currentUser?.username
                    ?.charAt(0)
                    .toUpperCase() || 'U'}
                </div>

                <div className="user-info">
                  <strong>
                    {isUserLoading
                      ? 'Loading...'
                      : currentUser?.username || 'User'}
                  </strong>

                  <span>
                    {isUserLoading
                      ? ''
                      : currentUser?.role || 'User'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* PAGE */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

function getPageName(pathname) {
  const pageNames = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/customers': 'Customers',
    '/products': 'Products',
    '/orders': 'Orders',
    '/audit-logs': 'Audit Logs',
  }

  return pageNames[pathname] || 'Page'
}

export default MainLayout