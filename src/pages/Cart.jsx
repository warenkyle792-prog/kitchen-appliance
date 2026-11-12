import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../lib/utils.js'
import { getDeliveryFee } from '../lib/deliveryFees.js'

export default function Cart() {
  const { items, inc, dec, remove, subtotal, clear } = useCart()
  const navigate = useNavigate()

  // default delivery fee preview (Westlands)
  const delivery = items.length ? getDeliveryFee('westlands') : 0
  const total = subtotal + (subtotal >= 20000 ? 0 : delivery)

  if (items.length===0) return (
    <div className="container" style={{padding:'80px 24px', textAlign:'center'}}>
      <div style={{width:80, height:80, borderRadius:'50%', background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto'}}><ShoppingBag size={24} /></div>
      <h2 style={{marginTop:16}}>Your bag is empty</h2>
      <p style={{color:'var(--text-muted)', marginTop:8}}>Add appliances to start your Velcor order. Pay after delivery.</p>
      <Link to="/catalog" className="btn-primary" style={{marginTop:20}}>Browse Collection</Link>
    </div>
  )

  return (
    <div className="container" style={{padding:'24px', display:'grid', gridTemplateColumns:'1.6fr 0.9fr', gap:24}}>
      <div>
        <h1 style={{fontSize:28}}>Shopping Bag</h1>
        <p style={{color:'var(--text-muted)', fontSize:13}}>{items.length} items • Estimated delivery in Nairobi: same-day if ordered by 2PM</p>
        <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:12}}>
          {items.map(item=>(
            <div key={item.id} style={{display:'flex', gap:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16, alignItems:'center'}}>
              <Link to={`/product/${item.id}`} style={{width:80, height:80, background:'var(--light)', borderRadius:12, padding:8, flexShrink:0}}>
                <img src={item.images[0]} alt={item.name} style={{width:'100%', height:'100%', objectFit:'contain'}}/>
              </Link>
              <div style={{flex:1}}>
                <Link to={`/product/${item.id}`} style={{fontWeight:700, fontSize:13, lineHeight:1.3}}>{item.name}</Link>
                <div style={{fontSize:11, color:'var(--text-muted)', marginTop:4}}>{item.brand} • {item.model} • {item.category}</div>
                <div style={{fontSize:12, color: item.stock<=3 ? 'var(--danger)' : 'var(--success)', fontWeight:700, marginTop:4}}>{item.stock} left • {formatPrice(item.price)} each</div>
                <div style={{marginTop:8, display:'flex', alignItems:'center', gap:8}}>
                  <button onClick={()=>dec(item.id)} style={{width:28, height:28, borderRadius:'50%', border:'1px solid var(--border)', background:'var(--white)', display:'flex', alignItems:'center', justifyContent:'center'}}><Minus size={12}/></button>
                  <span style={{width:32, textAlign:'center', fontWeight:800, fontSize:13}}>{item.qty}</span>
                  <button onClick={()=>inc(item.id)} style={{width:28, height:28, borderRadius:'50%', background:'var(--charcoal)', color:'white', border:'none', display:'flex', alignItems:'center', justifyContent:'center'}}><Plus size={12}/></button>
                  <span style={{fontSize:11, color:'var(--text-muted)', marginLeft:8, display:'none'}} className="max-note">Max {item.stock}</span>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:800}}>{formatPrice(item.price * item.qty)}</div>
                {item.qty >= item.stock && <div style={{fontSize:10, color:'var(--danger)', fontWeight:700}}>Max stock reached</div>}
                <button onClick={()=>remove(item.id)} style={{marginTop:8, display:'flex', alignItems:'center', gap:6, color:'var(--danger)', background:'none', border:'none', fontWeight:700, fontSize:11}}><Trash2 size={12}/> Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={clear} style={{marginTop:12, fontSize:12, color:'var(--text-muted)', background:'none', border:'none', fontWeight:700}}>Clear bag</button>
      </div>

      <div style={{position:'sticky', top:88, height:'fit-content'}}>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
          <h3 style={{fontSize:18}}>Order Summary</h3>
          <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8, fontSize:13}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Subtotal</span><span style={{fontWeight:700}}>{formatPrice(subtotal)}</span></div>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Delivery (Westlands)</span><span style={{fontWeight:700, color: subtotal >=20000 ? 'var(--success)' : 'var(--text)'}}>{subtotal >=20000 ? 'FREE' : formatPrice(delivery)}</span></div>
            {subtotal <20000 && <div style={{background:'#fef3c7', border:'1px solid #fde68a', borderRadius:999, padding:'8px 12px', fontSize:11, fontWeight:700, textAlign:'center', color:'#92400e'}}>Add {formatPrice(20000 - subtotal)} more for FREE delivery</div>}
            <div style={{display:'flex', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--border)', fontSize:16, fontWeight:800}}><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <div style={{marginTop:12, background:'var(--charcoal)', color:'white', borderRadius:12, padding:12, display:'flex', gap:10, alignItems:'center'}}>
            <ShieldCheck size={16} style={{color:'var(--champagne)'}}/><div style={{fontSize:11, lineHeight:1.4}}><b>Pay after delivery.</b> Place your order today and pay when your appliances arrive.</div>
          </div>
          <button onClick={()=>navigate('/checkout')} className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:16, padding:'16px'}}>Proceed to Checkout <ArrowRight size={16}/></button>
          <Link to="/catalog" style={{display:'block', textAlign:'center', marginTop:10, fontWeight:700, fontSize:13, color:'var(--text-muted)'}}>Continue Shopping</Link>
          <div style={{marginTop:16, display:'flex', gap:8, justifyContent:'center', fontSize:11, color:'var(--text-muted)'}}><Truck size={12}/> Own delivery • Nairobi same-day • Upcountry 24-48H</div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ .container{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
