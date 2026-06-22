import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet'
import { containers, fillColor, type Container } from '../lib/data'

const DEPOT = { lat: 48.8566, lng: 2.3522 }

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

function nearestNeighbor(points: Container[]): Container[] {
  const remaining = [...points]
  const route: Container[] = []
  let current = DEPOT
  while (remaining.length) {
    let bestIdx = 0
    let bestDist = Infinity
    remaining.forEach((p, i) => {
      const d = haversine(current, p)
      if (d < bestDist) { bestDist = d; bestIdx = i }
    })
    const [next] = remaining.splice(bestIdx, 1)
    route.push(next)
    current = next
  }
  return route
}

function routeLength(route: Container[]) {
  let total = haversine(DEPOT, route[0])
  for (let i = 0; i < route.length - 1; i++) total += haversine(route[i], route[i + 1])
  total += haversine(route[route.length - 1], DEPOT)
  return total
}

function twoOpt(route: Container[]): Container[] {
  let improved = true
  let best = [...route]
  let bestLen = routeLength(best)
  let iterations = 0
  while (improved && iterations < 200) {
    improved = false
    iterations++
    for (let i = 0; i < best.length - 1; i++) {
      for (let j = i + 1; j < best.length; j++) {
        const candidate = [...best.slice(0, i), ...best.slice(i, j + 1).reverse(), ...best.slice(j + 1)]
        const len = routeLength(candidate)
        if (len < bestLen - 1e-6) {
          best = candidate
          bestLen = len
          improved = true
        }
      }
    }
  }
  return best
}

export default function Tours() {
  const [threshold, setThreshold] = useState(70)
  const [route, setRoute] = useState<Container[] | null>(null)
  const [computing, setComputing] = useState(false)
  const [stats, setStats] = useState<{ km: number; baseline: number; ms: number } | null>(null)

  const eligible = useMemo(
    () => containers.filter((c) => c.fill >= threshold),
    [threshold]
  )

  function runOptimization() {
    setComputing(true)
    setRoute(null)
    setTimeout(() => {
      const t0 = performance.now()
      const nn = nearestNeighbor(eligible)
      const baseline = routeLength(nn)
      const optimized = twoOpt(nn)
      const finalLen = routeLength(optimized)
      const ms = performance.now() - t0
      setRoute(optimized)
      setStats({ km: finalLen, baseline, ms })
      setComputing(false)
    }, 60)
  }

  const path = route
    ? [[DEPOT.lat, DEPOT.lng], ...route.map((c) => [c.lat, c.lng]), [DEPOT.lat, DEPOT.lng]]
    : []

  return (
    <div className="page">
      <div className="page-head">
        <h1>Optimisation de tournée</h1>
        <p>Heuristique Nearest Neighbor + amélioration 2-opt, exécutée côté client.</p>
      </div>

      <div className="tour-grid">
        <div className="map-card tour-map">
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
            {containers.map((c) => (
              <CircleMarker
                key={c.id}
                center={[c.lat, c.lng]}
                radius={c.fill >= threshold ? 6 : 3}
                pathOptions={{
                  color: fillColor(c.fill),
                  fillColor: fillColor(c.fill),
                  fillOpacity: c.fill >= threshold ? 0.9 : 0.35,
                }}
              >
                <Popup>{c.id} — {c.fill.toFixed(0)}%</Popup>
              </CircleMarker>
            ))}
            {path.length > 0 && (
              <Polyline positions={path as [number, number][]} pathOptions={{ color: '#1EE5A8', weight: 2.5, opacity: 0.8 }} />
            )}
          </MapContainer>
        </div>

        <aside className="tour-panel">
          <div className="control-card">
            <label className="slider-label">
              <span>Seuil de collecte</span>
              <span className="mono">{threshold}%</span>
            </label>
            <input
              type="range"
              min={40}
              max={95}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
            <p className="control-hint">{eligible.length} conteneurs au-dessus du seuil</p>
            <button className="btn-primary" onClick={runOptimization} disabled={computing || eligible.length === 0}>
              {computing ? 'Calcul en cours…' : 'Calculer la tournée'}
            </button>
          </div>

          {stats && (
            <div className="result-card">
              <h3 className="panel-title">Résultat</h3>
              <Metric label="Distance optimisée" value={`${stats.km.toFixed(1)} km`} />
              <Metric label="Distance Nearest Neighbor" value={`${stats.baseline.toFixed(1)} km`} />
              <Metric
                label="Gain du 2-opt"
                value={`${(((stats.baseline - stats.km) / stats.baseline) * 100).toFixed(1)}%`}
                positive
              />
              <Metric label="Temps de calcul" value={`${stats.ms.toFixed(0)} ms`} />
            </div>
          )}

          {route && (
            <div className="route-list-card">
              <h3 className="panel-title">Ordre de passage</h3>
              <ol className="route-list">
                {route.map((c, i) => (
                  <li key={c.id}>
                    <span className="route-index">{i + 1}</span>
                    <span className="mono">{c.id}</span>
                    <span className="route-zone">{c.zone}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function Metric({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      <span className={'metric-value mono' + (positive ? ' positive' : '')}>{value}</span>
    </div>
  )
}
