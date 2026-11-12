import { useState, useEffect } from 'react'
import { formatPrice } from '../../lib/utils.js'
import { towns } from '../../lib/deliveryFees.js'
import { Truck, User, MapPin, Check, Clock } from 'lucide-react'

const PERSONNEL = ['James Mwangi (Bike KDB 123X)', 'Achieng O. (Van KDA 456Y)', 'Kevin L. (Bike KDC 789Z)', 'Fatma A. (Van)']

export default function AdminDeliveries() {
  const [orders, setOrders] = useState(()=> JSON.parse(localStorage.getItem('velcor-orders') || '[]'))
  const [fees, setFees] = useState(()=> JSON.parse(localStorage.getItem('velcor-delivery-fees') || JSON.stringify(towns.reduce((a,t)=>(a[t.id]=t.fee,a),{}))))
  const [personnel, setPersonnel] = useState(()=> JSON.parse(localStorage.getItem('velcor-personnel') || JSON.stringify(PERSONNEL)))

  useEffect(()=> localStorage.setItem('velcor-orders', JSON.stringify(orders)), [orders])
  useEffect(()=> localStorage.setItem('velcor-delivery-fees', JSON.stringify(fees)), [fees])

  const active = orders.filter(o=> ['Ready for Delivery','Out for Delivery'].includes(o.order_status))
  const completed = orders.filter(o=> o.order_status==='Delivered')

  const assign = (orderNumber, person) => {
    setOrders(prev=> prev.map(o=> o.order_number===orderNumber ? { ...o, delivery_personnel: person, dispatch_date: new Date().toISOString(), order_status: 'Out for Delivery' } : o))
  }
  const confirmDelivery = (orderNumber, cashCollected) => {
    setOrders(prev=> prev.map(o=> o.order_number===orderNumber ? { ...o, order_status:'Delivered', payment_status: cashCollected ? 'Paid' : o.payment_status, cash_collected: cashCollected ? o.total : 0, delivery_confirmed: new Date().toISOString() } : o))
  }
  const updateFee = (townId, val) => {
    const f = parseInt(val) || 0
    setFees(prev=> ({...prev, [townId]: f}))
  }

  return (
    <div>
      <h2 style={{fontSize:20}}>Delivery Management</h2>
      <p style={{fontSize:12, color:'var(--text-muted)'}}>Assign personnel, set fees by location, monitor active deliveries, confirm cash collected</p>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em', color:'var(--text-muted)', display:'flex', gap:6, alignItems:'center'}}><Truck size={14}/> ACTIVE DELIVERIES</div>
          <div style={{fontSize:28, fontWeight:800}}>{active.length}</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>Out for delivery • Ready for delivery</div>
        </div>
        <div style={{background:'var(--champagne)', borderRadius:16, padding:16, color:'var(--charcoal)'}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>COMPLETED TODAY</div>
          <div style={{fontSize:28, fontWeight:800}}>{completed.length}</div>
          <div style={{fontSize:11, opacity:0.8}}>Cash collected after delivery</div>
        </div>
        <div style={{background:'var(--charcoal)', color:'white', borderRadius:16, padding:16}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em', color:'var(--champagne)'}}>PERSONNEL</div>
          <div style={{fontSize:14, fontWeight:800, marginTop:4}}>{personnel.length} riders/vans</div>
          <div style={{fontSize:11, color:'#a8a8b8'}}>{personnel.join(' • ')}</div>
        </div>
      </div>

      <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
        <div style={{fontWeight:800}}>Active Deliveries</div>
        {active.length===0 ? <div style={{padding:20, textAlign:'center', color:'var(--text-muted)', fontSize:12}}>No active deliveries. Confirm orders to move them to delivery.</div> : (
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:10}}>
            {active.map(o=>(
              <div key={o.order_number} style={{padding:12, border:'1px solid var(--border)', borderRadius:12, background:'var(--light)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8}}>
                <div>
                  <div style={{fontWeight:800, fontSize:12}}>{o.order_number} • {o.customer_name} • {o.customer_phone}</div>
                  <div style={{fontSize:11, color:'var(--text-muted)'}}>{o.estate}, {o.building} • {o.town} • {formatPrice(o.total)} • {o.order_status}</div>
                  <div style={{fontSize:11, marginTop:4}}><MapPin size={12} style={{display:'inline'}}/> {o.estate} • Personnel: {o.delivery_personnel || 'Not assigned'} • Dispatch: {o.dispatch_date ? new Date(o.dispatch_date).toLocaleDateString() : '—'}</div>
                </div>
                <div style={{display:'flex', gap:6, alignItems:'center', flexWrap:'wrap'}}>
                  <select onChange={e=>assign(o.order_number, e.target.value)} defaultValue="" className="input select" style={{borderRadius:999, height:36, fontSize:11}}>
                    <option value="" disabled>Assign personnel</option>
                    {personnel.map(p=> <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={()=>confirmDelivery(o.order_number, true)} style={{padding:'8px 14px', borderRadius:999, background:'#0e9f6e', color:'white', border:'none', fontWeight:700, fontSize:11, display:'flex', alignItems:'center', gap:6}}><Check size={12}/> Confirm Delivery & Cash {formatPrice(o.total)}</button>
                  <button onClick={()=>confirmDelivery(o.order_number, false)} style={{padding:'8px 14px', borderRadius:999, background:'var(--white)', border:'1px solid var(--border)', fontWeight:700, fontSize:11}}>Mark Delivered (Unpaid)</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontWeight:800, display:'flex', gap:6, alignItems:'center'}}><MapPin size={14}/> Delivery Fees by Location</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>Configurable per town — updates checkout instantly</div>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8, maxHeight:360, overflowY:'auto'}}>
            {Object.entries(fees).map(([town, fee])=>(
              <div key={town} style={{display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'var(--light)', borderRadius:10}}>
                <span style={{flex:1, fontWeight:700, fontSize:12}}>{towns.find(t=>t.id===town)?.label || town}</span>
                <span style={{fontSize:11, color:'var(--text-muted)'}}>KSh</span>
                <input type="number" value={fee} onChange={e=>updateFee(town, e.target.value)} style={{width:80, padding:'6px 8px', borderRadius:8, border:'1px solid var(--border)', fontSize:12}}/>
              </div>
            ))}
          </div>
          <button onClick={()=>{ localStorage.setItem('velcor-delivery-fees', JSON.stringify(fees)); alert('Delivery fees saved — checkout will use new fees.') }} className="btn-primary" style={{marginTop:12, width:'100%', justifyContent:'center'}}>Save Fees</button>
        </div>

        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontWeight:800, display:'flex', gap:6, alignItems:'center'}}><User size={14}/> Delivery Personnel</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>Velcor own delivery team</div>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
            {personnel.map((p,i)=>(
              <div key={p} style={{display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'var(--light)', borderRadius:10, border:'1px solid var(--border)'}}>
                <div style={{width:28, height:28, borderRadius:'50%', background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:10}}>{p.slice(0,1)}</div>
                <span style={{flex:1, fontWeight:700, fontSize:12}}>{p}</span>
                <button onClick={()=> setPersonnel(prev=> prev.filter((_,idx)=> idx!==i))} style={{padding:'4px 10px', borderRadius:999, background:'#fee2e2', border:'1px solid #fecaca', fontSize:10, fontWeight:700}}>Remove</button>
              </div>
            ))}
          </div>
          <form onSubmit={e=>{e.preventDefault(); const fd=new FormData(e.target); const name=fd.get('name'); if(name) { setPersonnel(prev=>[...prev, name.toString()]); e.target.reset() }}} style={{marginTop:12, display:'flex', gap:8}}>
            <input name="name" placeholder="Add rider: Name (Bike KDX...)" className="input" style={{flex:1, borderRadius:999, fontSize:12}}/>
            <button className="btn-primary" style={{padding:'10px 16px', fontSize:12}}>Add</button>
          </form>
          <div style={{marginTop:12, background:'var(--light)', borderRadius:10, padding:10, fontSize:11}}>
            <div style={{fontWeight:800}}>Recent deliveries</div>
            {completed.slice(0,3).map(o=> <div key={o.order_number} style={{display:'flex', justifyContent:'space-between', fontSize:11, marginTop:6}}><span>{o.order_number} • {o.delivery_personnel}</span><span style={{color:'var(--success)', fontWeight:700}}>{o.payment_status} • {formatPrice(o.total)}</span></div>)}
            {completed.length===0 && <div style={{fontSize:11, color:'var(--text-muted)', marginTop:6}}>No completed yet.</div>}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ div[style*="repeat(3,1fr)"], div[style*="1fr 1fr"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
