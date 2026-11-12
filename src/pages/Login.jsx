import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container" style={{padding:'40px 24px', maxWidth:440, margin:'0 auto'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:48, height:48, borderRadius:12, background:'linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', color:'var(--charcoal)', fontWeight:800, fontFamily:'Cormorant Garamond', fontSize:22}}>V</div>
        <h1 style={{marginTop:12, fontSize:24}}>Welcome back</h1>
        <p style={{color:'var(--text-muted)', fontSize:13, marginTop:4}}>Sign in via phone OTP or email — track orders and manage delivery</p>
      </div>

      <div style={{marginTop:16, background:'rgba(201,168,106,0.10)', border:'1.5px solid rgba(201,168,106,0.25)', borderRadius:16, padding:14, display:'flex', gap:12, alignItems:'center'}}>
        <span style={{width:40, height:40, borderRadius:12, background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18}}>📱</span>
        <div style={{flex:1}}>
          <div style={{fontWeight:800, fontSize:13}}>Phone OTP — no password needed</div>
          <div style={{fontSize:11, color:'var(--text-muted)', marginTop:2}}>+254 default • 07 / 01 supported • 6-digit SMS code</div>
        </div>
        <Link to="/auth" style={{padding:'10px 16px', borderRadius:999, background:'var(--charcoal)', color:'white', fontWeight:800, fontSize:12, whiteSpace:'nowrap'}}>Use Phone →</Link>
      </div>

      <form onSubmit={submit} style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
        <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em', color:'var(--text-muted)', textAlign:'center', marginBottom:12}}>— OR SIGN IN WITH EMAIL —</div>
        <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>EMAIL</span><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="input" style={{marginTop:6, borderRadius:12}}/></label>
        <label style={{display:'block', marginTop:12}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>PASSWORD</span><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="••••••••" className="input" style={{marginTop:6, borderRadius:12}}/></label>
        {error && <div style={{marginTop:12, background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b', padding:10, borderRadius:12, fontSize:12, fontWeight:700}}>{error}</div>}
        <button disabled={loading} className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:16}}>{loading ? 'Signing in...' : 'Sign In with Email'}</button>
        <div style={{marginTop:12, textAlign:'center', fontSize:12, color:'var(--text-muted)'}}>Don’t have an account? <Link to="/register" style={{color:'var(--champagne-dark)', fontWeight:800}}>Create account</Link> • <Link to="/auth" style={{color:'var(--champagne-dark)', fontWeight:800}}>Use phone OTP</Link></div>
        <div style={{marginTop:12, background:'var(--light)', borderRadius:12, padding:12, fontSize:11, color:'var(--text-muted)'}}>
          <b>Demo:</b> demo@velcor.co.ke / demo123 • <b>Admin:</b> admin@velcor.co.ke / Velcor2026! • Prefer phone? Use <Link to="/auth" style={{color:'var(--champagne-dark)', fontWeight:800}}>Phone OTP</Link> with code <code style={{background:'white', border:'1px solid var(--border)', padding:'1px 6px', borderRadius:6}}>123456</code>
        </div>
        <div style={{marginTop:12, textAlign:'center'}}><Link to="/track" style={{fontSize:12, fontWeight:700, color:'var(--text-muted)'}}>Track order as guest →</Link></div>
      </form>
      <div style={{marginTop:12, textAlign:'center', fontSize:11, color:'var(--text-muted)'}}>New phone login? <Link to="/auth" style={{color:'var(--champagne-dark)', fontWeight:800}}>Verify phone →</Link></div>
    </div>
  )
}
