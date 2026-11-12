import { useParams, Link, useLocation } from 'react-router-dom'
import { Check, Package, Truck, Phone, Copy } from 'lucide-react'
import { formatPrice } from '../lib/utils.js'
import { useState } from 'react'

export default function OrderSuccess() {
  const { orderNumber } = useParams()
  const { state } = useLocation()
  const order = state?.order || JSON.parse(localStorage.getItem('velcor-orders') || '[]').find(o=>o.order_number===orderNumber)
  const [copied, setCopied] = useState(false)

  if (!order) return <div className="container" style={{padding:'60px 0', textAlign:'center'}}><h2>Order not found</h2><p style={{color:'var(--text-muted)'}}>Order {orderNumber} not located. Check your phone or track below.</p><Link to="/track" className="btn-primary" style={{marginTop:12}}>Track Order</Link></div>

  const copy = () => { navigator.clipboard.writeText(order.order_number); setCopied(true); setTimeout(()=>setCopied(false), 1200) }

  return (
    <div className="container" style={{padding:'24px', maxWidth:720, margin:'0 auto'}}>
      <div style={{textAlign:'center', padding:'24px', background:'var(--white)', border:'1px solid var(--border)', borderRadius:20}}>
        <div style={{width:64, height:64, borderRadius:'50%', background:'#0e9f6e', color:'white', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto'}}><Check size={28}/></div>
        <h1 style={{marginTop:12, fontSize:28}}>Order Confirmed!</h1>
        <p style={{color:'var(--text-muted)', marginTop:8}}>Thank you, {order.customer_name}. Your order has been received by Velcor Appliances.</p>
        <div style={{marginTop:16, display:'inline-flex', alignItems:'center', gap:8, background:'var(--charcoal)', color:'white', padding:'12px 16px', borderRadius:999, fontWeight:800}}>
          Order <span style={{color:'var(--champagne)'}}>{order.order_number}</span>
          <button onClick={copy} style={{marginLeft:8, background:'rgba(255,255,255,0.14)', border:'none', color:'white', padding:'6px 10px', borderRadius:999, display:'flex', alignItems:'center', gap:6}}><Copy size={12}/> {copied ? 'Copied!' : 'Copy'}</button>
        </div>
        <div style={{marginTop:12, fontSize:12, color:'var(--text-muted)'}}>We’ve saved this order. Velcor will call you at {order.customer_phone} to confirm delivery.</div>
      </div>

      <div style={{marginTop:16, background:'var(--champagne-glow)', border:'1px solid rgba(201,168,106,0.3)', borderRadius:16, padding:16, textAlign:'center'}}>
        <div style={{fontWeight:800, color:'var(--charcoal)'}}>Pay after delivery. Place your order today and pay when your appliances arrive.</div>
        <div style={{fontSize:11, color:'var(--text-muted)', marginTop:4}}>Payment Status: <span style={{background:'var(--charcoal)', color:'var(--champagne)', padding:'2px 8px', borderRadius:999, fontWeight:800}}>{order.payment_status}</span> • Payment Method: {order.payment_method}</div>
      </div>

      <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
        <div style={{fontWeight:800}}>What happens next?</div>
        <div style={{marginTop:12, display:'flex', gap:8}}>
          {[
            {s:'Confirmed', d:'Velcor team calls to confirm'},
            {s:'Processing', d:'Warehouse packs your order'},
            {s:'Out for Delivery', d:'Our rider heads to you'},
            {s:'Delivered', d:'You confirm & pay on arrival'},
          ].map((x,i)=>(
            <div key={x.s} style={{flex:1, textAlign:'center', background: i===0 ? 'var(--charcoal)' : 'var(--light)', color: i===0 ? 'white' : 'var(--text)', borderRadius:12, padding:12}}>
              <div style={{fontWeight:800, fontSize:11}}>{i+1}. {x.s}</div>
              <div style={{fontSize:10, color: i===0 ? '#a8a8b8' : 'var(--text-muted)', marginTop:4}}>{x.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
        <div style={{fontWeight:800, display:'flex', alignItems:'center', gap:8}}><Package size={16}/> Order Summary</div>
        <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
          {order.items.map((i, idx)=>(
            <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:13}}>
              <span>{i.name} × {i.qty}</span><span style={{fontWeight:700}}>{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:12, borderTop:'1px solid var(--border)', paddingTop:12, display:'flex', flexDirection:'column', gap:6, fontSize:13}}>
          <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Delivery</span><span>{formatPrice(order.delivery_fee)}</span></div>
          <div style={{display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:15}}><span>Total</span><span>{formatPrice(order.total)}</span></div>
          <div style={{fontSize:11, color:'var(--text-muted)', textAlign:'center'}}>Order date: {new Date(order.created_at).toLocaleString('en-KE')} • Deliver to: {order.estate}, {order.building}</div>
        </div>
      </div>

      <div style={{marginTop:16, display:'flex', gap:12}}>
        <Link to="/track" className="btn-primary" style={{flex:1, justifyContent:'center'}}>Track Order</Link>
        <Link to="/catalog" style={{flex:1, textAlign:'center', padding:'14px', borderRadius:999, border:'1px solid var(--border)', background:'var(--white)', fontWeight:800}}>Continue Shopping</Link>
      </div>

      <div style={{marginTop:16, background:'var(--charcoal)', color:'white', borderRadius:16, padding:16, display:'flex', gap:12, alignItems:'center'}}>
        <Phone size={16} style={{color:'var(--champagne)'}}/><div><div style={{fontWeight:800, fontSize:13}}>Questions about this order?</div><div style={{fontSize:11, color:'#a8a8b8'}}>Call Velcor Support: 0700 123 456 • hello@velcor.co.ke</div></div>
      </div>
    </div>
  )
}
