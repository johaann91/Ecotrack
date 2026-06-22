import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { USERS } from '../lib/data'

const DEMO = [
  { role: 'admin' as const, label: 'Admin' },
  { role: 'gestionnaire' as const, label: 'Gestionnaire' },
  { role: 'agent' as const, label: 'Agent terrain' },
  { role: 'citoyen' as const, label: 'Citoyen' },
]

// Deterministic pseudo-random city of blips for the signature visual.
function useBlips(count: number) {
  return useMemo(() => {
    const out = []
    let seed = 42
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    for (let i = 0; i < count; i++) {
      out.push({
        x: 6 + rand() * 88,
        y: 6 + rand() * 88,
        r: 1.3 + rand() * 1,
        delay: rand() * 4,
        dur: 2.4 + rand() * 2.2,
        hot: rand() > 0.82,
      })
    }
    return out
  }, [count])
}

export default function Login() {
  const [email, setEmail] = useState('gestionnaire@ecotrack.fr')
  const [password, setPassword] = useState('gest123')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const blips = useBlips(46)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = login(email, password)
    if (!found) {
      setError('Identifiants incorrects.')
      return
    }
    navigate('/app')
  }

  function fillDemo(role: typeof DEMO[number]['role']) {
    const u = USERS.find((x) => x.role === role)!
    setEmail(u.email)
    setPassword(u.password)
    setError('')
  }

  return (
    <div className="login-screen">
      <div className="login-visual" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="glow" cx="50%" cy="42%" r="65%">
              <stop offset="0%" stopColor="#0F2A3D" />
              <stop offset="100%" stopColor="#06141F" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#glow)" />
          {blips.map((b, i) => (
            <circle
              key={i}
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill={b.hot ? '#FF8C42' : '#1EE5A8'}
              opacity="0.85"
              style={{
                animation: `blip-pulse ${b.dur}s ease-in-out ${b.delay}s infinite`,
              }}
            />
          ))}
        </svg>
        <div className="login-visual-caption">
          <span className="dot-live" />
          2 412 capteurs actifs · métropole simulée
        </div>
      </div>

      <div className="login-panel">
        <div className="login-panel-inner">
          <div className="brand-mark">
            <span className="brand-glyph">⟁</span>
            <span className="brand-word">EcoTrack</span>
          </div>
          <h1 className="login-title">Suivre les déchets,<br />pas les deviner.</h1>
          <p className="login-sub">
            Connectez-vous pour piloter la collecte en temps réel.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="field">
              <span>Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary login-submit">
              Entrer dans EcoTrack
            </button>
          </form>

          <div className="demo-rail">
            <span className="demo-rail-label">Accès rapide démonstration</span>
            <div className="demo-rail-grid">
              {DEMO.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  className="demo-chip"
                  onClick={() => fillDemo(d.role)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
