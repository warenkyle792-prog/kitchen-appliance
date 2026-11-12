import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrice } from '../lib/utils.js'
import { validateKenyanPhone, normalizePhoneToE164, formatPhoneDisplay } from '../lib/phoneUtils.js'

export default function Account() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const [profile, setProfile] = useState({ fullName: '', phone: '', email: '', estate:'', building:'', town:'westlands' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    if(user){
      const saved = JSON.parse(localStorage.getItem('velcor-profile-' + user.id) || '{}')
      const phoneFromUser = user.phone || saved.phone || saved.customer_phone || ''
      const emailFromUser = user.email && !user.email.includes('@velcor.phone') ? user.email : (saved.email || '')
      setProfile({
        fullName: saved.fullName || user.full_name || user.user_metadata?.full_name || '',
        phone: phoneFromUser,
        email: emailFromUser,
        estate: saved.estate || '',
        building: saved.building || '',
        town: saved.town || 'westlands'
      })
      const all = JSON.parse(localStorage.getItem('velcor-orders') || '[]')
      // match by user_id OR by phone (for guest orders that get linked after phone auth)
      const userPhone = user.phone || phoneFromUser
      const filtered = all.filter(o=> o.user_id===user.id || (userPhone && o.customer_phone && normalizePhoneToE164(o.customer_phone) === normalizePhoneToE164(userPhone) ))
      setOrders(filtered.sort((a,b)=> new Date(b.created_at)-new Date(a.created_at)))
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const save = async () => {
    setMsg('')
    // validate phone if provided
    if (profile.phone) {
      const v = validateKenyanPhone(profile.phone)
      if (!v.valid) { setMsg(v.error); return }
    }
    if (!profile.fullName.trim()) { setMsg('Full name is required'); return }
    setSaving(true)
    try {
      await updateProfile({ full_name: profile.fullName, phone: profile.phone ? normalizePhoneToE164(profile.phone) : null })
      // persist delivery info locally for checkout prefill
      const existing = JSON.parse(localStorage.getItem('velcor-profile-' + user.id) || '{}')
      const toSave = { ...existing, ...profile, customer_phone: profile.phone ? normalizePhoneToE164(profile.phone) : profile.phone, updated_at: new Date().toISOString() }
      localStorage.setItem('velcor-profile-' + user.id, JSON.stringify(toSave))
      setMsg('Profile saved ✓')
      setTimeout(()=>setMsg(''), 2500)
    } catch(e){ setMsg(e.message) }
    finally { setSaving(false) }
  }

  const phoneDisplay = user?.phone ? formatPhoneDisplay(user.phone) : (profile.phone ? formatPhoneDisplay(normalizePhoneToE164(profile.phone) || profile.phone) : '')
  const verifiedBadge = user?.phone ? '✓ Verified' : null

  return (
    <div className="container" style={{padding:'24px', display:'grid', gridTemplateColumns:'260px 1fr', gap:24}}>
      <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16, height:'fit-content', position:'sticky', top:88}}>
        <div style={{textAlign:'center', padding:16, background:'linear-gradient(135deg, #1a1a1e 0%, #252529 100%)', borderRadius:12, color:'white', border:'1px solid rgba(201,168,106,0.12)'}}>
          <div style={{width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', color:'var(--charcoal)', fontWeight:800, fontSize:18}}>{(profile.fullName || user?.phone || user?.email || 'V').slice(0,1).toUpperCase()}</div>
          <div style={{fontWeight:800, marginTop:10, fontSize:14}}>{profile.fullName || (user?.phone ? formatPhoneDisplay(user.phone) : 'Velcor Customer')}</div>
          <div style={{fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2, wordBreak:'break-all'}}>{user?.phone ? `${phoneDisplay} ${verifiedBadge ? '• ' + verifiedBadge : ''}` : (user?.email || '')}</div>
          {user?.email && user?.phone && <div style={{fontSize:10, color:'rgba(255,255,255,0.5)', marginTop:2}}>{user.email}</div>}
          <div style={{marginTop:10, display:'inline-flex', gap:6, alignItems:'center', background:'rgba(201,168,106,0.15)', border:'1px solid rgba(201,168,106,0.25)', padding:'6px 10px', borderRadius:999, fontSize:10, fontWeight:800, color:'#e8d5b5'}}>Pay after delivery • COD</div>
        </div>
        <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:6}}>
          <button onClick={()=>setTab('orders')} style={{padding:12, borderRadius:12, background: tab==='orders' ? 'var(--charcoal)' : 'transparent', color: tab==='orders' ? 'white' : 'var(--text)', border:'none', fontWeight:700, textAlign:'left', cursor:'pointer'}}>📦 Order History <span style={{float:'right', background: tab==='orders' ? 'var(--champagne)' : 'var(--light)', color: tab==='orders' ? 'var(--charcoal)' : 'var(--text-muted)', padding:'2px 8px', borderRadius:999, fontSize:10}}>{orders.length}</span></button>
          <button onClick={()=>setTab('profile')} style={{padding:12, borderRadius:12, background: tab==='profile' ? 'var(--charcoal)' : 'transparent', color: tab==='profile' ? 'white' : 'var(--text)', border:'none', fontWeight:700, textAlign:'left', cursor:'pointer'}}>👤 Profile & Delivery Info</button>
          <Link to="/track" style={{padding:12, borderRadius:12, fontWeight:700, border:'1px solid var(--border)', background:'var(--white)', textAlign:'left', display:'block'}}>🔍 Track Order</Link>
          <Link to="/catalog" style={{padding:12, borderRadius:12, fontWeight:700, background:'var(--light)', textAlign:'center', display:'block'}}>🛍️ Shop Again</Link>
          <button onClick={handleLogout} style={{padding:12, borderRadius:12, background:'#fef2f2', color:'#991b1b', border:'1px solid #fecaca', fontWeight:700, textAlign:'left', marginTop:8, cursor:'pointer'}}>Sign Out</button>
        </div>
        <div style={{marginTop:12, fontSize:10, color:'var(--text-muted)', lineHeight:1.4, background:'var(--light)', padding:10, borderRadius:10, border:'1px solid var(--border)'}}>
          <b style={{color:'var(--text)'}}>Phone OTP session</b> — your cart is preserved across sign-in. Orders are auto-linked by phone.
        </div>
      </div>

      <div>
        {tab==='orders' ? (
          <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:20}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12}}>
              <div>
                <h2 style={{fontSize:20, fontWeight:800}}>Order History</h2>
                <p style={{color:'var(--text-muted)', fontSize:12, marginTop:4}}>{orders.length} orders • Pay after delivery • {user?.phone ? `Linked to ${phoneDisplay}` : 'Guest orders linked via phone'}</p>
              </div>
              <Link to="/catalog" style={{padding:'10px 16px', borderRadius:999, background:'var(--champagne)', color:'var(--charcoal)', fontWeight:800, fontSize:12}}>Shop New →</Link>
            </div>

            {orders.length===0 ? (
              <div style={{textAlign:'center', padding:'40px 0', color:'var(--text-muted)'}}>
                <div style={{fontSize:32}}>📦</div>
                <div style={{fontWeight:700, marginTop:8, color:'var(--text)'}}>No orders yet</div>
                <div style={{fontSize:12, marginTop:4}}>Your orders will appear here after checkout — guest or signed-in.</div>
                <Link to="/catalog" style={{display:'inline-flex', marginTop:12, padding:'12px 20px', borderRadius:999, background:'var(--charcoal)', color:'white', fontWeight:800}}>Start shopping →</Link>
              </div>
            ) : (
              <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:12}}>
                {orders.map(o=>(
                  <div key={o.order_number} style={{border:'1px solid var(--border)', borderRadius:12, padding:16, background:'white'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8}}>
                      <div><div style={{fontWeight:800, letterSpacing:'-0.02em'}}>{o.order_number}</div><div style={{fontSize:11, color:'var(--text-muted)'}}>{new Date(o.created_at).toLocaleDateString()} • {o.items.length} items • {formatPrice(o.total)} • {o.town}</div></div>
                      <span style={{padding:'6px 12px', borderRadius:999, background: o.order_status==='Delivered' ? '#dcfce7' : o.order_status==='Cancelled' ? '#fef2f2' : 'var(--light)', border:'1px solid var(--border)', fontWeight:800, fontSize:11, color: o.order_status==='Delivered' ? '#166534' : o.order_status==='Cancelled' ? '#991b1b' : 'var(--text)'}}>{o.order_status} • {o.payment_status}</span>
                    </div>
                    <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:4, fontSize:12, background:'var(--light)', padding:10, borderRadius:10, border:'1px solid var(--border)'}}>
                      {o.items.map((it,idx)=> <div key={idx} style={{display:'flex', justifyContent:'space-between'}}><span>{it.name} × {it.qty}</span><span style={{fontWeight:700}}>{formatPrice(it.price * it.qty)}</span></div>)}
                    </div>
                    <div style={{marginTop:8, fontSize:11, color:'var(--text-muted)'}}>Deliver to: {o.estate}, {o.building} • {o.town} • Fee {formatPrice(o.delivery_fee)} • {o.customer_phone && `Phone ${o.customer_phone}`}</div>
                    <div style={{marginTop:10, display:'flex', gap:8, flexWrap:'wrap'}}>
                      <Link to={`/track`} style={{padding:'8px 16px', borderRadius:999, background:'var(--charcoal)', color:'white', fontWeight:700, fontSize:12}}>Track</Link>
                      <Link to={`/order-success/${o.order_number}`} style={{padding:'8px 16px', borderRadius:999, border:'1px solid var(--border)', fontWeight:700, fontSize:12, background:'white'}}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:20}}>
            <h2 style={{fontSize:20, fontWeight:800}}>Profile & Delivery Information</h2>
            <p style={{color:'var(--text-muted)', fontSize:12, marginTop:4}}>Saved to pre-fill checkout. Phone is your login — verified via OTP.</p>

            <div style={{marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800}}>FULL NAME *</span><input value={profile.fullName} onChange={e=>setProfile({...profile, fullName:e.target.value})} placeholder="Waren Kyle" className="input" style={{marginTop:6, borderRadius:12}}/></label>
              <label><span style={{fontSize:11, fontWeight:800}}>PHONE (OTP LOGIN) {user?.phone ? '✓' : '*'}</span>
                <div style={{display:'flex', gap:8, marginTop:6}}>
                  <span style={{display:'flex', alignItems:'center', padding:'0 10px', background:'var(--light)', border:'1px solid var(--border)', borderRadius:12, fontWeight:700, fontSize:12}}>🇰🇪 +254</span>
                  <input value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} placeholder="712 345 678" className="input" style={{flex:1, borderRadius:12}}/>
                </div>
                {user?.phone && <div style={{fontSize:10, color:'#166534', marginTop:4, fontWeight:700}}>Verified: {phoneDisplay}</div>}
              </label>
              <label><span style={{fontSize:11, fontWeight:800}}>EMAIL (OPTIONAL)</span><input value={profile.email} onChange={e=>setProfile({...profile, email:e.target.value})} placeholder="you@email.com" className="input" style={{marginTop:6, borderRadius:12}}/></label>
              <label><span style={{fontSize:11, fontWeight:800}}>ESTATE / AREA</span><input value={profile.estate} onChange={e=>setProfile({...profile, estate:e.target.value})} placeholder="e.g. Westlands, Sarit" className="input" style={{marginTop:6, borderRadius:12}}/></label>
              <label><span style={{fontSize:11, fontWeight:800}}>BUILDING / STREET</span><input value={profile.building} onChange={e=>setProfile({...profile, building:e.target.value})} placeholder="Building, street, floor" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            </div>

            {msg && <div style={{marginTop:12, padding:10, borderRadius:10, fontSize:12, fontWeight:700, background: msg.includes('✓') ? '#dcfce7' : '#fef2f2', color: msg.includes('✓') ? '#166534' : '#991b1b', border: `1px solid ${msg.includes('✓') ? '#86efac' : '#fecaca'}`}}>{msg}</div>}

            <button onClick={save} className="btn-primary" style={{marginTop:16, width:'100%', justifyContent:'center'}}>{saving ? 'Saving...' : 'Save Information'}</button>

            <div style={{marginTop:12, display:'flex', gap:8, flexWrap:'wrap'}}>
              <Link to="/auth" style={{flex:1, textAlign:'center', padding:'12px', borderRadius:12, border:'1px solid var(--border)', fontWeight:700, fontSize:12, background:'var(--light)'}}>Change phone (re-verify) →</Link>
              <Link to="/checkout" style={{flex:1, textAlign:'center', padding:'12px', borderRadius:12, background:'var(--champagne)', color:'var(--charcoal)', fontWeight:800, fontSize:12}}>Go to Checkout →</Link>
            </div>

            <div style={{marginTop:12, fontSize:11, color:'var(--text-muted)', background:'var(--light)', padding:12, borderRadius:12, border:'1px solid var(--border)', lineHeight:1.5}}>
              <b style={{color:'var(--text)'}}>Security:</b> We never expose whether a phone is registered. OTP codes expire in 5 minutes, max 5 attempts, 60s resend cooldown, and Row Level Security on profiles/orders. Demo code <code style={{background:'white', padding:'2px 6px', borderRadius:6, border:'1px solid var(--border)'}}>123456</code> works for testing.
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:900px){ .container{grid-template-columns:1fr !important} .container > div > div[style*="gridTemplateColumns:'1fr 1fr'"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
