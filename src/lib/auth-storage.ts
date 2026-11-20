// Flag "ingat saya" ada di localStorage supaya klien Supabase tahu storage mana yang dipakai setelah reload.
// Hanya nilai '0' yang berarti tidak ingat; selain itu (termasuk storage diblokir) memakai default ingat.
export const REMEMBER_KEY = 'lumen.remember'

function remembered(): boolean {
  try {
    return localStorage.getItem(REMEMBER_KEY) !== '0'
  } catch {
    return true
  }
}

/** Panggil sebelum login: menentukan di mana sesi Supabase disimpan. */
export function setRemember(remember: boolean) {
  try {
    if (remember) localStorage.removeItem(REMEMBER_KEY)
    else localStorage.setItem(REMEMBER_KEY, '0')
  } catch {
    // storage diblokir: sesi tetap jalan, hanya tidak bisa memilih
  }
}

function active(): Storage {
  return remembered() ? localStorage : sessionStorage
}

export const authStorage = {
  getItem(key: string): string | null {
    try {
      return active().getItem(key)
    } catch {
      return null
    }
  },
  setItem(key: string, value: string) {
    try {
      active().setItem(key, value)
    } catch {
      // sesi hanya hidup di memori klien sampai reload
    }
  },
  // Hapus di keduanya: token dari mode ingat sebelumnya tidak boleh tersisa setelah keluar.
  removeItem(key: string) {
    for (const name of ['localStorage', 'sessionStorage'] as const) {
      try {
        globalThis[name].removeItem(key)
      } catch {
        // storage tidak bisa diakses, tidak ada yang perlu dihapus
      }
    }
  },
}
