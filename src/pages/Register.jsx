import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName:'', email:'', password:'', confirm:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      await register(form.email, form.password, form.fullName)
      navigate('/account')
    } catch(err){ setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="container" style={{padding:'40px 24px', maxWidth:440, margin:'0 auto'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:48, height:48, borderRadius:12, background:'linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', color:'var(--charcoal)', fontWeight:800, fontFamily:'Cormorant Garamond', fontSize:22}}>V</div>
        <h1 style={{marginTop:12, fontSize:24}}>Create account</h1>
        <p style={{color:'var(--text-muted)', fontSize:13, marginTop:4}}>Join Velcor — save delivery info, track orders, faster checkout</p>
      </div>
      <form onSubmit={submit} style={{marginTop:20, background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
        <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>FULL NAME *</span><input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} required placeholder="Waren Kyle" className="input" style={{marginTop:6, borderRadius:12}}/></label>
        <label style={{display:'block', marginTop:12}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>EMAIL *</span><input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} type="email" required placeholder="you@email.com" className="input" style={{marginTop:6, borderRadius:12}}/></label>
        <label style={{display:'block', marginTop:12}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>PASSWORD *</span><input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} type="password" required placeholder="Min 6 characters" className="input" style={{marginTop:6, borderRadius:12}}/></label>
        <label style={{display:'block', marginTop:12}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>CONFIRM PASSWORD *</span><input value={form.confirm} onChange={e=>setForm({...form, confirm:e.target.value})} type="password" required placeholder="Confirm" className="input" style={{marginTop:6, borderRadius:12}}/></label>
        {error && <div style={{marginTop:12, background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b', padding:10, borderRadius:12, fontSize:12, fontWeight:700}}>{error}</div>}
        <button disabled={loading} className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:16}}>{loading ? 'Creating...' : 'Create Account'}</button>
        <div style={{marginTop:12, textAlign:'center', fontSize:12, color:'var(--text-muted)'}}>Already have an account? <Link to="/login" style={{color:'var(--champagne-dark)', fontWeight:800}}>Sign in</Link></div>
        <div style={{marginTop:12, fontSize:11, color:'var(--text-muted)', textAlign:'center'}}>By creating account you agree to Velcor Terms & Privacy.</div>
      </form>
    </div>
  )
}
