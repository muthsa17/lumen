import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authStorage, setRemember } from './auth-storage'

function fakeStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  }
}

let local: ReturnType<typeof fakeStorage>
let session: ReturnType<typeof fakeStorage>

describe('authStorage', () => {
  beforeEach(() => {
    local = fakeStorage()
    session = fakeStorage()
    vi.stubGlobal('localStorage', local)
    vi.stubGlobal('sessionStorage', session)
  })

  it('menyimpan di localStorage secara default (ingat saya)', () => {
    authStorage.setItem('sesi', 'a')
    expect(local.getItem('sesi')).toBe('a')
    expect(session.getItem('sesi')).toBeNull()
    expect(authStorage.getItem('sesi')).toBe('a')
  })

  it('menyimpan di sessionStorage kalau ingat saya dimatikan', () => {
    setRemember(false)
    authStorage.setItem('sesi', 'b')
    expect(session.getItem('sesi')).toBe('b')
    expect(local.getItem('sesi')).toBeNull()
    expect(authStorage.getItem('sesi')).toBe('b')
  })

  it('kembali ke localStorage setelah ingat saya dinyalakan lagi', () => {
    setRemember(false)
    setRemember(true)
    authStorage.setItem('sesi', 'c')
    expect(local.getItem('sesi')).toBe('c')
  })

  it('removeItem menghapus dari storage yang aktif', () => {
    setRemember(false)
    authStorage.setItem('sesi', 'd')
    authStorage.removeItem('sesi')
    expect(authStorage.getItem('sesi')).toBeNull()
  })

  it('removeItem membersihkan kedua storage supaya token lama tidak tersisa', () => {
    local.setItem('sesi', 'lama')
    setRemember(false)
    session.setItem('sesi', 'baru')
    authStorage.removeItem('sesi')
    expect(local.getItem('sesi')).toBeNull()
    expect(session.getItem('sesi')).toBeNull()
  })

  it('tidak melempar saat storage diblokir', () => {
    const blocked = () => {
      throw new Error('blocked')
    }
    vi.stubGlobal('localStorage', {
      getItem: blocked,
      setItem: blocked,
      removeItem: blocked,
    })
    vi.stubGlobal('sessionStorage', {
      getItem: blocked,
      setItem: blocked,
      removeItem: blocked,
    })
    expect(() => setRemember(false)).not.toThrow()
    expect(() => authStorage.setItem('x', 'y')).not.toThrow()
    expect(authStorage.getItem('x')).toBeNull()
    expect(() => authStorage.removeItem('x')).not.toThrow()
  })
})
