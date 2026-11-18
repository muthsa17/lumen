import type { Session, User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export type AuthState = { session: Session | null; user: User | null; isGuest: boolean; loading: boolean }

export const AuthContext = createContext<AuthState>({ session: null, user: null, isGuest: false, loading: true })

export const useAuth = () => useContext(AuthContext)
