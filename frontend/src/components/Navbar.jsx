import { NavLink, useNavigate } from 'react-router-dom'
import { removeToken } from '../utils/auth'

const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: '▣',
  },
  {
    path: '/customers',
    label: 'Customers',
    icon: '◉',
  },
  {
    path: '/products',
    label: 'Products',
    icon: '▣',
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: '▤',
  },
  {
    path: '/audit-logs',
    label: 'Audit Logs',
    icon: '◷',
  },
]

function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    removeToken()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          I
        </div>

        <div>
          <div className="brand-name">
            InsightFlow
          </div>

          <div className="brand-subtitle">
            Business Intelligence
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div>
        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* SIDEBAR BOTTOM */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">
            ⇥
          </span>

          <span>
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}

export default Navbar