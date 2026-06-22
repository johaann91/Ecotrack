import { USERS, reports } from '../lib/data'

export default function Admin() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>Administration</h1>
        <p>Comptes, rôles et journal des signalements.</p>
      </div>

      <div className="admin-grid">
        <div className="table-card">
          <h3 className="panel-title">Comptes</h3>
          <table className="data-table">
            <thead>
              <tr><th>Nom</th><th>Email</th><th>Rôle</th></tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.email}>
                  <td>{u.name}</td>
                  <td className="mono">{u.email}</td>
                  <td><span className="role-tag" data-role={u.role}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3 className="panel-title">Signalements</h3>
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Conteneur</th><th>Statut</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.id}</td>
                  <td className="mono">{r.containerId}</td>
                  <td>
                    <span className="status-pill" data-status={r.status === 'resolved' ? 'ok' : 'warning'}>
                      {r.status === 'resolved' ? 'Résolu' : 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
