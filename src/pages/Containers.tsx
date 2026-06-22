import { useEffect, useMemo, useState } from 'react'
import { containers as seed, tickContainers, fillColor, ZONES, type Container, type ContainerStatus } from '../lib/data'

export default function Containers() {
  const [list, setList] = useState<Container[]>(seed)
  const [zone, setZone] = useState<string>('all')
  const [status, setStatus] = useState<ContainerStatus | 'all'>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const id = setInterval(() => setList([...tickContainers()]), 5000)
    return () => clearInterval(id)
  }, [])

  const filtered = useMemo(() => {
    return list.filter((c) => {
      if (zone !== 'all' && c.zone !== zone) return false
      if (status !== 'all' && c.status !== status) return false
      if (query && !c.id.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [list, zone, status, query])

  return (
    <div className="page">
      <div className="page-head">
        <h1>Parc de conteneurs</h1>
        <p>{filtered.length} sur {list.length} conteneurs affichés</p>
      </div>

      <div className="filters-row">
        <input
          className="filter-input"
          placeholder="Rechercher un identifiant…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="filter-select" value={zone} onChange={(e) => setZone(e.target.value)}>
          <option value="all">Toutes les zones</option>
          {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
        <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="all">Tous statuts</option>
          <option value="ok">OK</option>
          <option value="warning">Seuil</option>
          <option value="critical">Critique</option>
        </select>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Zone</th>
              <th>Type</th>
              <th>Remplissage</th>
              <th>Batterie</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="mono">{c.id}</td>
                <td>{c.zone}</td>
                <td>{c.type}</td>
                <td>
                  <div className="fill-bar">
                    <div className="fill-bar-track">
                      <div
                        className="fill-bar-fill"
                        style={{ width: `${c.fill}%`, background: fillColor(c.fill) }}
                      />
                    </div>
                    <span className="mono fill-pct">{c.fill.toFixed(0)}%</span>
                  </div>
                </td>
                <td className="mono">{c.battery}%</td>
                <td>
                  <span className="status-pill" data-status={c.status}>
                    {c.status === 'ok' ? 'OK' : c.status === 'warning' ? 'Seuil' : 'Critique'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="table-empty">Aucun conteneur ne correspond à ces filtres.</div>
        )}
      </div>
    </div>
  )
}
