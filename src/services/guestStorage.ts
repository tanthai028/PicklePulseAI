import { getGuestId } from './guestMode'

interface HealthStat {
  id: string
  date: string
  sleep_hours: number
  hunger: number
  soreness: number
  performance_rating: number
}

const STORAGE_KEYS = {
  HEALTH_STATS: 'guest_health_stats',
}

// Helper to generate a unique ID for guest data
const generateId = () => `guest_${Math.random().toString(36).substring(2)}_${Date.now()}`

// Get all health stats for guest
export const getGuestHealthStats = (): HealthStat[] => {
  const guestId = getGuestId()
  if (!guestId) return []
  
  const storedData = localStorage.getItem(`${STORAGE_KEYS.HEALTH_STATS}_${guestId}`)
  return storedData ? JSON.parse(storedData) : []
}

// Save a new health stat entry for guest
export const saveGuestHealthStat = (data: Omit<HealthStat, 'id'>) => {
  const guestId = getGuestId()
  if (!guestId) return null

  const stats = getGuestHealthStats()
  const newStat = {
    ...data,
    id: generateId(),
  }

  // Check if an entry for today already exists
  const today = new Date().toISOString().split('T')[0]
  const existingTodayIndex = stats.findIndex(stat => stat.date.split('T')[0] === today)

  if (existingTodayIndex !== -1) {
    // Update existing entry
    stats[existingTodayIndex] = {
      ...stats[existingTodayIndex],
      ...data,
    }
  } else {
    // Add new entry
    stats.push(newStat)
  }

  localStorage.setItem(`${STORAGE_KEYS.HEALTH_STATS}_${guestId}`, JSON.stringify(stats))
  return newStat
}

// Get health stats for a specific date range
export const getGuestHealthStatsForRange = (startDate: Date, endDate: Date): HealthStat[] => {
  const stats = getGuestHealthStats()
  return stats.filter(stat => {
    const statDate = new Date(stat.date)
    return statDate >= startDate && statDate <= endDate
  })
}

// Check if guest has checked in today
export const hasGuestCheckedInToday = (): boolean => {
  const stats = getGuestHealthStats()
  const today = new Date().toISOString().split('T')[0]
  return stats.some(stat => stat.date.split('T')[0] === today)
}

// Clear all guest data
export const clearGuestData = () => {
  const guestId = getGuestId()
  if (!guestId) return

  localStorage.removeItem(`${STORAGE_KEYS.HEALTH_STATS}_${guestId}`)
} 