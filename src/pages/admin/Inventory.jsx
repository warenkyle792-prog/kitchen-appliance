import { useState, useEffect } from 'react'
import { AlertTriangle, Plus, Minus, History, TrendingDown } from 'lucide-react'
import { formatPrice } from '../../lib/utils.js'

const STORAGE_KEY = 'velcor-products'
const MOVEMENTS_KEY = 'velcor-stock-movements'

export default function AdminInventory() {
  const [products, setProducts] = useState(()=> {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
    return []
  })
  const [movements, setMovements] = useState(()=> JSON.parse(localStorage.getItem(MOVEMENTS_KEY) || '[]'))
  const [adjust, setAdjust] = useState({})

  useEffect(()=>{ localStorage.setItem(STORAGE_KEY, JSON.stringify(products)) }, [products])
  useEffect(()=>{ localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements)) }, [movements])

  const updateStock = (id, delta, reason) => {
    setProducts(prev=> prev.map(p=> {
      if (p.id!==id) return p
      const newStock = Math.max(0, p.stock + delta)
      return { ...p, stock: newStock, availability: newStock===0 ? 'Out of Stock' : newStock <5 ? 'Low Stock' : 'In Stock' }
    }))
    const entry = { id: Date.now(), product: id, delta, reason, date: new Date().toISOString() }
    setMovements(prev=> [entry, ...prev].slice(0,50))
    setAdjust(prev=> ({...prev, [id]: ''}))
  }

  const low = products.filter(p=> p.stock>0 && p.stock <5)
  const out = products.filter(p=> p.stock===0)

  return (
    <div>
      <h2 style={{fontSize:20}}>Inventory Management</h2>
      <p style={{fontSize:12, color:'var(--text-muted)'}}>View stock, adjust quantities, track movements, low-stock alerts</p>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em', color:'var(--text-muted)'}}>TOTAL PRODUCTS</div>
          <div style={{fontSize:28, fontWeight:800}}>{products.length}</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>{products.reduce((s,p)=>s+p.stock,0)} units in stock</div>
        </div>
        <div style={{background:'#fef3c7', border:'1px solid #fde68a', borderRadius:16, padding:16}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em', color:'#92400e', display:'flex', gap:6, alignItems:'center'}}><AlertTriangle size={14}/> LOW STOCK</div>
          <div style={{fontSize:28, fontWeight:800, color:'#92400e'}}>{low.length}</div>
          <div style={{fontSize:11, color:'#92400e'}}>{low.map(p=>p.name.slice(0,18)).join(', ') || 'All good'}</div>
        </div>
        <div style={{background:'#fee2e2', border:'1px solid #fecaca', borderRadius:16, padding:16}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em', color:'#991b1b', display:'flex', gap:6, alignItems:'center'}}><TrendingDown size={14}/> OUT OF STOCK</div>
          <div style={{fontSize:28, fontWeight:800, color:'#991b1b'}}>{out.length}</div>
          <div style={{fontSize:11, color:'#991b1b'}}>{out.map(p=>p.name.slice(0,20)).join(', ') || 'None'}</div>
        </div>
      </div>

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1.4fr 0.8fr', gap:12}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontWeight:800}}>Stock Levels</div>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8, maxHeight:520, overflowY:'auto'}}>
            {products.map(p=>(
              <div key={p.id} style={{display:'flex', alignItems:'center', gap:12, padding:12, border:'1px solid var(--border)', borderRadius:12, background: p.stock===0 ? '#fef2f2' : p.stock<5 ? '#fef3c7' : 'var(--light)'}}>
                <img src={p.images[0]} alt={p.name} style={{width:48, height:48, borderRadius:8, objectFit:'cover', background:'white'}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700, fontSize:12}}>{p.name}</div>
                  <div style={{fontSize:10, color:'var(--text-muted)'}}>{p.id} • {p.category} • {formatPrice(p.price)}</div>
                  <div style={{fontSize:11, fontWeight:800, color: p.stock===0 ? '#991b1b' : p.stock<5 ? '#92400e' : 'var(--success)'}}>{p.stock} units • {p.availability}</div>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:6, alignItems:'center'}}>
                  <div style={{display:'flex', gap:4}}>
                    <input value={adjust[p.id] || ''} onChange={e=>setAdjust({...adjust, [p.id]: e.target.value})} placeholder="±" type="number" style={{width:60, padding:'6px 8px', borderRadius:8, border:'1px solid var(--border)', fontSize:12}}/>
                    <button onClick={()=>{ const d=parseInt(adjust[p.id]||'0'); if(!d) return; updateStock(p.id, d, `Manual adjustment ${d>0?'+':''}${d}`)}} style={{padding:'6px 10px', borderRadius:8, background:'var(--charcoal)', color:'white', border:'none', fontWeight:700, fontSize:11}}>Apply</button>
                  </div>
                  <div style={{display:'flex', gap:4}}>
                    <button onClick={()=>updateStock(p.id, 5, 'Restock +5')} style={{padding:'4px 8px', borderRadius:999, background:'#dcfce7', border:'1px solid #86efac', fontSize:10, fontWeight:700}}><Plus size={10}/> 5</button>
                    <button onClick={()=>updateStock(p.id, -1, 'Correction -1')} style={{padding:'4px 8px', borderRadius:999, background:'#fee2e2', border:'1px solid #fecaca', fontSize:10, fontWeight:700}}><Minus size={10}/> 1</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <div style={{fontWeight:800, display:'flex', alignItems:'center', gap:8}}><History size={14}/> Stock Movements</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>Last 50 adjustments • Deduct on confirm, restore on cancel</div>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8, maxHeight:480, overflowY:'auto'}}>
            {movements.length===0 ? <div style={{padding:20, textAlign:'center', color:'var(--text-muted)', fontSize:12}}>No movements yet. Confirming orders deducts stock; cancelling restores.</div> : movements.map(m=>(
              <div key={m.id} style={{padding:10, background:'var(--light)', borderRadius:10, border:'1px solid var(--border)'}}>
                <div style={{fontWeight:700, fontSize:11}}>{m.product || m.order} • <span style={{color: m.delta>0 || m.type==='restore' ? '#0e9f6e' : '#991b1b'}}>{m.delta ? (m.delta>0?'+':'' )+m.delta : m.type}</span></div>
                <div style={{fontSize:10, color:'var(--text-muted)'}}>{new Date(m.date).toLocaleString('en-KE')} • {m.reason || m.note}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>{ if(confirm('Clear movement history?')) { setMovements([]); localStorage.removeItem(MOVEMENTS_KEY) }}} style={{marginTop:12, width:'100%', padding:'10px', borderRadius:999, border:'1px solid var(--border)', background:'var(--light)', fontWeight:700, fontSize:11}}>Clear History</button>
        </div>
      </div>
      <style>{`@media(max-width:900px){ div[style*="repeat(3,1fr)"], div[style*="1.4fr 0.8fr"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
