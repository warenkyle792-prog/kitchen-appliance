import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrice, generateOrderNumber } from '../lib/utils.js'
import { towns, getDeliveryFee } from '../lib/deliveryFees.js'
import { normalizePhoneToE164, validateKenyanPhone } from '../lib/phoneUtils.js'
import { ShieldCheck, Check, AlertTriangle, Phone, ArrowRight } from 'lucide-react'

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: user?.full_name || user?.user_metadata?.full_name || '',
    phone: user?.phone || '',
    email: user?.email && !user.email.includes('@velcor.phone') ? user.email : '',
    town: 'westlands',
    estate: '',
    building: '',
    houseNumber: '',
    instructions: '',
    paymentMethod: 'Cash on Delivery'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Prefill from saved profile when user changes / loads
  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem('velcor-profile-' + user.id) || '{}')
      setForm(f => ({
        ...f,
        fullName: f.fullName || saved.fullName || user.full_name || saved.fullName || '',
        phone: f.phone || user.phone || saved.phone || saved.customer_phone || '',
        email: f.email || (user.email && !user.email.includes('@velcor.phone') ? user.email : saved.email || ''),
        estate: f.estate || saved.estate || '',
        building: f.building || saved.building || '',
        town: f.town || saved.town || 'westlands',
        houseNumber: f.houseNumber || saved.houseNumber || saved.house_number || ''
      }))
    }
  }, [user])

  if (items.length===0) return <div className="container" style={{padding:'60px 0', textAlign:'center'}}><h2>Your bag is empty</h2><p style={{color:'var(--text-muted)', fontSize:13, marginTop:6}}>Add items to cart to checkout.</p><Link to="/catalog" className="btn-primary" style={{marginTop:16, display:'inline-flex'}}>Shop Now</Link></div>

  const deliveryFee = getDeliveryFee(form.town)
  const delivery = subtotal >=20000 ? 0 : deliveryFee
  const total = subtotal + delivery

  const validate = () => {
    if (!form.fullName.trim() || form.fullName.trim().length < 3) return 'Enter full name (at least 3 characters)'
    const pv = validateKenyanPhone(form.phone)
    if (!pv.valid) return pv.error
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter valid email or leave blank'
    if (!form.estate.trim()) return 'Enter estate / area'
    if (!form.building.trim()) return 'Enter building / street'
    return ''
  }

  const placeOrder = async () => {
    const v = validate()
    if (v) { setError(v); return }
    setError('')
    setLoading(true)
    const normalizedPhone = normalizePhoneToE164(form.phone)
    const orderNumber = generateOrderNumber()
    const order = {
      order_number: orderNumber,
      customer_name: form.fullName,
      customer_phone: normalizedPhone,
      customer_email: form.email || null,
      town: form.town,
      estate: form.estate,
      building: form.building,
      house_number: form.houseNumber,
      delivery_fee: delivery,
      subtotal,
      total,
      payment_method: 'Cash on Delivery',
      payment_status: 'Unpaid',
      order_status: 'New Order',
      delivery_instructions: form.instructions,
      items: items.map(i=>({ id: i.id, name: i.name, qty: i.qty, price: i.price, brand: i.brand, model: i.model })),
      created_at: new Date().toISOString(),
      user_id: user?.id || null,
      delivery_personnel: null,
      dispatch_date: null
    }
    try {
      const existing = JSON.parse(localStorage.getItem('velcor-orders') || '[]')
      existing.push(order)
      localStorage.setItem('velcor-orders', JSON.stringify(existing))
      // Also store normalized phone -> order link for guest tracking
      if (user) {
        const profile = JSON.parse(localStorage.getItem('velcor-profile-' + user.id) || '{}')
        localStorage.setItem('velcor-profile-' + user.id, JSON.stringify({...profile, ...form, customer_phone: normalizedPhone}))
      } else {
        // guest: store guest phone link for later association when they sign in
        localStorage.setItem('velcor-guest-phone', normalizedPhone)
        localStorage.setItem('velcor-guest-info', JSON.stringify(form))
      }
      // Try to also push to Supabase if configured
      // (best-effort, ignore errors)
      setTimeout(()=>{
        clear()
        setLoading(false)
        navigate(`/order-success/${orderNumber}`, { state: { order }})
      }, 700)
    } catch(e){
      setLoading(false)
      setError('Failed to place order: ' + e.message)
    }
  }

  return (
    <div className="container" style={{padding:'24px', display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:24}}>
      <div>
        <h1 style={{fontSize:28, fontWeight:800, letterSpacing:'-0.02em'}}>Checkout</h1>
        <div style={{marginTop:6, display:'flex', gap:8, alignItems:'center'}}>
          <span style={{width:24, height:24, borderRadius:'50%', background: step>=1 ? 'var(--champagne)' : 'var(--border)', color: step>=1 ? 'var(--charcoal)' : 'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:11}}>1</span>
          <span style={{fontWeight:700, fontSize:12}}>Delivery Details</span>
          <span style={{width:24, height:1, background:'var(--border)'}}></span>
          <span style={{width:24, height:24, borderRadius:'50%', background: step>=2 ? 'var(--champagne)' : 'var(--border)', color:'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:11}}>2</span>
          <span style={{fontWeight:700, fontSize:12, color:'var(--text-muted)'}}>Review & Confirm</span>
        </div>

        {/* Auth nudge: sign in before checkout, preserve cart, guest optional */}
        {!user ? (
          <div style={{marginTop:14, background:'linear-gradient(135deg, #1a1a1e 0%, #252529 100%)', border:'1px solid rgba(201,168,106,0.18)', borderRadius:16, padding:16, display:'flex', gap:14, alignItems:'center', flexWrap:'wrap'}}>
            <div style={{width:44, height:44, borderRadius:12, background:'rgba(201,168,106,0.12)', border:'1px solid rgba(201,168,106,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Phone size={18} style={{color:'#c9a86a'}}/></div>
            <div style={{flex:1, minWidth:180}}>
              <div style={{fontWeight:800, fontSize:13, color:'white'}}>Sign in for faster checkout</div>
              <div style={{fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2, lineHeight:1.4}}>We’ll pre-fill delivery info and auto-link orders to your phone. Cart is preserved after sign-in. Guest checkout also available.</div>
            </div>
            <Link to="/auth" state={{ from: '/checkout' }} onClick={()=>{ try{ localStorage.setItem('velcor-cart', JSON.stringify(items)) } catch{}}} style={{padding:'10px 18px', borderRadius:999, background:'var(--champagne)', color:'var(--charcoal)', fontWeight:800, fontSize:12, display:'inline-flex', alignItems:'center', gap:6, whiteSpace:'nowrap'}}>Sign in with phone <ArrowRight size={14}/></Link>
          </div>
        ) : (
          <div style={{marginTop:14, background:'#dcfce7', border:'1px solid #86efac', borderRadius:12, padding:12, display:'flex', gap:10, alignItems:'center'}}>
            <span style={{width:28, height:28, borderRadius:'50%', background:'var(--charcoal)', color:'#c9a86a', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12}}>✓</span>
            <div style={{fontSize:12, color:'#166534', fontWeight:600}}>Signed in as <b style={{color:'#14532d'}}>{user.phone ? user.phone : user.email}</b> — orders will be auto-linked. Cart preserved.</div>
            <Link to="/account" style={{marginLeft:'auto', fontSize:11, fontWeight:800, color:'#166534', textDecoration:'underline'}}>Account →</Link>
          </div>
        )}

        <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
          <div style={{background:'var(--charcoal)', color:'white', borderRadius:12, padding:12, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
            <ShieldCheck size={16} style={{color:'var(--champagne)'}}/>
            <div style={{fontSize:12, fontWeight:700}}>Pay after delivery. No advance payment.</div>
            <span style={{marginLeft:'auto', background:'var(--champagne)', color:'var(--charcoal)', padding:'6px 10px', borderRadius:999, fontSize:10, fontWeight:800}}>CASH ON DELIVERY</span>
          </div>

          <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>FULL NAME *</span><input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} placeholder="Waren Kyle" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>PHONE NUMBER *</span><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="0700 123 456 or +254..." className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>EMAIL (OPTIONAL)</span><input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="you@email.com" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>TOWN / AREA *</span>
              <select value={form.town} onChange={e=>setForm({...form, town:e.target.value})} className="input select" style={{marginTop:6, borderRadius:12}}>
                {towns.map(t=> <option key={t.id} value={t.id}>{t.label} — KSh {t.fee}</option>)}
              </select>
            </label>
            <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>ESTATE / AREA *</span><input value={form.estate} onChange={e=>setForm({...form, estate:e.target.value})} placeholder="e.g. Westlands, Sarit Centre" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>BUILDING / STREET *</span><input value={form.building} onChange={e=>setForm({...form, building:e.target.value})} placeholder="Building name, street, floor, apartment" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>HOUSE / APARTMENT NO.</span><input value={form.houseNumber} onChange={e=>setForm({...form, houseNumber:e.target.value})} placeholder="e.g. Apt 3B" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>DELIVERY INSTRUCTIONS</span><textarea value={form.instructions} onChange={e=>setForm({...form, instructions:e.target.value})} placeholder="Gate code, nearest landmark, best time to deliver..." className="input textarea" rows={3} style={{marginTop:6, borderRadius:12}}></textarea></label>
          </div>

          <div style={{marginTop:16, borderTop:'1px solid var(--border)', paddingTop:16}}>
            <div style={{fontWeight:800, fontSize:12, letterSpacing:'0.06em'}}>PAYMENT METHOD</div>
            <div style={{marginTop:8, padding:12, border:'2px solid var(--champagne)', borderRadius:12, background:'var(--champagne-glow)', display:'flex', alignItems:'center', gap:12}}>
              <div style={{width:36, height:36, borderRadius:'50%', background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center'}}><Check size={16} style={{color:'var(--charcoal)'}}/></div>
              <div><div style={{fontWeight:800}}>Cash on Delivery</div><div style={{fontSize:11, color:'var(--text-muted)'}}>Pay with cash when your appliances arrive. No advance payment required.</div></div>
              <span style={{marginLeft:'auto', background:'var(--charcoal)', color:'white', padding:'6px 10px', borderRadius:999, fontSize:11, fontWeight:800}}>Selected</span>
            </div>
            <div style={{marginTop:8, fontSize:11, color:'var(--text-muted)', display:'flex', gap:6, alignItems:'center'}}><AlertTriangle size={12}/> Never pay in advance. Pay only after delivery confirmation.</div>
          </div>

          {error && <div style={{marginTop:12, background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b', padding:12, borderRadius:12, fontSize:12, fontWeight:700}}>{error}</div>}

          <button onClick={()=>{ const v=validate(); if(v){ setError(v); return } setError(''); setStep(2); window.scrollTo({top:0, behavior:'smooth'})}} style={{marginTop:16, width:'100%', padding:'16px', borderRadius:999, background:'var(--charcoal)', color:'white', fontWeight:800, border:'none', cursor:'pointer'}}>Review Order →</button>
          <div style={{marginTop:8, textAlign:'center', fontSize:11, color:'var(--text-muted)'}}>{user ? 'You’re signed in — order will be linked to your account.' : 'Guest checkout: enter phone to track via /track. Sign in to see all orders in Account.'}</div>
        </div>
      </div>

      <div style={{position:'sticky', top:88, height:'fit-content'}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
          <h3 style={{fontSize:18, fontWeight:800}}>Order Review</h3>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:10}}>
            {items.map(i=>(
              <div key={i.id} style={{display:'flex', gap:10, alignItems:'center'}}>
                <img src={i.images[0]} alt={i.name} style={{width:48, height:48, borderRadius:10, objectFit:'cover', background:'var(--light)'}}/>
                <div style={{flex:1}}><div style={{fontWeight:700, fontSize:12, lineHeight:1.3}}>{i.name}</div><div style={{fontSize:11, color:'var(--text-muted)'}}>Qty {i.qty} • {i.brand}</div></div>
                <div style={{fontWeight:800, fontSize:12}}>{formatPrice(i.price * i.qty)}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16, borderTop:'1px solid var(--border)', paddingTop:12, display:'flex', flexDirection:'column', gap:6, fontSize:13}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Subtotal</span><span style={{fontWeight:700}}>{formatPrice(subtotal)}</span></div>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Delivery ({towns.find(t=>t.id===form.town)?.label})</span><span style={{fontWeight:700, color: subtotal>=20000 ? 'var(--success)' : 'var(--text)'}}>{subtotal>=20000 ? 'FREE' : formatPrice(delivery)}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:800, paddingTop:8, borderTop:'1px solid var(--border)'}}><span>Total</span><span>{formatPrice(total)}</span></div>
            <div style={{fontSize:10, color:'var(--text-muted)', textAlign:'center', marginTop:4}}>Delivery fee configurable by admin • Cash collected after delivery</div>
          </div>
          {step===2 && (
            <div style={{marginTop:16, background:'var(--light)', borderRadius:16, padding:16}}>
              <div style={{fontWeight:800, fontSize:12}}>Deliver to</div>
              <div style={{fontSize:12, color:'var(--text-muted)', marginTop:4}}>{form.fullName} • {form.phone}<br/>{form.estate}, {form.building} {form.houseNumber && `• ${form.houseNumber}`}<br/>{towns.find(t=>t.id===form.town)?.label}</div>
              {form.instructions && <div style={{marginTop:8, fontSize:11, background:'var(--white)', padding:8, borderRadius:8, border:'1px solid var(--border)'}}><b>Instructions:</b> {form.instructions}</div>}
              <button onClick={placeOrder} disabled={loading} style={{marginTop:12, width:'100%', padding:'16px', borderRadius:999, background:'var(--champagne)', color:'var(--charcoal)', fontWeight:800, border:'none', opacity: loading ? 0.7 : 1, cursor:'pointer'}}>
                {loading ? 'Placing Order...' : `Confirm & Pay After Delivery — ${formatPrice(total)}`}
              </button>
              <button onClick={()=>setStep(1)} style={{marginTop:8, width:'100%', padding:'12px', borderRadius:999, background:'transparent', border:'1px solid var(--border)', fontWeight:700, cursor:'pointer'}}>Edit Details</button>
              <div style={{marginTop:8, fontSize:10, textAlign:'center', color:'var(--text-muted)'}}>By placing order you agree to Velcor’s delivery & warranty terms. Order number will be generated.</div>
            </div>
          )}
          {step===1 && <div style={{marginTop:12, textAlign:'center', fontSize:11, color:'var(--text-muted)'}}>Review your order in the next step before confirming.</div>}
        </div>
      </div>
      <style>{`@media(max-width:900px){ .container{grid-template-columns:1fr !important} .container > div:first-child > div > div[style*="gridTemplateColumns:'1fr 1fr'"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
