// Simulated data layer — stands in for the PostgreSQL + PostGIS + TimescaleDB
// backend described in the technical dossier. Same shapes, same business rules.

export type ContainerStatus = 'ok' | 'warning' | 'critical'
export type WasteType = 'Verre' | 'Plastique' | 'Papier' | 'Ordures'
export type Role = 'admin' | 'gestionnaire' | 'agent' | 'citoyen'

export interface Container {
  id: string
  zone: string
  type: WasteType
  lat: number
  lng: number
  fill: number
  battery: number
  status: ContainerStatus
  lastSeen: string
}

export interface Report {
  id: string
  containerId: string
  citizen: string
  type: string
  status: 'pending' | 'resolved'
  createdAt: string
}

export interface User {
  email: string
  password: string
  role: Role
  name: string
  initials: string
}

export const ZONES = [
  'Centre', 'Nord', 'Sud', 'Est', 'Ouest',
  'Belleville', 'Montmartre', 'Marais', 'Bastille',
  'Nation', 'République', 'Opéra',
]

const TYPES: WasteType[] = ['Verre', 'Plastique', 'Papier', 'Ordures']

export const USERS: User[] = [
  { email: 'admin@ecotrack.fr', password: 'admin123', role: 'admin', name: 'Admin Système', initials: 'AS' },
  { email: 'gestionnaire@ecotrack.fr', password: 'gest123', role: 'gestionnaire', name: 'Marie Dupont', initials: 'MD' },
  { email: 'agent@ecotrack.fr', password: 'agent123', role: 'agent', name: 'Thomas Martin', initials: 'TM' },
  { email: 'citoyen@ecotrack.fr', password: 'cit123', role: 'citoyen', name: 'Sophie Bernard', initials: 'SB' },
]

function statusOf(fill: number): ContainerStatus {
  if (fill >= 85) return 'critical'
  if (fill >= 65) return 'warning'
  return 'ok'
}

function seedContainers(): Container[] {
  const list: Container[] = []
  let idx = 1
  for (const zone of ZONES) {
    const count = 4 + (idx % 2)
    for (let i = 0; i < count; i++) {
      const fill = Math.round(10 + Math.random() * 85)
      list.push({
        id: `CTN-${String(idx).padStart(3, '0')}`,
        zone,
        type: TYPES[idx % TYPES.length],
        lat: 48.8566 + (Math.random() - 0.5) * 0.09,
        lng: 2.3522 + (Math.random() - 0.5) * 0.13,
        fill,
        battery: Math.round(20 + Math.random() * 78),
        status: statusOf(fill),
        lastSeen: new Date().toISOString(),
      })
      idx++
    }
  }
  return list
}

export let containers: Container[] = seedContainers()

export function tickContainers() {
  containers = containers.map((c) => {
    const delta = (Math.random() - 0.32) * 3.5
    const fill = Math.min(100, Math.max(2, c.fill + delta))
    return { ...c, fill, status: statusOf(fill), lastSeen: new Date().toISOString() }
  })
  return containers
}

export const reports: Report[] = [
  { id: 'RPT-001', containerId: 'CTN-007', citizen: 'Sophie B.', type: 'Débordement', status: 'resolved', createdAt: '2026-05-10T09:30:00Z' },
  { id: 'RPT-002', containerId: 'CTN-023', citizen: 'Marc D.', type: 'Vandalisme', status: 'pending', createdAt: '2026-05-12T14:15:00Z' },
  { id: 'RPT-003', containerId: 'CTN-041', citizen: 'Alice M.', type: 'Accès bloqué', status: 'pending', createdAt: '2026-05-13T11:00:00Z' },
]

export const LEADERBOARD = [
  { rank: 1, name: 'Sophie Bernard', points: 2840, zone: 'Centre', reports: 47 },
  { rank: 2, name: 'Marc Dubois', points: 2310, zone: 'Nord', reports: 38 },
  { rank: 3, name: 'Alice Martin', points: 1980, zone: 'Marais', reports: 31 },
  { rank: 4, name: 'Paul Renard', points: 1740, zone: 'Bastille', reports: 28 },
  { rank: 5, name: 'Emma Petit', points: 1520, zone: 'Est', reports: 22 },
  { rank: 6, name: 'Lucas Moreau', points: 1340, zone: 'Ouest', reports: 19 },
]

export function fillColor(fill: number): string {
  if (fill >= 85) return '#FF5470'
  if (fill >= 65) return '#FF8C42'
  return '#1EE5A8'
}
