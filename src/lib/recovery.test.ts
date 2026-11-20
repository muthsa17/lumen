import { describe, expect, it } from 'vitest'
import { resetPasswordError } from './recovery'

describe('resetPasswordError', () => {
  it('memberi pesan khusus bila kata sandi sama dengan yang lama', () => {
    expect(resetPasswordError('same_password')).toBe(
      'Kata sandi baru harus berbeda dari yang lama.',
    )
  })

  it('memetakan kata sandi lemah dan batas laju', () => {
    expect(resetPasswordError('weak_password')).toMatch(/terlalu mudah/)
    expect(resetPasswordError('over_request_rate_limit')).toMatch(/Tunggu/)
  })

  it('jatuh ke kalimat umum untuk kode tak dikenal atau kosong', () => {
    const generic = 'Kata sandi belum tersimpan. Coba lagi sebentar lagi.'
    expect(resetPasswordError('apa_saja')).toBe(generic)
    expect(resetPasswordError(undefined)).toBe(generic)
  })
})
