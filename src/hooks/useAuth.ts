import { useState, useCallback } from 'react'
import { USERS, type User } from '../lib/data'

const STORAGE_KEY = 'ecotrack_session'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const login = useCallback((email: string, password: string): User | null => {
    const found = USERS.find((u) => u.email === email && u.password === password)
    if (!found) return null
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    setUser(found)
    return found
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  return { user, login, logout }
}
