/** Avatar initials: first letters of the first two words of full_name, else the email's first letter, else "T" (guest). */
export function initials(fullName?: string | null, email?: string | null): string {
  const words = fullName?.trim().split(/\s+/).filter(Boolean) ?? []
  if (words.length > 0) return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const first = email?.trim()[0]
  return first ? first.toUpperCase() : 'T'
}
