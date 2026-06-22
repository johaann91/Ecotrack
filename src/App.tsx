import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Containers from './pages/Containers'
import Tours from './pages/Tours'
import Citizens from './pages/Citizens'
import Admin from './pages/Admin'
import AppShell from './components/AppShell'
import { useAuth } from './hooks/useAuth'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter basename="/ecotrack">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="conteneurs" element={<Containers />} />
          <Route path="tournees" element={<Tours />} />
          <Route path="citoyens" element={<Citizens />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
