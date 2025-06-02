/**
 * Returns the appropriate redirect URL based on the current environment
 * @param path The path to redirect to (e.g., '/confirm', '/auth')
 * @returns The full redirect URL
 */
export const getRedirectURL = (path: string): string => {
  const isLocalhost = window.location.hostname === 'localhost'
  const baseURL = isLocalhost
    ? 'http://localhost:5173'
    : 'https://picklepulse.netlify.app'

  // Ensure path starts with a forward slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  return `${baseURL}${normalizedPath}`
} 