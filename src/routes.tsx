import { createBrowserRouter, Navigate } from 'react-router'
import { RequireAuth } from '@/features/auth/RequireAuth'
import Dashboard from '@/pages/Dashboard'
import Focus from '@/pages/Focus'
import ForgotPassword from '@/pages/ForgotPassword'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import Progress from '@/pages/Progress'
import Register from '@/pages/Register'
import ResetPassword from '@/pages/ResetPassword'

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  { path: '/forgot-password', Component: ForgotPassword },
  { path: '/reset-password', Component: ResetPassword },
  {
    Component: RequireAuth,
    children: [
      { path: '/app', Component: Dashboard },
      { path: '/focus', Component: Focus },
      { path: '/progress', Component: Progress },
      { path: '/profile', Component: Profile },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
