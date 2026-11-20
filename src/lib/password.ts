export type PasswordCheck = {
  length: boolean
  digit: boolean
  valid: boolean
  /** 0 = kosong, 1 = belum memenuhi syarat, 2-4 = memenuhi syarat dan makin kuat */
  level: 0 | 1 | 2 | 3 | 4
}

export function checkPassword(pw: string): PasswordCheck {
  const length = pw.length >= 8
  const digit = /\d/.test(pw)
  const valid = length && digit
  if (pw === '') return { length, digit, valid, level: 0 }
  if (!valid) return { length, digit, valid, level: 1 }
  const mixedCase = /[a-z]/.test(pw) && /[A-Z]/.test(pw)
  const symbol = /[^A-Za-z0-9]/.test(pw)
  return { length, digit, valid, level: (2 + Number(mixedCase) + Number(symbol)) as PasswordCheck['level'] }
}
