import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const NAV_BY_ROLE: Record<string, { to: string; label: string }[]> = {
  admin: [
    { to: '/app', label: 'Carte' },
    { to: '/app/conteneurs', label: 'Conteneurs' },
    { to: '/app/tournees', label: 'Tournées' },
    { to: '/app/citoyens', label: 'Citoyens' },
    { to: '/app/admin', label: 'Administration' },
  ],
  gestionnaire: [
    { to: '/app', label: 'Carte' },
    { to: '/app/conteneurs', label: 'Conteneurs' },
    { to: '/app/tournees', label: 'Tournées' },
    { to: '/app/citoyens', label: 'Citoyens' },
  ],
  agent: [
    { to: '/app', label: 'Carte' },
    { to: '/app/tournees', label: 'Ma tournée' },
  ],
  citoyen: [
    { to: '/app/citoyens', label: 'Espace citoyen' },
    { to: '/app', label: 'Carte' },
  ],
}

export default function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/')
    return null
  }

  const links = NAV_BY_ROLE[user.role] ?? NAV_BY_ROLE.gestionnaire

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <span className="brand-glyph">⟁</span>
          <span className="brand-word">EcoTrack</span>
        </div>
        <nav className="shell-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/app'}
              className={({ isActive }) => 'shell-nav-link' + (isActive ? ' active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="shell-user">
          <span className="role-tag" data-role={user.role}>{user.role}</span>
          <div className="avatar">{user.initials}</div>
          <button className="btn-ghost" onClick={handleLogout}>Sortir</button>
        </div>
      </header>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  )
}
