import { formatPrice } from '../../lib/utils.js'
import { products } from '../../data/products.js'

export default function AdminAnalytics() {
  const orders = JSON.parse(localStorage.getItem('velcor-orders') || '[]')
  const totalSales = orders.reduce((s,o)=>s+o.total,0)
  const unpaid = orders.filter(o=>o.payment_status==='Unpaid').reduce((s,o)=>s+o.total,0)
  const byStatus = orders.reduce((a,o)=>{ a[o.order_status]=(a[o.order_status]||0)+1; return a }, {})
  const bestsellers = (()=> {
    const counts = {}
    orders.forEach(o=> o.items.forEach(i=> counts[i.id]=(counts[i.id]||0)+i.qty))
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id, qty])=> {
      const p = products.find(pr=>pr.id===id)
      return { name: p?.name || id, qty, price: p?.price || 0 }
    })
  })()
  const lowStock = products.filter(p=> p.stock>0 && p.stock<5)

  return (
    <div>
      <h2 style={{fontSize:20}}>Business Analytics</h2>
      <p style={{fontSize:12, color:'var(--text-muted)'}}>Sales, payments, deliveries & product performance</p>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
        <div style={{background:'var(--charcoal)', color:'white', borderRadius:16, padding:16}}>
          <div style={{fontSize:11, letterSpacing:'0.06em', fontWeight:800, color:'var(--champagne)'}}>TOTAL SALES</div>
          <div style={{fontSize:26, fontWeight:800, marginTop:6}}>{formatPrice(totalSales)}</div>
          <div style={{fontSize:11, color:'#a8a8b8'}}>{orders.length} orders all-time</div>
        </div>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em', color:'var(--text-muted)'}}>OUTSTANDING PAYMENTS</div>
          <div style={{fontSize:26, fontWeight:800, color:'#92400e'}}>{formatPrice(unpaid)}</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>{orders.filter(o=>o.payment_status==='Unpaid').length} unpaid orders</div>
        </div>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em', color:'var(--text-muted)'}}>PENDING DELIVERIES</div>
          <div style={{fontSize:26, fontWeight:800}}>{orders.filter(o=>['Ready for Delivery','Out for Delivery','Processing','Confirmed'].includes(o.order_status)).length}</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>Need dispatch today</div>
        </div>
        <div style={{background:'var(--champagne)', borderRadius:16, padding:16, color:'var(--charcoal)'}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>COMPLETED</div>
          <div style={{fontSize:26, fontWeight:800}}>{orders.filter(o=>o.order_status==='Delivered').length}</div>
          <div style={{fontSize:11, opacity:0.8}}>Delivered & paid</div>
        </div>
      </div>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontWeight:800}}>Orders by Status</div>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
            {Object.entries(byStatus).length===0 ? <div style={{color:'var(--text-muted)', fontSize:12}}>No orders yet</div> : Object.entries(byStatus).map(([status, count])=>(
              <div key={status} style={{display:'flex', alignItems:'center', gap:12}}>
                <span style={{flex:1, fontSize:12, fontWeight:600}}>{status}</span>
                <div style={{flex:1, height:8, background:'var(--light)', borderRadius:999, overflow:'hidden'}}><div style={{width:`${Math.round(count/orders.length*100)}%`, height:'100%', background:'var(--champagne)'}}></div></div>
                <span style={{fontWeight:800, fontSize:12}}>{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontWeight:800}}>Bestselling Products</div>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
            {bestsellers.length===0 ? <div style={{color:'var(--text-muted)', fontSize:12}}>No sales yet — bestsellers will appear here</div> : bestsellers.map(b=>(
              <div key={b.name} style={{display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--light)', borderRadius:10}}>
                <span style={{fontSize:12, fontWeight:600}}>{b.name.slice(0,40)}</span><span style={{fontWeight:800, fontSize:12}}>{b.qty} sold</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:12, fontSize:11, color:'var(--text-muted)'}}>Based on actual order history • Updates live</div>
        </div>
      </div>

      <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
        <div style={{fontWeight:800}}>Low-Stock Products</div>
        <p style={{fontSize:11, color:'var(--text-muted)'}}>Products with &lt;5 units — restock quickly to avoid lost sales</p>
        {lowStock.length===0 ? <div style={{marginTop:12, padding:16, background:'var(--light)', borderRadius:12, textAlign:'center', color:'var(--text-muted)', fontSize:12}}>All products well-stocked</div> : (
          <div style={{marginTop:12, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
            {lowStock.map(p=>(
              <div key={p.id} style={{padding:12, border:'1px solid #fde68a', background:'#fef3c7', borderRadius:12}}>
                <div style={{fontWeight:800, fontSize:12}}>{p.name}</div>
                <div style={{fontSize:11, color:'#92400e'}}>{p.stock} left • {formatPrice(p.price)} • {p.category}</div>
                <div style={{fontSize:10, color:'#92400e', marginTop:4}}>ID: {p.id} • Restock threshold: 5</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@media(max-width:900px){ div[style*="repeat(4,1fr)"], div[style*="1fr 1fr"], div[style*="repeat(3,1fr)"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
