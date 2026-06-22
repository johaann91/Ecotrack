import { useState } from 'react'
import { LEADERBOARD, containers, reports as seedReports } from '../lib/data'
import { useAuth } from '../hooks/useAuth'

export default function Citizens() {
  const { user } = useAuth()
  const [reports, setReports] = useState(seedReports)
  const [containerId, setContainerId] = useState(containers[0]?.id ?? '')
  const [type, setType] = useState('Débordement')
  const [sent, setSent] = useState(false)

  function submitReport(e: React.FormEvent) {
    e.preventDefault()
    setReports([
      {
        id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
        containerId,
        citizen: user?.name ?? 'Anonyme',
        type,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      ...reports,
    ])
    setSent(true)
    setTimeout(() => setSent(false), 2600)
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Espace citoyen</h1>
        <p>Signaler un incident rapporte des points et fait avancer le classement de votre quartier.</p>
      </div>

      <div className="citizen-grid">
        <div className="leaderboard-card">
          <h3 className="panel-title">Classement des contributeurs</h3>
          <ol className="leaderboard-list">
            {LEADERBOARD.map((p) => (
              <li key={p.rank} className="leaderboard-row">
                <span className="leaderboard-rank">{p.rank}</span>
                <div className="leaderboard-info">
                  <span>{p.name}</span>
                  <span className="leaderboard-zone">{p.zone} · {p.reports} signalements</span>
                </div>
                <span className="mono leaderboard-points">{p.points.toLocaleString('fr-FR')} pts</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="report-card">
          <h3 className="panel-title">Signaler un conteneur</h3>
          <form onSubmit={submitReport} className="report-form">
            <label className="field">
              <span>Conteneur concerné</span>
              <select value={containerId} onChange={(e) => setContainerId(e.target.value)}>
                {containers.slice(0, 30).map((c) => (
                  <option key={c.id} value={c.id}>{c.id} — {c.zone}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Nature du problème</span>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Débordement</option>
                <option>Vandalisme</option>
                <option>Accès bloqué</option>
                <option>Capteur défaillant</option>
              </select>
            </label>
            <button type="submit" className="btn-primary">Envoyer le signalement</button>
            {sent && <p className="report-confirm">Signalement enregistré — 10 points crédités.</p>}
          </form>

          <h4 className="panel-subtitle">Derniers signalements</h4>
          <ul className="report-list">
            {reports.slice(0, 5).map((r) => (
              <li key={r.id} className="report-row">
                <span className="mono">{r.containerId}</span>
                <span>{r.type}</span>
                <span className="status-pill" data-status={r.status === 'resolved' ? 'ok' : 'warning'}>
                  {r.status === 'resolved' ? 'Résolu' : 'En attente'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
