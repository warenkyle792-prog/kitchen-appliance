import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

// Simple local auth fallback when Supabase not configured
const LOCAL_KEY = 'velcor-auth-user'
const USERS_KEY = 'velcor-users'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          checkAdmin(session.user)
        }
        supabase.auth.onAuthStateChange(async (_event, session) => {
          setUser(session?.user ?? null)
          if (session?.user) checkAdmin(session.user)
          else setIsAdmin(false)
        })
      } else {
        const saved = localStorage.getItem(LOCAL_KEY)
        if (saved) {
          const u = JSON.parse(saved)
          setUser(u)
          setIsAdmin(u.role === 'admin')
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const checkAdmin = async (u) => {
    try {
      const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single()
      setIsAdmin(data?.role === 'admin')
    } catch {
      // fallback: check email
      if (u.email === 'admin@velcor.co.ke') setIsAdmin(true)
    }
  }

  const register = async (email, password, fullName) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } }
      })
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
        // allow demo admin
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
    // enforce admin
    const res = await login(email, password)
    const u = res.user
    if (u.role !== 'admin' && u.email !== 'admin@velcor.co.ke') {
      // check local admin
      if (email !== 'admin@velcor.co.ke') throw new Error('Not an admin account')
    }
    return res
  }

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem(LOCAL_KEY)
    }
    setUser(null)
    setIsAdmin(false)
  }

  const updateProfile = async (updates) => {
    if (isSupabaseConfigured() && user) {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
      if (error) throw error
    } else if (user) {
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

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, register, login, adminLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
