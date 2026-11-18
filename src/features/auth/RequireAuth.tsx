import { Navigate, Outlet } from 'react-router'
import { FocusSessionProvider } from '@/features/focus/FocusSessionProvider'
import { useAuth } from './auth-context'

export function RequireAuth() {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <p role="status" className="p-6 text-body-1 text-muted-foreground">
        Memuat…
      </p>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  return (
    <FocusSessionProvider>
      <Outlet />
    </FocusSessionProvider>
  )
}
