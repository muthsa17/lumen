// Pesan bawaan Supabase berbahasa Inggris; kode yang dikenal dipetakan, sisanya jatuh ke kalimat umum.
const RESET_ERRORS: Record<string, string> = {
  same_password: 'Kata sandi baru harus berbeda dari yang lama.',
  weak_password: 'Kata sandi terlalu mudah ditebak. Coba tambah karakter lain.',
  over_request_rate_limit:
    'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
}

export function resetPasswordError(code: string | undefined): string {
  return (
    RESET_ERRORS[code ?? ''] ??
    'Kata sandi belum tersimpan. Coba lagi sebentar lagi.'
  )
}
