import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Shield } from 'lucide-react'

export default function AdminLogin() {
  const { adminLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@velcor.co.ke')
  const [password, setPassword] = useState('Velcor2026!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(email, password)
      navigate('/admin')
    } catch(err){ setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="container" style={{padding:'40px 24px', maxWidth:440, margin:'0 auto'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:56, height:56, borderRadius:16, background:'var(--charcoal)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', color:'var(--champagne)'}}><Shield size={24}/></div>
        <h1 style={{marginTop:12, fontSize:24}}>Velcor Admin</h1>
        <p style={{color:'var(--text-muted)', fontSize:12, marginTop:4}}>Secure administrator access • Product, order & delivery management</p>
      </div>
      <form onSubmit={submit} style={{marginTop:20, background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
        <label><span style={{fontSize:11, fontWeight:800}}>ADMIN EMAIL</span><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="input" style={{marginTop:6, borderRadius:12}}/></label>
        <label style={{display:'block', marginTop:12}}><span style={{fontSize:11, fontWeight:800}}>PASSWORD</span><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="input" style={{marginTop:6, borderRadius:12}}/></label>
        {error && <div style={{marginTop:12, background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b', padding:10, borderRadius:12, fontSize:12, fontWeight:700}}>{error}</div>}
        <button disabled={loading} className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:16, background:'var(--charcoal)', color:'white'}}>{loading ? 'Signing in...' : 'Access Dashboard'}</button>
        <div style={{marginTop:12, background:'var(--light)', borderRadius:12, padding:10, fontSize:11, color:'var(--text-muted)', textAlign:'center'}}>Demo: admin@velcor.co.ke / Velcor2026! • Role protection via Supabase RLS & frontend guard.</div>
        <Link to="/" style={{display:'block', marginTop:12, textAlign:'center', fontSize:12, fontWeight:700, color:'var(--text-muted)'}}>← Back to Store</Link>
      </form>
    </div>
  )
}
