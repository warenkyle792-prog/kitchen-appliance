import { useState, useEffect } from 'react'
import { formatPrice } from '../../lib/utils.js'
import { Printer, Check, X, Truck, Banknote } from 'lucide-react'
import { orderStatuses, paymentStatuses } from '../../lib/deliveryFees.js'

export default function AdminOrders() {
  const [orders, setOrders] = useState(()=> JSON.parse(localStorage.getItem('velcor-orders') || '[]'))
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(()=>{ localStorage.setItem('velcor-orders', JSON.stringify(orders)) }, [orders])
  // Listen for new orders from checkout in other tab (poll)
  useEffect(()=>{
    const id = setInterval(()=> {
      const saved = JSON.parse(localStorage.getItem('velcor-orders') || '[]')
      if (saved.length !== orders.length) setOrders(saved)
    }, 2000)
    return ()=> clearInterval(id)
  }, [orders.length])

  const updateStatus = (orderNumber, newStatus) => {
    setOrders(prev=> prev.map(o=> {
      if (o.order_number!==orderNumber) return o
      // handle stock: if cancelled, restore stock (simulate); if was cancelled and now confirmed, deduct
      // For demo, show toast and log movement
      let updated = { ...o, order_status: newStatus }
      // stock movement log
      const movements = JSON.parse(localStorage.getItem('velcor-stock-movements') || '[]')
      if (o.order_status !== 'Cancelled' && newStatus === 'Cancelled') {
        // restore stock
        movements.push({ order: orderNumber, type:'restore', date: new Date().toISOString(), note: 'Order cancelled - stock restored' })
        localStorage.setItem('velcor-stock-movements', JSON.stringify(movements))
      } else if (o.order_status === 'New Order' && ['Confirmed','Processing'].includes(newStatus)) {
        movements.push({ order: orderNumber, type:'deduct', date: new Date().toISOString(), note: `Order ${newStatus} - stock deducted` })
        localStorage.setItem('velcor-stock-movements', JSON.stringify(movements))
      }
      return updated
    }))
  }
  const updatePayment = (orderNumber, newPayment) => {
    setOrders(prev=> prev.map(o=> o.order_number===orderNumber ? { ...o, payment_status: newPayment } : o))
  }

  const filtered = filter==='all' ? orders : orders.filter(o=> o.order_status===filter)

  const print = (o) => {
    const w = window.open('', '_blank')
    w.document.write(`<html><head><title>${o.order_number}</title><style>body{font-family:Arial;padding:24px} table{width:100%;border-collapse:collapse} td,th{border:1px solid #ddd;padding:8px;text-align:left} h1{font-size:20px}</style></head><body><h1>Velcor Appliances - Order ${o.order_number}</h1><p>Customer: ${o.customer_name} • ${o.customer_phone} • ${o.customer_email || ''}</p><p>Address: ${o.estate}, ${o.building} ${o.house_number} • ${o.town} • Fee ${o.delivery_fee}</p><p>Status: ${o.order_status} • Payment: ${o.payment_status} (${o.payment_method})</p><table><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>${o.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>${formatPrice(i.price)}</td><td>${formatPrice(i.price*i.qty)}</td></tr>`).join('')}<tr><td colspan="3">Subtotal</td><td>${formatPrice(o.subtotal)}</td></tr><tr><td colspan="3">Delivery</td><td>${formatPrice(o.delivery_fee)}</td></tr><tr><td colspan="3"><b>Total</b></td><td><b>${formatPrice(o.total)}</b></td></tr></table><p>Instructions: ${o.delivery_instructions || 'None'}</p><p>Date: ${new Date(o.created_at).toLocaleString()}</p><p><i>Pay after delivery. Thank you for choosing Velcor — Quality for Every Home.</i></p></body></html>`)
    w.document.close()
    w.print()
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8}}>
        <div><h2 style={{fontSize:20}}>Order Management</h2><p style={{fontSize:12, color:'var(--text-muted)'}}>{orders.length} orders • Confirm, update status, manage payments, print</p></div>
        <div style={{display:'flex', gap:8}}>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="input select" style={{borderRadius:999, height:40, fontSize:12}}>
            <option value="all">All Statuses</option>
            {orderStatuses.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{padding:'10px 14px', borderRadius:999, background:'var(--light)', border:'1px solid var(--border)', fontSize:11, fontWeight:800}}>{filtered.length} shown</span>
        </div>
      </div>

      {filtered.length===0 ? <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:32, textAlign:'center', color:'var(--text-muted)'}}>No orders for this filter. Orders appear here after customer checkout.</div> : (
        <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:12}}>
          {filtered.map(o=>(
            <div key={o.order_number} style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8}}>
                <div><div style={{fontWeight:800}}>{o.order_number} • {o.customer_name} • {o.customer_phone}</div><div style={{fontSize:11, color:'var(--text-muted)'}}>{new Date(o.created_at).toLocaleString('en-KE')} • {o.estate}, {o.building} • {o.town} • {formatPrice(o.total)} • {o.items.length} items</div></div>
                <div style={{display:'flex', gap:6, alignItems:'center'}}>
                  <span style={{padding:'6px 12px', borderRadius:999, background: o.order_status==='Delivered' ? '#dcfce7' : o.order_status==='Cancelled' ? '#fee2e2' : 'var(--champagne)', color: o.order_status==='Cancelled' ? '#991b1b' : 'var(--charcoal)', fontWeight:800, fontSize:11}}>{o.order_status}</span>
                  <span style={{padding:'6px 12px', borderRadius:999, background: o.payment_status==='Paid' ? '#dcfce7' : o.payment_status==='Unpaid' ? '#fef9c3' : '#fee2e2', border:'1px solid var(--border)', fontWeight:800, fontSize:11}}>{o.payment_status}</span>
                </div>
              </div>
              <div style={{marginTop:10, display:'flex', gap:6, flexWrap:'wrap'}}>
                <select value={o.order_status} onChange={e=>updateStatus(o.order_number, e.target.value)} className="input select" style={{borderRadius:999, height:36, fontSize:11, width:'auto', minWidth:160}}>
                  {orderStatuses.map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={o.payment_status} onChange={e=>updatePayment(o.order_number, e.target.value)} className="input select" style={{borderRadius:999, height:36, fontSize:11, width:'auto', minWidth:140}}>
                  {paymentStatuses.map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={()=>print(o)} style={{padding:'8px 14px', borderRadius:999, border:'1px solid var(--border)', background:'var(--white)', fontWeight:700, fontSize:11, display:'flex', alignItems:'center', gap:6}}><Printer size={12}/> Print</button>
                <button onClick={()=>setSelected(selected===o.order_number ? null : o.order_number)} style={{padding:'8px 14px', borderRadius:999, background:'var(--charcoal)', color:'white', fontWeight:700, fontSize:11}}>{selected===o.order_number ? 'Hide' : 'View Details'}</button>
              </div>
              {selected===o.order_number && (
                <div style={{marginTop:12, background:'var(--light)', borderRadius:12, padding:12}}>
                  <div style={{fontWeight:800, fontSize:12}}>Ordered Products</div>
                  <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:6}}>
                    {o.items.map((it,idx)=> <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:12, padding:'6px 8px', background:'var(--white)', borderRadius:8}}><span>{it.name} × {it.qty} • {it.brand}</span><span style={{fontWeight:700}}>{formatPrice(it.price * it.qty)}</span></div>)}
                  </div>
                  <div style={{marginTop:8, fontSize:11, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                    <div>Payment: {o.payment_method}</div><div>Delivery Fee: {formatPrice(o.delivery_fee)}</div>
                    <div>Total: <b>{formatPrice(o.total)}</b></div><div>Instructions: {o.delivery_instructions || 'None'}</div>
                    <div>Order Date: {new Date(o.created_at).toLocaleString()}</div><div>Delivery Personnel: {o.delivery_personnel || 'Not assigned'}</div>
                  </div>
                  <div style={{marginTop:8, display:'flex', gap:6}}>
                    <button onClick={()=>updateStatus(o.order_number, 'Confirmed')} style={{padding:'6px 12px', borderRadius:999, background:'#dcfce7', border:'1px solid #86efac', fontWeight:700, fontSize:11}}><Check size={12}/> Confirm</button>
                    <button onClick={()=>updateStatus(o.order_number, 'Cancelled')} style={{padding:'6px 12px', borderRadius:999, background:'#fee2e2', border:'1px solid #fecaca', fontWeight:700, fontSize:11}}><X size={12}/> Cancel</button>
                    <button onClick={()=>updatePayment(o.order_number, 'Paid')} style={{padding:'6px 12px', borderRadius:999, background:'var(--champagne)', border:'1px solid var(--champagne-dark)', fontWeight:700, fontSize:11}}><Banknote size={12}/> Mark Paid</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
