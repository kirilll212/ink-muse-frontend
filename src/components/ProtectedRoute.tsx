import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PageLoader } from './PageLoader'

/**
 * Guards routes that require authentication.
 *
 * While the session is being validated a loader is shown; unauthenticated
 * visitors are redirected to the login page.
 */
export function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <PageLoader />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
