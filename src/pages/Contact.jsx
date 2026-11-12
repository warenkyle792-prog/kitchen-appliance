import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ShieldCheck } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', message:'' })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) { alert('Name, phone and message required'); return }
    const inquiries = JSON.parse(localStorage.getItem('velcor-inquiries') || '[]')
    inquiries.push({ ...form, date: new Date().toISOString(), id: Date.now() })
    localStorage.setItem('velcor-inquiries', JSON.stringify(inquiries))
    setSent(true)
    setForm({ name:'', phone:'', email:'', message:'' })
    setTimeout(()=>setSent(false), 4000)
  }

  return (
    <div>
      <div style={{background:'var(--charcoal)', color:'white', padding:'48px 0 32px'}}>
        <div className="container" style={{textAlign:'center'}}>
          <div style={{display:'inline-flex', background:'rgba(201,168,106,0.12)', border:'1px solid rgba(201,168,106,0.2)', color:'var(--champagne)', padding:'8px 14px', borderRadius:999, fontSize:11, fontWeight:800, letterSpacing:'0.12em'}}>WE'RE HERE TO HELP</div>
          <h1 style={{fontSize:36, marginTop:12, color:'white'}}>Contact Velcor</h1>
          <p style={{color:'#c8c8d8', maxWidth:600, margin:'12px auto 0', lineHeight:1.6}}>Own stock, own delivery — talk to the team that handles your appliances. Nairobi showroom or send a message.</p>
        </div>
      </div>

      <div className="container" style={{padding:'24px', display:'grid', gridTemplateColumns:'0.9fr 1.1fr', gap:20}}>
        <div>
          <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
            <h3 style={{fontSize:16}}>Visit Us</h3>
            <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:12}}>
              <div style={{display:'flex', gap:12}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><MapPin size={16}/></span>
                <div><div style={{fontWeight:700, fontSize:13}}>Industrial Area Warehouse & Showroom</div><div style={{fontSize:12, color:'var(--text-muted)'}}>Enterprise Road, Nairobi — Mon–Sat 8AM–7PM, Sun 10AM–5PM<br/>Plus Westlands pickup point (Sarit Centre)</div></div>
              </div>
              <div style={{display:'flex', gap:12}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--champagne)', color:'var(--charcoal)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Phone size={16}/></span>
                <div><div style={{fontWeight:700, fontSize:13}}>0700 123 456 • 0722 987 654</div><div style={{fontSize:12, color:'var(--text-muted)'}}>Call for orders, delivery, warranty • WhatsApp same numbers</div></div>
              </div>
              <div style={{display:'flex', gap:12}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Mail size={16}/></span>
                <div><div style={{fontWeight:700, fontSize:13}}>hello@velcor.co.ke</div><div style={{fontSize:12, color:'var(--text-muted)'}}>Support • Orders: orders@velcor.co.ke • Admin: admin@velcor.co.ke</div></div>
              </div>
              <div style={{display:'flex', gap:12}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Clock size={16}/></span>
                <div><div style={{fontWeight:700, fontSize:13}}>Always Pay After Delivery</div><div style={{fontSize:12, color:'var(--text-muted)'}}>Order today, pay when appliances arrive at your home</div></div>
              </div>
            </div>

            <div style={{marginTop:16, background:'var(--charcoal)', color:'white', borderRadius:16, padding:16}}>
              <div style={{display:'flex', gap:10, alignItems:'center'}}>
                <ShieldCheck size={16} style={{color:'var(--champagne)'}}/>
                <div style={{fontWeight:800, fontSize:13}}>Own Delivery Fleet</div>
              </div>
              <div style={{fontSize:11, color:'#a8a8b8', marginTop:6}}>Nairobi same-day (order by 2PM) • Upcountry 24–48H. Riders install & demo before payment.</div>
              <div style={{marginTop:10, display:'flex', gap:8}}>
                <a href="tel:0700123456" style={{flex:1, textAlign:'center', background:'var(--champagne)', color:'var(--charcoal)', padding:'10px', borderRadius:999, fontWeight:800, fontSize:12}}>Call Now</a>
                <a href="https://wa.me/254700123456" target="_blank" rel="noreferrer" style={{flex:1, textAlign:'center', background:'rgba(255,255,255,0.08)', color:'white', border:'1px solid rgba(255,255,255,0.12)', padding:'10px', borderRadius:999, fontWeight:700, fontSize:12}}>WhatsApp</a>
              </div>
            </div>
          </div>

          <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden'}}>
            <div style={{height:200, background:'linear-gradient(135deg, #f5f3ef 0%, #e8d5b5 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48}}>🗺️</div>
            <div style={{padding:16}}>
              <div style={{fontWeight:800}}>Find Us</div>
              <div style={{fontSize:12, color:'var(--text-muted)'}}>Enterprise Road, Industrial Area • Westlands • Deliveries across Kenya</div>
              <a href="https://maps.google.com/?q=Nairobi+Industrial+Area" target="_blank" rel="noreferrer" style={{marginTop:12, display:'block', textAlign:'center', background:'var(--charcoal)', color:'white', padding:'12px', borderRadius:999, fontWeight:800}}>Open in Maps</a>
            </div>
          </div>
        </div>

        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:20}}>
          <h3 style={{fontSize:16, display:'flex', gap:8, alignItems:'center'}}><MessageCircle size={18} style={{color:'var(--champagne-dark)'}}/> Send a Message</h3>
          <p style={{fontSize:12, color:'var(--text-muted)', marginTop:4}}>We reply within 2 hours (8AM–7PM). For order updates, include your order number.</p>
          <form onSubmit={submit} style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>FULL NAME *</span><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Waren Kyle" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>PHONE *</span><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="0700 123 456" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>EMAIL (OPTIONAL)</span><input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="you@email.com" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800, letterSpacing:'0.06em'}}>MESSAGE *</span><textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="How can we help? Include order number if tracking..." rows={5} className="input textarea" style={{marginTop:6, borderRadius:16}}></textarea></label>
            {sent && <div style={{gridColumn:'1 / -1', background:'#dcfce7', border:'1px solid #86efac', color:'#166534', padding:12, borderRadius:12, fontWeight:700, fontSize:12}}>✅ Message sent! Velcor team will reply to {form.phone || 'you'} shortly. Check track order for existing orders.</div>}
            <button type="submit" className="btn-primary" style={{gridColumn:'1 / -1', justifyContent:'center'}}><Send size={16}/> Send Message</button>
            <div style={{gridColumn:'1 / -1', fontSize:10, color:'var(--text-muted)', textAlign:'center'}}>By sending you agree to be contacted about your inquiry. We never share your contact.</div>
          </form>

          <div style={{marginTop:16, background:'var(--light)', border:'1px solid var(--border)', borderRadius:16, padding:14}}>
            <div style={{fontWeight:800, fontSize:12}}>Quick Links</div>
            <div style={{marginTop:8, display:'flex', gap:8, flexWrap:'wrap'}}>
              <a href="/track" style={{padding:'8px 12px', borderRadius:999, background:'var(--white)', border:'1px solid var(--border)', fontWeight:700, fontSize:11}}>Track Order</a>
              <a href="/catalog" style={{padding:'8px 12px', borderRadius:999, background:'var(--white)', border:'1px solid var(--border)', fontWeight:700, fontSize:11}}>Shop All</a>
              <a href="/about" style={{padding:'8px 12px', borderRadius:999, background:'var(--white)', border:'1px solid var(--border)', fontWeight:700, fontSize:11}}>About Velcor</a>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ .container{grid-template-columns:1fr !important} .container > div:first-child > div > div[style*="1fr 1fr"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
