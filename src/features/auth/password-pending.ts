// Supabase turns the guest into a regular user once the email is verified, so the header can no longer
// rely on isGuest to offer the password step; this flag remembers that it is still owed.
export const PASSWORD_PENDING_KEY = 'lumen.passwordPending'

export function readPasswordPending(): boolean {
  try {
    return localStorage.getItem(PASSWORD_PENDING_KEY) === '1'
  } catch {
    return false
  }
}

export function setPasswordPending(pending: boolean) {
  try {
    if (pending) localStorage.setItem(PASSWORD_PENDING_KEY, '1')
    else localStorage.removeItem(PASSWORD_PENDING_KEY)
  } catch {
    // blocked storage: the reminder is lost, the account itself is not
  }
}
