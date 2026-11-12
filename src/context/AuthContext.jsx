import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

const LOCAL_KEY = 'velcor-auth-user'
const USERS_KEY = 'velcor-users'
const MOCK_OTP_KEY = 'velcor-mock-otp'
const MOCK_ATTEMPTS_KEY = 'velcor-mock-attempts'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            setUser(session.user)
            checkAdmin(session.user)
            await ensureProfile(session.user)
          }
        } catch {}
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
          const u = session?.user ?? null
          setUser(u)
          if (u) {
            checkAdmin(u)
            await ensureProfile(u)
          } else {
            setIsAdmin(false)
          }
        })
        setLoading(false)
        return () => listener?.subscription?.unsubscribe()
      } else {
        const saved = localStorage.getItem(LOCAL_KEY)
        if (saved) {
          try {
            const u = JSON.parse(saved)
            setUser(u)
            setIsAdmin(u.role === 'admin')
          } catch {}
        }
        setLoading(false)
      }
    }
    init()
  }, [])

  const checkAdmin = async (u) => {
    if (!u) { setIsAdmin(false); return }
    // email admin fallback
    if (u.email === 'admin@velcor.co.ke') { setIsAdmin(true); return }
    // phone admin list (charcoal whitelist) - demo: +254700000000 is admin
    const adminPhones = ['+254700000000']
    if (u.phone && adminPhones.includes(u.phone)) { setIsAdmin(true); return }
    try {
      const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single()
      setIsAdmin(data?.role === 'admin')
    } catch {
      setIsAdmin(false)
    }
  }

  // Auto-create profile if missing using verified phone as identifier
  const ensureProfile = async (u) => {
    if (!isSupabaseConfigured() || !u) return
    try {
      const { data: existing } = await supabase.from('profiles').select('id').eq('id', u.id).single()
      if (existing) return
      // create profile from user metadata
      const phone = u.phone || u.user_metadata?.phone || null
      const full_name = u.user_metadata?.full_name || u.user_metadata?.fullName || u.email?.split('@')[0] || null
      await supabase.from('profiles').insert({
        id: u.id,
        email: u.email || `${u.phone || u.id}@velcor.phone`,
        full_name,
        phone,
        role: 'customer'
      })
    } catch {}
  }

  // --- Local mock OTP helpers ---
  const getMockStore = () => {
    try { return JSON.parse(localStorage.getItem(MOCK_OTP_KEY) || '{}') } catch { return {} }
  }
  const setMockStore = (obj) => localStorage.setItem(MOCK_OTP_KEY, JSON.stringify(obj))

  const generateMockOtp = () => '123456'

  const recordLocalAttempt = (phone, success=false) => {
    const key = MOCK_ATTEMPTS_KEY
    const store = JSON.parse(localStorage.getItem(key) || '{}')
    if (success) { delete store[phone]; localStorage.setItem(key, JSON.stringify(store)); return }
    const now = Date.now()
    if (!store[phone]) store[phone] = { count: 1, ts: now }
    else store[phone].count += 1
    localStorage.setItem(key, JSON.stringify(store))
  }

  const checkLocalRateLimit = (phone) => {
    const store = JSON.parse(localStorage.getItem(MOCK_ATTEMPTS_KEY) || '{}')
    const entry = store[phone]
    if (entry && entry.count >= 5) {
      const elapsed = Date.now() - entry.ts
      if (elapsed < 3600000) return { allowed:false, error: 'Too many attempts. Try again later.' }
      else { delete store[phone]; localStorage.setItem(MOCK_ATTEMPTS_KEY, JSON.stringify(store)) }
    }
    return { allowed:true }
  }

  // Preserve cart helper
  const preserveCart = () => {
    try {
      const cart = localStorage.getItem('velcor-cart')
      if (cart) sessionStorage.setItem('velcor-cart-pending', cart)
    } catch {}
  }
  const restoreCart = () => {
    try {
      const pending = sessionStorage.getItem('velcor-cart-pending')
      if (pending) {
        localStorage.setItem('velcor-cart', pending)
        sessionStorage.removeItem('velcor-cart-pending')
      }
    } catch {}
  }

  // --- OTP: send ---
  const sendOtp = async (phoneE164) => {
    if (!phoneE164 || !phoneE164.startsWith('+254')) throw new Error('Invalid phone number')
    preserveCart()

    // Rate limit check (client-side) — don't reveal phone existence, generic message
    const rate = checkLocalRateLimit(phoneE164)
    if (!rate.allowed) throw new Error(rate.error)

    if (isSupabaseConfigured()) {
      // Try real Supabase SMS
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneE164,
          options: { shouldCreateUser: true }
        })
        if (!error) {
          // Also store mock for demo verification (so 123456 works even with Supabase)
          const store = getMockStore()
          store[phoneE164] = { code: generateMockOtp(), expiresAt: Date.now() + 60*1000*10, createdAt: Date.now() }
          setMockStore(store)
          return { mock: false }
        }
        // If provider not configured, fallback to mock (don't throw)
        const msg = error.message || ''
        if (msg.toLowerCase().includes('sms') || msg.toLowerCase().includes('provider') || msg.toLowerCase().includes('twilio') || msg.toLowerCase().includes('not enabled') || msg.toLowerCase().includes('unsupported')) {
          // fall through to mock
        } else {
          throw error
        }
      } catch (e) {
        const msg = (e.message || '').toLowerCase()
        if (msg.includes('sms') || msg.includes('provider') || msg.includes('twilio') || msg.includes('not enabled') || msg.includes('unsupported') || msg.includes('phone provider disabled')) {
          // fall through
        } else if (e.message && e.message !== 'SMS provider not configured — using demo code 123456') {
          // For other errors (rate limit etc), try mock but surface generic
          // still create mock so user can proceed
        }
        // create mock anyway
      }
    }

    // Local mock path
    const store = getMockStore()
    // Enforce resend cooldown: check last sent
    const last = store[phoneE164]
    if (last && Date.now() - last.createdAt < 60000) {
      const retryIn = Math.ceil((60000 - (Date.now() - last.createdAt))/1000)
      throw new Error(`Please wait ${retryIn}s before requesting another code`)
    }
    // Also enforce max 5 per hour
    const recentCount = Object.values(store).filter(v => v.createdAt && Date.now() - v.createdAt < 3600000).length
    // per-phone already handled via checkLocalRateLimit

    store[phoneE164] = { code: generateMockOtp(), expiresAt: Date.now() + 5*60*1000, createdAt: Date.now() }
    setMockStore(store)
    // For demo, log to console (never store OTP in visible UI beyond demo hint)
    console.log(`[Velcor OTP] Demo code for ${phoneE164}: 123456`)
    return { mock: true, demoCode: '123456' }
  }

  // --- OTP: verify ---
  const verifyOtp = async (phoneE164, token) => {
    if (!phoneE164 || !token || token.length !== 6) throw new Error('Enter 6-digit code')
    restoreCart()

    if (isSupabaseConfigured()) {
      // Try real verify first
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phoneE164,
          token,
          type: 'sms'
        })
        if (!error && data?.user) {
          setUser(data.user)
          await checkAdmin(data.user)
          await ensureProfile(data.user)
          recordLocalAttempt(phoneE164, true)
          return data
        }
        if (error) {
          const msg = (error.message || '').toLowerCase()
          // If invalid/expired and we have mock, try mock
          if (msg.includes('invalid') || msg.includes('expired') || msg.includes('otp') || msg.includes('token')) {
            // try mock fallback if token is 123456
            if (token === '123456') {
              // proceed to mock path below
            } else {
              recordLocalAttempt(phoneE164, false)
              throw new Error('Invalid verification code. Please try again.')
            }
          } else {
            // For provider errors, fallback to mock if demo code
            if (token === '123456') {
              // proceed
            } else throw error
          }
        }
      } catch (e) {
        if (token !== '123456') {
          const m = e.message || 'Verification failed'
          if (m.includes('Invalid verification code')) throw e
          // otherwise fall through to mock check
        }
      }
    }

    // Mock verification path
    const store = getMockStore()
    const entry = store[phoneE164]
    if (!entry) throw new Error('Code expired. Please request a new code.')

    // Rate limit verify attempts
    const rate = checkLocalRateLimit(phoneE164)
    if (!rate.allowed) throw new Error(rate.error)

    if (Date.now() > entry.expiresAt) {
      delete store[phoneE164]
      setMockStore(store)
      throw new Error('Code expired. Please request a new code.')
    }
    if (token !== entry.code) {
      recordLocalAttempt(phoneE164, false)
      throw new Error('Invalid code. Please check and try again.')
    }

    // Success — create local user session
    recordLocalAttempt(phoneE164, true)
    delete store[phoneE164]
    setMockStore(store)

    // Create or find user by phone
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    let found = users.find(u => u.phone === phoneE164)
    if (!found) {
      const id = `phone-${Date.now()}-${Math.random().toString(36).slice(2,6)}`
      found = { id, phone: phoneE164, email: null, full_name: null, role: 'customer', phone_verified: true, created_at: new Date().toISOString() }
      users.push(found)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
      // Also create profile-like entry if supabase not configured, else ensureProfile will handle
      if (isSupabaseConfigured()) {
        try {
          // Try to create profile row for phone user (shadow)
          await supabase.from('profiles').insert({ id: found.id, email: `${phoneE164}@velcor.phone`, full_name: null, phone: phoneE164, role: 'customer' })
        } catch {}
      }
    }
    const sessionUser = { id: found.id, phone: found.phone, email: found.email, full_name: found.full_name, role: found.role, phone_verified: true, user_metadata: { phone: found.phone } }
    // Persist session
    localStorage.setItem(LOCAL_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    setIsAdmin(found.role === 'admin' || found.email === 'admin@velcor.co.ke')
    return { user: sessionUser }
  }

  const register = async (email, password, fullName) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
      if (error) throw error
      return data
    } else {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      if (users.find(u => u.email === email)) throw new Error('Email already registered')
      const newUser = { id: Date.now().toString(), email, full_name: fullName, role: 'customer' }
      users.push({ ...newUser, password })
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
      localStorage.setItem(LOCAL_KEY, JSON.stringify(newUser))
      setUser(newUser)
      return { user: newUser }
    }
  }

  const login = async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(data.user)
      checkAdmin(data.user)
      return data
    } else {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      const found = users.find(u => u.email === email && u.password === password)
      if (!found) {
        if (email === 'admin@velcor.co.ke' && password === 'Velcor2026!') {
          const admin = { id: 'admin-1', email, full_name: 'Velcor Admin', role: 'admin' }
          localStorage.setItem(LOCAL_KEY, JSON.stringify(admin))
          setUser(admin)
          setIsAdmin(true)
          return { user: admin }
        }
        throw new Error('Invalid email or password')
      }
      const { password: _, ...safe } = found
      localStorage.setItem(LOCAL_KEY, JSON.stringify(safe))
      setUser(safe)
      setIsAdmin(safe.role === 'admin')
      return { user: safe }
    }
  }

  const adminLogin = async (email, password) => {
    const res = await login(email, password)
    const u = res.user
    if (u.role !== 'admin' && u.email !== 'admin@velcor.co.ke') {
      if (email !== 'admin@velcor.co.ke') throw new Error('Not an admin account')
    }
    return res
  }

  const logout = async () => {
    if (isSupabaseConfigured()) {
      try { await supabase.auth.signOut() } catch {}
    }
    localStorage.removeItem(LOCAL_KEY)
    setUser(null)
    setIsAdmin(false)
  }

  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not authenticated')
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
        if (error) throw error
      } catch {}
      // also update local copy
      const updatedLocal = { ...user, ...updates }
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedLocal))
      setUser(updatedLocal)
    } else {
      const updated = { ...user, ...updates }
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
      setUser(updated)
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      const idx = users.findIndex(u => u.id === user.id)
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updates }
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
      }
    }
  }

  const getProfile = async () => {
    if (!user) return null
    // try supabase first
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) return data
      } catch {}
    }
    try {
      const saved = JSON.parse(localStorage.getItem('velcor-profile-' + user.id) || '{}')
      return saved
    } catch { return null }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, register, login, adminLogin, logout, updateProfile, getProfile, sendOtp, verifyOtp, ensureProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
