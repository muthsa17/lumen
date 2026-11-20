import { createBrowserRouter, Navigate } from 'react-router'
import { RequireAuth } from '@/features/auth/RequireAuth'
import Dashboard from '@/pages/Dashboard'
import Focus from '@/pages/Focus'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  {
    Component: RequireAuth,
    children: [
      { path: '/app', Component: Dashboard },
      { path: '/focus', Component: Focus },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
