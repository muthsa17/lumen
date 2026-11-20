import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/database.types'
import { authStorage } from '@/lib/auth-storage'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) throw new Error('Supabase env belum diisi')

export const supabase = createClient<Database>(url, key, {
  auth: { storage: authStorage },
})
