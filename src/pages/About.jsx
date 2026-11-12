import { Link } from 'react-router-dom'
import { Award, ShieldCheck, Truck, Heart, Sparkles, MapPin, Phone, Mail } from 'lucide-react'

export default function About() {
  return (
    <div>
      <div style={{background:'linear-gradient(180deg, var(--charcoal) 0%, #252529 100%)', color:'white', padding:'56px 0 40px'}}>
        <div className="container" style={{textAlign:'center'}}>
          <div style={{display:'inline-flex', background:'rgba(201,168,106,0.12)', border:'1px solid rgba(201,168,106,0.2)', color:'var(--champagne)', padding:'8px 14px', borderRadius:999, fontSize:11, fontWeight:800, letterSpacing:'0.12em'}}>EST. NAIROBI 2022</div>
          <h1 style={{fontSize:44, marginTop:16, color:'white'}}>We are Velcor.</h1>
          <p style={{color:'var(--champagne)', fontFamily:'Cormorant Garamond', fontSize:22, fontStyle:'italic', marginTop:4}}>Quality for Every Home.</p>
          <p style={{color:'#c8c8d8', maxWidth:640, margin:'16px auto 0', lineHeight:1.7}}>Velcor Appliances is a Kenyan premium retailer with own stock in Industrial Area and own delivery fleet. No marketplaces, no dropshipping — we curate, stock, deliver, and you pay after delivery.</p>
          <div style={{marginTop:20, display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            <Link to="/catalog" style={{background:'var(--champagne)', color:'var(--charcoal)', padding:'14px 24px', borderRadius:999, fontWeight:800}}>Shop Collection</Link>
            <Link to="/contact" style={{background:'rgba(255,255,255,0.08)', color:'white', border:'1px solid rgba(255,255,255,0.14)', padding:'14px 24px', borderRadius:999, fontWeight:700}}>Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="container section" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
        <div>
          <h2 style={{fontSize:28}}>A real shop, not a template.</h2>
          <p style={{color:'var(--text-muted)', marginTop:12, lineHeight:1.7}}>We sell what we own. Every fridge, TV, and washer in our catalogue lives in our warehouse. That means genuine warranty, ready stock, and honest lead times — same-day in Nairobi, 24-48h upcountry.</p>
          <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            {[
              {i:<Award size={16}/>, t:'Own Stock', d:'Industrial Area warehouse, not virtual listings'},
              {i:<Truck size={16}/>, t:'Own Delivery', d:'Riders & vans, not outsourced couriers'},
              {i:<ShieldCheck size={16}/>, t:'Genuine Warranty', d:'Manufacturer + Velcor after-sales'},
              {i:<Heart size={16}/>, t:'Pay After Delivery', d:'Cash on delivery across Kenya'},
            ].map(x=>(
              <div key={x.t} style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
                <div style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center'}}>{x.i}</div>
                <div style={{fontWeight:800, marginTop:8, fontSize:13}}>{x.t}</div>
                <div style={{fontSize:11, color:'var(--text-muted)', marginTop:4}}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden'}}>
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60" alt="Velcor team" style={{width:'100%', height:220, objectFit:'cover'}} />
          <div style={{padding:20}}>
            <h3 style={{fontSize:18}}>Our Promise</h3>
            <p style={{color:'var(--text-muted)', fontSize:13, lineHeight:1.7, marginTop:8}}>No advance payment. No fake discounts. We list real prices in KSh, real stock quantities, and we call you after every order to confirm delivery. Velcor riders install and demo before you pay.</p>
            <div style={{marginTop:16, display:'flex', gap:8, flexWrap:'wrap'}}>
              <span style={{background:'var(--champagne)', color:'var(--charcoal)', padding:'8px 14px', borderRadius:999, fontWeight:800, fontSize:11}}>12,000+ homes</span>
              <span style={{background:'var(--light)', border:'1px solid var(--border)', padding:'8px 14px', borderRadius:999, fontWeight:700, fontSize:11}}>4.9★ average</span>
              <span style={{background:'var(--charcoal)', color:'white', padding:'8px 14px', borderRadius:999, fontWeight:700, fontSize:11}}>Since 2022</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{background:'var(--light)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'32px 0'}}>
        <div className="container" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, textAlign:'center'}}>
          {[
            {k:'12k+', l:'Homes served'},
            {k:'42+', l:'Premium brands'},
            {k:'5', l:'Rooms covered'},
            {k:'24h', l:'Upcountry reach'},
          ].map(s=>(
            <div key={s.l} style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:20}}>
              <div style={{fontSize:28, fontWeight:800, fontFamily:'Cormorant Garamond'}}>{s.k}</div>
              <div style={{fontSize:11, letterSpacing:'0.12em', fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container section">
        <h2 style={{fontSize:24, textAlign:'center'}}>From Sitting Room to Laundry</h2>
        <p style={{textAlign:'center', color:'var(--text-muted)', fontSize:13}}>One shop for every room — curated for Kenyan homes.</p>
        <div style={{marginTop:20, display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12}}>
          {[
            {n:'Sitting Room', i:'🛋️', d:'TVs, Sound, AC, Lamps'},
            {n:'Kitchen', i:'🍳', d:'Fridges, Cookers, Blenders'},
            {n:'Bedroom', i:'🛏️', d:'Lamps, Fans, Blankets'},
            {n:'Dining', i:'🍽️', d:'Dispensers, Warmers'},
            {n:'Laundry', i:'✨', d:'Washers, Vacuums'},
          ].map(r=>(
            <div key={r.n} style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16, textAlign:'center'}}>
              <div style={{fontSize:22}}>{r.i}</div>
              <div style={{fontWeight:800, fontSize:13, marginTop:8}}>{r.n}</div>
              <div style={{fontSize:11, color:'var(--text-muted)'}}>{r.d}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:24, textAlign:'center'}}>
          <Link to="/catalog" style={{background:'var(--charcoal)', color:'white', padding:'14px 24px', borderRadius:999, fontWeight:800}}>Explore by Room</Link>
        </div>
      </div>

      <div style={{background:'var(--charcoal)', color:'white', padding:'32px 0'}}>
        <div className="container" style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:16, alignItems:'center'}}>
          <div style={{display:'flex', gap:16, alignItems:'center'}}>
            <div style={{width:44, height:44, borderRadius:12, background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--charcoal)'}}><Sparkles size={20}/></div>
            <div>
              <div style={{fontWeight:800}}>Visit Velcor</div>
              <div style={{fontSize:13, color:'#a8a8b8', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center'}}><span style={{display:'flex', gap:6, alignItems:'center'}}><MapPin size={12}/> Industrial Area, Nairobi</span><span style={{display:'flex', gap:6, alignItems:'center'}}><Phone size={12}/> 0700 123 456</span><span style={{display:'flex', gap:6, alignItems:'center'}}><Mail size={12}/> hello@velcor.co.ke</span></div>
            </div>
          </div>
          <Link to="/contact" style={{background:'white', color:'var(--charcoal)', padding:'12px 20px', borderRadius:999, fontWeight:800}}>Get Directions</Link>
        </div>
      </div>
      <style>{`@media(max-width:900px){ .container{grid-template-columns:1fr !important} div[style*="repeat(5,1fr)"]{grid-template-columns:repeat(2,1fr) !important} div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr) !important} }`}</style>
    </div>
  )
}
