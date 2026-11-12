// Velcor Appliances — Kenya Phone Number Handling (E.164)
/**
 * Supports:
 * - 07XXXXXXXX (Safaricom, Airtel KE)
 * - 01XXXXXXXX (new KE prefix)
 * - +2547XXXXXXXX / +2541XXXXXXXX (international)
 * - 2547XXXXXXXX (without +)
 * - 7XXXXXXXX / 1XXXXXXXX (without leading 0)
 */

export const KENYA_COUNTRY_CODE = '+254'

export const normalizePhoneToE164 = (raw) => {
  if (!raw) return null
  let phone = raw.toString().trim().replace(/\s+/g, '').replace(/[-()]/g, '')

  // Already E.164
  if (phone.startsWith('+254')) {
    // +2547XXXXXXXX or +2541XXXXXXXX -> must be 13 chars (+254 + 9 digits)
    if (/^\+254[17]\d{8}$/.test(phone)) return phone
    return null
  }

  // 2547XXXXXXXX or 2541XXXXXXXX (without +)
  if (/^254[17]\d{8}$/.test(phone)) {
    return `+${phone}`
  }

  // 07XXXXXXXX or 01XXXXXXXX (10 digits, leading 0)
  if (/^0[17]\d{8}$/.test(phone)) {
    return `+254${phone.slice(1)}`
  }

  // 7XXXXXXXX or 1XXXXXXXX (9 digits, no leading 0)
  if (/^[17]\d{8}$/.test(phone)) {
    return `+254${phone}`
  }

  return null
}

export const validateKenyanPhone = (raw) => {
  const normalized = normalizePhoneToE164(raw)
  if (!normalized) return { valid: false, error: 'Enter a valid Kenyan number (07... or 01... or +254...)' }
  return { valid: true, normalized }
}

export const formatPhoneDisplay = (e164) => {
  if (!e164 || !e164.startsWith('+254')) return e164
  // +254712345678 -> 0712 345 678
  const local = `0${e164.slice(4)}`
  return `${local.slice(0,4)} ${local.slice(4,7)} ${local.slice(7)}`
}

export const maskPhone = (e164) => {
  if (!e164 || e164.length < 7) return e164
  return `${e164.slice(0, -4).replace(/./g, '•')} ${e164.slice(-4)}`
}

// Rate limiting helpers (client-side, server should also enforce via Supabase)
const RATE_LIMIT_KEY = 'velcor-otp-rate'
const ATTEMPT_KEY = 'velcor-otp-attempts'

export const checkRateLimit = (phone) => {
  const now = Date.now()
  const stored = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}')
  const attempts = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || '{}')

  // Clean old entries (>1 hour)
  Object.keys(stored).forEach(k => {
    if (now - stored[k] > 3600000) delete stored[k]
  })
  Object.keys(attempts).forEach(k => {
    if (now - attempts[k].ts > 3600000) delete attempts[k]
  })
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(stored))
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempts))

  // Check SMS frequency: max 5 per hour per Supabase config, but we enforce 5
  // Check verify attempts: max 5 per phone per hour
  const phoneAttempts = attempts[phone]
  if (phoneAttempts && phoneAttempts.count >= 5) {
    const retryAfter = 3600000 - (now - phoneAttempts.ts)
    if (retryAfter > 0) {
      return { allowed: false, error: `Too many attempts. Try again in ${Math.ceil(retryAfter/60000)} minutes.` }
    }
  }

  return { allowed: true }
}

export const recordAttempt = (phone, success = false) => {
  if (success) {
    const attempts = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || '{}')
    delete attempts[phone]
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempts))
    return
  }
  const attempts = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || '{}')
  const now = Date.now()
  if (!attempts[phone]) attempts[phone] = { count: 1, ts: now }
  else attempts[phone].count += 1
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempts))
}

export const recordSmsSent = (phone) => {
  const stored = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}')
  stored[phone] = Date.now()
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(stored))
}
