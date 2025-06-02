import { getGuestId } from './guestMode'

interface Skill {
  id: string
  name: string
  section: string
  created_at: string
  updated_at: string
}

const STORAGE_KEYS = {
  SKILLS: 'guest_skills',
}

// Helper to generate a unique ID for guest data
const generateId = () => `guest_${Math.random().toString(36).substring(2)}_${Date.now()}`

// Get all skills for guest
export const getGuestSkills = (): Skill[] => {
  const guestId = getGuestId()
  if (!guestId) return []
  
  const storedData = localStorage.getItem(`${STORAGE_KEYS.SKILLS}_${guestId}`)
  return storedData ? JSON.parse(storedData) : []
}

// Save a new skill for guest
export const saveGuestSkill = (data: { name: string, section: string }): Skill | null => {
  const guestId = getGuestId()
  if (!guestId) return null

  const skills = getGuestSkills()
  const now = new Date().toISOString()
  
  const newSkill: Skill = {
    id: generateId(),
    name: data.name,
    section: data.section,
    created_at: now,
    updated_at: now
  }

  skills.push(newSkill)
  localStorage.setItem(`${STORAGE_KEYS.SKILLS}_${guestId}`, JSON.stringify(skills))
  return newSkill
}

// Update an existing skill
export const updateGuestSkill = (id: string, data: { name: string }): Skill | null => {
  const guestId = getGuestId()
  if (!guestId) return null

  const skills = getGuestSkills()
  const skillIndex = skills.findIndex(skill => skill.id === id)
  
  if (skillIndex === -1) return null

  const updatedSkill = {
    ...skills[skillIndex],
    ...data,
    updated_at: new Date().toISOString()
  }

  skills[skillIndex] = updatedSkill
  localStorage.setItem(`${STORAGE_KEYS.SKILLS}_${guestId}`, JSON.stringify(skills))
  return updatedSkill
}

// Delete a skill
export const deleteGuestSkill = (id: string): boolean => {
  const guestId = getGuestId()
  if (!guestId) return false

  const skills = getGuestSkills()
  const filteredSkills = skills.filter(skill => skill.id !== id)
  
  if (filteredSkills.length === skills.length) return false

  localStorage.setItem(`${STORAGE_KEYS.SKILLS}_${guestId}`, JSON.stringify(filteredSkills))
  return true
}

// Clear all guest skills
export const clearGuestSkills = () => {
  const guestId = getGuestId()
  if (!guestId) return

  localStorage.removeItem(`${STORAGE_KEYS.SKILLS}_${guestId}`)
} 