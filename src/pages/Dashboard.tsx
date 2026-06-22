import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { containers as seedContainers, tickContainers, fillColor, type Container } from '../lib/data'

export default function Dashboard() {
  const [list, setList] = useState<Container[]>(seedContainers)

  useEffect(() => {
    const id = setInterval(() => setList([...tickContainers()]), 4000)
    return () => clearInterval(id)
  }, [])

  const stats = useMemo(() => {
    const critical = list.filter((c) => c.status === 'critical').length
    const warning = list.filter((c) => c.status === 'warning').length
    const avg = list.reduce((s, c) => s + c.fill, 0) / list.length
    return { critical, warning, avg: avg.toFixed(0), total: list.length }
  }, [list])

  const alerts = useMemo(
    () => [...list].filter((c) => c.status !== 'ok').sort((a, b) => b.fill - a.fill).slice(0, 6),
    [list]
  )

  return (
    <div className="dashboard">
      <div className="stat-row">
        <StatCard label="Conteneurs suivis" value={stats.total} tone="data" />
        <StatCard label="Remplissage moyen" value={`${stats.avg}%`} tone="data" />
        <StatCard label="Seuil d'alerte" value={stats.warning} tone="heat" />
        <StatCard label="Critiques" value={stats.critical} tone="crit" />
      </div>

      <div className="dashboard-grid">
        <div className="map-card">
          <MapContainer
            center={[48.8566, 2.3522]}
            zoom={12}
            scrollWheelZoom
            style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />
            {list.map((c) => (
              <CircleMarker
                key={c.id}
                center={[c.lat, c.lng]}
                radius={c.status === 'critical' ? 8 : 6}
                pathOptions={{
                  color: fillColor(c.fill),
                  fillColor: fillColor(c.fill),
                  fillOpacity: 0.85,
                  weight: c.status === 'critical' ? 2 : 1,
                }}
              >
                <Popup>
                  <strong>{c.id}</strong> · {c.zone}<br />
                  {c.type} — {c.fill.toFixed(0)}% plein<br />
                  Batterie {c.battery}%
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <aside className="alerts-panel">
          <h3 className="panel-title">Conteneurs à surveiller</h3>
          <ul className="alert-list">
            {alerts.map((c) => (
              <li key={c.id} className="alert-row">
                <span className="alert-dot" style={{ background: fillColor(c.fill) }} />
                <div className="alert-info">
                  <span className="alert-id">{c.id}</span>
                  <span className="alert-zone">{c.zone} · {c.type}</span>
                </div>
                <span className="alert-fill">{c.fill.toFixed(0)}%</span>
              </li>
            ))}
            {alerts.length === 0 && (
              <li className="alert-empty">Aucune alerte — tout est sous contrôle.</li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  )
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone: 'data' | 'heat' | 'crit' }) {
  return (
    <div className="stat-card" data-tone={tone}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
