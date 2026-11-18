// Synthesised with Web Audio so no sound file (or its licence) has to ship with the app.
let ctx: AudioContext | null = null

/** Call from a click handler: browsers only let audio start after a user gesture. */
export function unlockChime() {
  try {
    ctx ??= new AudioContext()
    void ctx.resume()
  } catch {
    ctx = null
  }
}

export function playChime() {
  if (!ctx) return
  const t = ctx.currentTime
  for (const [i, freq] of [660, 880].entries()) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, t + i * 0.25)
    gain.gain.exponentialRampToValueAtTime(0.25, t + i * 0.25 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.25 + 0.6)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t + i * 0.25)
    osc.stop(t + i * 0.25 + 0.65)
  }
}
