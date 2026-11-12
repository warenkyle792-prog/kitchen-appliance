import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrice } from '../lib/utils.js'

export default function Account() {
  const { user, logout, updateProfile } = useAuth()
  const [tab, setTab] = useState('orders')
  const [profile, setProfile] = useState({ fullName: user?.full_name || '', phone: '', estate:'', building:'' })
  const [saving, setSaving] = useState(false)
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    if(user){
      const saved = JSON.parse(localStorage.getItem('velcor-profile-' + user.id) || '{}')
      setProfile({ fullName: saved.fullName || user.full_name || '', phone: saved.phone || saved.customer_phone || '', estate: saved.estate || '', building: saved.building || '' })
      const all = JSON.parse(localStorage.getItem('velcor-orders') || '[]')
      setOrders(all.filter(o=> o.user_id===user.id).sort((a,b)=> new Date(b.created_at)-new Date(a.created_at)))
    }
  }, [user])

  const save = async () => {
    setSaving(true)
    await updateProfile({ full_name: profile.fullName })
    localStorage.setItem('velcor-profile-' + user.id, JSON.stringify(profile))
    setSaving(false)
    alert('Profile saved')
  }

  return (
    <div className="container" style={{padding:'24px', display:'grid', gridTemplateColumns:'240px 1fr', gap:24}}>
      <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16, height:'fit-content'}}>
        <div style={{textAlign:'center', padding:12, background:'var(--light)', borderRadius:12}}>
          <div style={{width:48, height:48, borderRadius:'50%', background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', color:'var(--charcoal)', fontWeight:800}}>{(user?.full_name || user?.email || 'U').slice(0,1).toUpperCase()}</div>
          <div style={{fontWeight:800, marginTop:8}}>{user?.full_name || 'Velcor Customer'}</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>{user?.email}</div>
        </div>
        <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:6}}>
          <button onClick={()=>setTab('orders')} style={{padding:12, borderRadius:12, background: tab==='orders' ? 'var(--charcoal)' : 'transparent', color: tab==='orders' ? 'white' : 'var(--text)', border:'none', fontWeight:700, textAlign:'left'}}>📦 Order History</button>
          <button onClick={()=>setTab('profile')} style={{padding:12, borderRadius:12, background: tab==='profile' ? 'var(--charcoal)' : 'transparent', color: tab==='profile' ? 'white' : 'var(--text)', border:'none', fontWeight:700, textAlign:'left'}}>👤 Profile & Delivery Info</button>
          <Link to="/track" style={{padding:12, borderRadius:12, fontWeight:700}}>🔍 Track Order</Link>
          <Link to="/catalog" style={{padding:12, borderRadius:12, fontWeight:700}}>🛍️ Shop Again</Link>
          <button onClick={logout} style={{padding:12, borderRadius:12, background:'#fef2f2', color:'#991b1b', border:'1px solid #fecaca', fontWeight:700, textAlign:'left', marginTop:8}}>Sign Out</button>
        </div>
      </div>

      <div>
        {tab==='orders' ? (
          <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:20}}>
            <h2 style={{fontSize:20}}>Order History</h2>
            <p style={{color:'var(--text-muted)', fontSize:12}}>{orders.length} orders • Pay after delivery</p>
            {orders.length===0 ? <div style={{textAlign:'center', padding:'40px 0', color:'var(--text-muted)'}}>No orders yet.<Link to="/catalog" style={{color:'var(--champagne-dark)', fontWeight:800}}> Start shopping →</Link></div> : (
              <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:12}}>
                {orders.map(o=>(
                  <div key={o.order_number} style={{border:'1px solid var(--border)', borderRadius:12, padding:16}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8}}>
                      <div><div style={{fontWeight:800}}>{o.order_number}</div><div style={{fontSize:11, color:'var(--text-muted)'}}>{new Date(o.created_at).toLocaleDateString()} • {o.items.length} items • {formatPrice(o.total)}</div></div>
                      <span style={{padding:'6px 12px', borderRadius:999, background: o.order_status==='Delivered' ? '#dcfce7' : 'var(--light)', border:'1px solid var(--border)', fontWeight:800, fontSize:11}}>{o.order_status} • {o.payment_status}</span>
                    </div>
                    <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:4, fontSize:12}}>
                      {o.items.map((it,idx)=> <div key={idx} style={{display:'flex', justifyContent:'space-between'}}><span>{it.name} × {it.qty}</span><span style={{fontWeight:700}}>{formatPrice(it.price * it.qty)}</span></div>)}
                    </div>
                    <div style={{marginTop:8, fontSize:11, color:'var(--text-muted)'}}>Deliver to: {o.estate}, {o.building} • {o.town} • Fee {formatPrice(o.delivery_fee)}</div>
                    <div style={{marginTop:8, display:'flex', gap:8}}>
                      <Link to={`/track`} style={{padding:'8px 16px', borderRadius:999, background:'var(--charcoal)', color:'white', fontWeight:700, fontSize:12}}>Track</Link>
                      <Link to={`/order-success/${o.order_number}`} style={{padding:'8px 16px', borderRadius:999, border:'1px solid var(--border)', fontWeight:700, fontSize:12}}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:20}}>
            <h2 style={{fontSize:20}}>Saved Delivery Information</h2>
            <p style={{color:'var(--text-muted)', fontSize:12}}>Used to pre-fill checkout next time.</p>
            <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <label><span style={{fontSize:11, fontWeight:800}}>FULL NAME</span><input value={profile.fullName} onChange={e=>setProfile({...profile, fullName:e.target.value})} className="input" style={{marginTop:6, borderRadius:12}}/></label>
              <label><span style={{fontSize:11, fontWeight:800}}>PHONE</span><input value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} className="input" style={{marginTop:6, borderRadius:12}}/></label>
              <label><span style={{fontSize:11, fontWeight:800}}>ESTATE / AREA</span><input value={profile.estate} onChange={e=>setProfile({...profile, estate:e.target.value})} className="input" style={{marginTop:6, borderRadius:12}}/></label>
              <label><span style={{fontSize:11, fontWeight:800}}>BUILDING / STREET</span><input value={profile.building} onChange={e=>setProfile({...profile, building:e.target.value})} className="input" style={{marginTop:6, borderRadius:12}}/></label>
            </div>
            <button onClick={save} className="btn-primary" style={{marginTop:16}}>{saving ? 'Saving...' : 'Save Information'}</button>
            <div style={{marginTop:12, fontSize:11, color:'var(--text-muted)'}}>Email: {user?.email} • Guest orders linked via phone still accessible at /track</div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:768px){ .container{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
