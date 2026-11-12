import { useState } from 'react'
import { Search, Package, Truck, Check, Clock, Phone } from 'lucide-react'
import { formatPrice } from '../lib/utils.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function TrackOrder() {
  const { user } = useAuth()
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  const track = (e) => {
    e.preventDefault()
    setError('')
    const all = JSON.parse(localStorage.getItem('velcor-orders') || '[]')
    let found
    if (user) {
      found = all.find(o=> o.order_number.toLowerCase()===orderNumber.trim().toLowerCase())
    } else {
      found = all.find(o=> o.order_number.toLowerCase()===orderNumber.trim().toLowerCase() && o.customer_phone.replace(/\s/g,'')===phone.replace(/\s/g,''))
      if (!found && !phone) { setError('Enter phone number to verify guest order'); return }
    }
    if (!found) { setError('Order not found. Check order number and phone number.'); setOrder(null); return }
    setOrder(found)
  }

  const loadMyOrders = () => {
    if (!user) return []
    const all = JSON.parse(localStorage.getItem('velcor-orders') || '[]')
    return all.filter(o=> o.user_id===user.id).sort((a,b)=> new Date(b.created_at)-new Date(a.created_at))
  }

  const myOrders = user ? loadMyOrders() : []

  const getSteps = (status) => {
    const orderFlow = ['New Order','Confirmed','Processing','Ready for Delivery','Out for Delivery','Delivered']
    const idx = orderFlow.indexOf(status)
    return orderFlow.map((s,i)=> ({ label:s, done: i <= idx, active: i===idx }))
  }

  return (
    <div className="container" style={{padding:'24px'}}>
      <h1 style={{fontSize:28}}>Track Your Order</h1>
      <p style={{color:'var(--text-muted)', fontSize:13}}>Enter order number {user ? '(from your account)' : 'and phone number'} to see live status. Or view your order history below.</p>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div>
          <form onSubmit={track} style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
            <div style={{fontWeight:800}}>Track by Order Number</div>
            <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:10}}>
              <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>ORDER NUMBER *</span><input value={orderNumber} onChange={e=>setOrderNumber(e.target.value)} placeholder="VEL-2026-XXXX" className="input" style={{marginTop:6, borderRadius:12}}/></label>
              {!user && <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>PHONE NUMBER *</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0700 123 456" className="input" style={{marginTop:6, borderRadius:12}}/></label>}
              {error && <div style={{background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b', padding:10, borderRadius:12, fontSize:12, fontWeight:700}}>{error}</div>}
              <button className="btn-primary" style={{justifyContent:'center'}}><Search size={14}/> Track Order</button>
              <div style={{fontSize:11, color:'var(--text-muted)', textAlign:'center'}}>Example: VEL-2026-4821A — sent to your phone after checkout. Payment: Pay after delivery.</div>
            </div>
          </form>

          {user && myOrders.length>0 && (
            <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
              <div style={{fontWeight:800}}>My Orders ({myOrders.length})</div>
              <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
                {myOrders.map(o=>(
                  <button key={o.order_number} onClick={()=>{setOrderNumber(o.order_number); setOrder(o)}} style={{textAlign:'left', padding:12, borderRadius:12, border:'1px solid var(--border)', background: order?.order_number===o.order_number ? 'var(--charcoal)' : 'var(--light)', color: order?.order_number===o.order_number ? 'white' : 'var(--text)'}}>
                    <div style={{fontWeight:800, fontSize:12}}>{o.order_number} • {o.order_status}</div>
                    <div style={{fontSize:11, color: order?.order_number===o.order_number ? '#a8a8b8' : 'var(--text-muted)'}}>{new Date(o.created_at).toLocaleDateString()} • {formatPrice(o.total)} • {o.items.length} items</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {!order ? (
            <div style={{background:'var(--light)', border:'2px dashed var(--border)', borderRadius:20, padding:32, textAlign:'center'}}>
              <Package size={32} style={{color:'var(--text-muted)', margin:'0 auto'}}/>
              <div style={{fontWeight:800, marginTop:12}}>No order selected</div>
              <div style={{fontSize:12, color:'var(--text-muted)', marginTop:6}}>Enter order number and phone to view live delivery status, items, payment status and delivery notes.</div>
            </div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:16}}>
              <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div><div style={{fontWeight:800}}>{order.order_number}</div><div style={{fontSize:11, color:'var(--text-muted)'}}>Placed {new Date(order.created_at).toLocaleString('en-KE')} • {order.items.length} items</div></div>
                  <span style={{background: order.order_status==='Delivered' ? '#dcfce7' : order.order_status==='Cancelled' ? '#fee2e2' : 'var(--champagne)', color: order.order_status==='Delivered' ? '#166534' : order.order_status==='Cancelled' ? '#991b1b' : 'var(--charcoal)', padding:'6px 12px', borderRadius:999, fontWeight:800, fontSize:11}}>{order.order_status}</span>
                </div>

                <div style={{marginTop:16, position:'relative', paddingLeft:24}}>
                  <div style={{position:'absolute', left:7, top:8, bottom:8, width:2, background:'var(--border)'}}></div>
                  {getSteps(order.order_status).map(s=>(
                    <div key={s.label} style={{position:'relative', display:'flex', gap:12, padding:'10px 0'}}>
                      <div style={{position:'absolute', left:-24, width:16, height:16, borderRadius:'50%', background: s.done ? 'var(--charcoal)' : 'var(--white)', border: s.done ? 'none' : '2px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
                        {s.done ? <Check size={8}/> : null}
                      </div>
                      <div style={{fontWeight: s.active ? 800 : 600, fontSize:13, color: s.done ? 'var(--text)' : 'var(--text-muted)'}}>{s.label} {s.active && <span style={{background:'var(--champagne)', color:'var(--charcoal)', padding:'2px 8px', borderRadius:999, fontSize:10, marginLeft:6}}>Current</span>}</div>
                    </div>
                  ))}
                  {order.order_status==='Cancelled' && <div style={{marginTop:8, background:'#fee2e2', color:'#991b1b', padding:10, borderRadius:12, fontSize:12, fontWeight:700}}>This order was cancelled. Stock restored. Contact support if needed.</div>}
                </div>

                <div style={{marginTop:16, display:'flex', gap:10, flexWrap:'wrap'}}>
                  <div style={{flex:1, background:'var(--light)', borderRadius:12, padding:12}}>
                    <div style={{fontWeight:800, fontSize:11, letterSpacing:'0.06em'}}>PAYMENT</div>
                    <div style={{fontSize:12, marginTop:4}}>{order.payment_method} • <span style={{background: order.payment_status==='Paid' ? '#dcfce7' : order.payment_status==='Unpaid' ? '#fef9c3' : '#fee2e2', padding:'2px 8px', borderRadius:999, fontWeight:800, fontSize:10}}>{order.payment_status}</span></div>
                    <div style={{fontSize:10, color:'var(--text-muted)', marginTop:4}}>Cash collected after delivery. Only admin can mark as Paid.</div>
                  </div>
                  <div style={{flex:1, background:'var(--light)', borderRadius:12, padding:12}}>
                    <div style={{fontWeight:800, fontSize:11, letterSpacing:'0.06em'}}>DELIVERY</div>
                    <div style={{fontSize:12, marginTop:4}}>{order.estate}, {order.building} • {order.town}</div>
                    <div style={{fontSize:10, color:'var(--text-muted)'}}>Fee: {formatPrice(order.delivery_fee)} • Total: {formatPrice(order.total)}</div>
                  </div>
                </div>

                <div style={{marginTop:12, background:'var(--champagne-glow)', border:'1px solid rgba(201,168,106,0.25)', borderRadius:12, padding:10, fontSize:11, display:'flex', gap:8, alignItems:'center'}}>
                  <Truck size={14} style={{color:'var(--champagne-dark)'}}/><span><b>Delivery:</b> {order.delivery_personnel ? `Assigned to ${order.delivery_personnel}` : 'Velcor will assign delivery personnel shortly'} • Dispatch: {order.dispatch_date ? new Date(order.dispatch_date).toLocaleDateString() : 'Pending'}</span>
                </div>
              </div>

              <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
                <div style={{fontWeight:800}}>Items & Delivery Info</div>
                <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
                  {order.items.map((i,idx)=>(
                    <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:13, padding:'8px 0', borderBottom:'1px solid var(--light)'}}>
                      <span>{i.name} × {i.qty}</span><span style={{fontWeight:700}}>{formatPrice(i.price * i.qty)}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12, fontSize:12}}>
                  <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Customer</span><span style={{fontWeight:700}}>{order.customer_name} • {order.customer_phone}</span></div>
                  <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Address</span><span style={{fontWeight:700, textAlign:'right', maxWidth:200}}>{order.estate}, {order.building} {order.house_number} • {order.town}</span></div>
                  {order.delivery_instructions && <div style={{marginTop:8, background:'var(--light)', padding:10, borderRadius:10, fontSize:11}}><b>Instructions:</b> {order.delivery_instructions}</div>}
                  <div style={{marginTop:8, display:'flex', justifyContent:'space-between', fontWeight:800}}><span>Amount Due on Delivery</span><span style={{color:'var(--champagne-dark)'}}>{formatPrice(order.total)}</span></div>
                </div>
              </div>

              <div style={{background:'var(--charcoal)', color:'white', borderRadius:16, padding:16, display:'flex', gap:12, alignItems:'center'}}>
                <Phone size={16} style={{color:'var(--champagne)'}}/><div><div style={{fontWeight:800, fontSize:13}}>Need help?</div><div style={{fontSize:11, color:'#a8a8b8'}}>Call Velcor: 0700 123 456 • {order.order_number}</div></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:900px){ div[style*="gridTemplateColumns:'1fr 1fr'"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
