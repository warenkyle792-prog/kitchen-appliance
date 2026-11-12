import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Package, Truck, AlertTriangle, TrendingUp, Banknote } from 'lucide-react'
import { products } from '../../data/products.js'
import { formatPrice } from '../../lib/utils.js'

export default function AdminDashboard() {
  const orders = JSON.parse(localStorage.getItem('velcor-orders') || '[]')
  const stats = useMemo(()=>{
    const totalSales = orders.reduce((s,o)=> s + o.total, 0)
    const unpaid = orders.filter(o=>o.payment_status==='Unpaid').reduce((s,o)=>s+o.total,0)
    const pending = orders.filter(o=>!['Delivered','Cancelled'].includes(o.order_status)).length
    const delivered = orders.filter(o=>o.order_status==='Delivered').length
    const lowStock = products.filter(p=>p.stock>0 && p.stock <5).length
    return { totalSales, unpaid, pending, delivered, lowStock, totalOrders: orders.length }
  }, [orders])

  const recent = [...orders].sort((a,b)=> new Date(b.created_at)-new Date(a.created_at)).slice(0,5)

  return (
    <div>
      <h1 style={{fontSize:24}}>Dashboard</h1>
      <p style={{color:'var(--text-muted)', fontSize:12}}>Velcor business at a glance — {new Date().toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{display:'flex', alignItems:'center', gap:8, color:'var(--text-muted)', fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}><ShoppingCart size={14}/> TOTAL ORDERS</div>
          <div style={{fontSize:28, fontWeight:800, marginTop:8}}>{stats.totalOrders}</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>{stats.pending} pending deliveries</div>
        </div>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{display:'flex', alignItems:'center', gap:8, color:'var(--text-muted)', fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}><Banknote size={14}/> TOTAL SALES</div>
          <div style={{fontSize:28, fontWeight:800, marginTop:8}}>{formatPrice(stats.totalSales)}</div>
          <div style={{fontSize:11, color:'var(--success)', fontWeight:700}}>All-time gross</div>
        </div>
        <div style={{background:'var(--champagne)', borderRadius:16, padding:16, color:'var(--charcoal)'}}>
          <div style={{display:'flex', alignItems:'center', gap:8, fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}><TrendingUp size={14}/> OUTSTANDING PAYMENTS</div>
          <div style={{fontSize:28, fontWeight:800, marginTop:8}}>{formatPrice(stats.unpaid)}</div>
          <div style={{fontSize:11, opacity:0.8}}>Cash to collect on delivery</div>
        </div>
        <div style={{background:'var(--charcoal)', color:'white', borderRadius:16, padding:16}}>
          <div style={{display:'flex', alignItems:'center', gap:8, fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}><Truck size={14} style={{color:'var(--champagne)'}}/> COMPLETED DELIVERIES</div>
          <div style={{fontSize:28, fontWeight:800, marginTop:8}}>{stats.delivered}</div>
          <div style={{fontSize:11, color:'#a8a8b8'}}>{stats.pending} pending • {stats.lowStock} low stock</div>
        </div>
      </div>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:12}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{fontWeight:800}}>Recent Orders</div>
            <Link to="/admin/orders" style={{fontSize:12, fontWeight:800, color:'var(--champagne-dark)'}}>View all →</Link>
          </div>
          {recent.length===0 ? <div style={{padding:'24px 0', textAlign:'center', color:'var(--text-muted)', fontSize:12}}>No orders yet. Share catalog to start selling.</div> : (
            <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
              {recent.map(o=>(
                <div key={o.order_number} style={{display:'flex', justifyContent:'space-between', padding:'10px 12px', border:'1px solid var(--border)', borderRadius:12, background:'var(--light)'}}>
                  <div><div style={{fontWeight:800, fontSize:12}}>{o.order_number} • {o.customer_name}</div><div style={{fontSize:11, color:'var(--text-muted)'}}>{o.order_status} • {o.payment_status} • {formatPrice(o.total)}</div></div>
                  <div style={{fontSize:10, color:'var(--text-muted)'}}>{new Date(o.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontWeight:800, display:'flex', alignItems:'center', gap:8}}><AlertTriangle size={14} style={{color:'#d97706'}}/> Alerts</div>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
            <div style={{padding:12, background:'#fef3c7', border:'1px solid #fde68a', borderRadius:12}}>
              <div style={{fontWeight:800, fontSize:12}}>Low Stock: {stats.lowStock} products</div>
              <div style={{fontSize:11, color:'#92400e'}}>Restock soon to avoid lost sales. View inventory.</div>
              <Link to="/admin/inventory" style={{marginTop:8, display:'inline-block', background:'var(--charcoal)', color:'white', padding:'6px 12px', borderRadius:999, fontWeight:800, fontSize:11}}>Manage Inventory</Link>
            </div>
            <div style={{padding:12, background:'var(--light)', border:'1px solid var(--border)', borderRadius:12}}>
              <div style={{fontWeight:800, fontSize:12}}>Bestsellers</div>
              <div style={{fontSize:11, color:'var(--text-muted)', marginTop:4}}>{products.filter(p=>p.bestseller).slice(0,3).map(p=>p.name).join(' • ')}</div>
            </div>
            <div style={{padding:12, background:'var(--champagne-glow)', border:'1px solid rgba(201,168,106,0.3)', borderRadius:12}}>
              <div style={{fontWeight:800, fontSize:12}}>Pay After Delivery</div>
              <div style={{fontSize:11, color:'var(--text-muted)'}}>Remember to mark orders as Paid only after cash is confirmed on delivery.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        <Link to="/admin/products" style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}><div style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center'}}><Package size={16}/></div><div style={{fontWeight:800, marginTop:8}}>Add Product</div><div style={{fontSize:11, color:'var(--text-muted)'}}>Upload photos, set price KSh, manage stock.</div></Link>
        <Link to="/admin/orders" style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}><div style={{width:36, height:36, borderRadius:10, background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center'}}><ShoppingCart size={16}/></div><div style={{fontWeight:800, marginTop:8}}>Process Orders</div><div style={{fontSize:11, color:'var(--text-muted)'}}>Confirm, assign delivery, print details.</div></Link>
        <Link to="/admin/deliveries" style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}><div style={{width:36, height:36, borderRadius:10, background:'var(--charcoal)', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><Truck size={16}/></div><div style={{fontWeight:800, marginTop:8}}>Delivery Fleet</div><div style={{fontSize:11, color:'var(--text-muted)'}}>Assign personnel, set fees, confirm cash collected.</div></Link>
      </div>
      <style>{`@media(max-width:900px){ div[style*="repeat(4,1fr)"], div[style*="repeat(3,1fr)"], div[style*="1.5fr 1fr"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
