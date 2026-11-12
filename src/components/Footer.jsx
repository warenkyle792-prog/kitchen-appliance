import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{background:'var(--charcoal)', color:'#e8e6e1', marginTop:40}}>
      <div className="container" style={{padding:'48px 24px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1.2fr', gap:32}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
              <div style={{width:44, height:44, borderRadius:12, background:'linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--charcoal)', fontFamily:'Cormorant Garamond', fontWeight:800, fontSize:20}}>V</div>
              <div>
                <div style={{fontFamily:'Cormorant Garamond', fontWeight:700, fontSize:18, letterSpacing:'-0.02em'}}>VELCOR APPLIANCES</div>
                <div style={{fontSize:10, letterSpacing:'0.18em', fontWeight:800, color:'var(--champagne)'}}>QUALITY FOR EVERY HOME</div>
              </div>
            </div>
            <p style={{color:'#a8a8b8', fontSize:13, lineHeight:1.7}}>Premium home appliances for every room. Sitting room to laundry. We curate trusted brands, handle stock and deliver to your doorstep — pay after delivery.</p>
            <div style={{marginTop:16, display:'flex', gap:8}}>
              <a href="#" style={{width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center'}}><Instagram size={16}/></a>
              <a href="#" style={{width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center'}}><Facebook size={16}/></a>
              <a href="#" style={{width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center'}}><Twitter size={16}/></a>
            </div>
          </div>
          <div>
            <div style={{fontWeight:800, marginBottom:12, letterSpacing:'0.06em', fontSize:12, color:'var(--champagne)'}}>SHOP BY ROOM</div>
            <div style={{display:'flex', flexDirection:'column', gap:8, fontSize:13, color:'#c8c8d8'}}>
              <Link to="/catalog/sitting-room">Sitting Room</Link>
              <Link to="/catalog/kitchen">Kitchen</Link>
              <Link to="/catalog/bedroom">Bedroom</Link>
              <Link to="/catalog/dining-room">Dining Room</Link>
              <Link to="/catalog/laundry-cleaning">Laundry & Cleaning</Link>
            </div>
          </div>
          <div>
            <div style={{fontWeight:800, marginBottom:12, letterSpacing:'0.06em', fontSize:12, color:'var(--champagne)'}}>CUSTOMER CARE</div>
            <div style={{display:'flex', flexDirection:'column', gap:8, fontSize:13, color:'#c8c8d8'}}>
              <Link to="/track">Track Order</Link>
              <Link to="/catalog">Order Help</Link>
              <Link to="/track">Delivery Info</Link>
              <span>Warranty & Returns</span>
              <span>Pay After Delivery</span>
            </div>
          </div>
          <div>
            <div style={{fontWeight:800, marginBottom:12, letterSpacing:'0.06em', fontSize:12, color:'var(--champagne)'}}>CONTACT VELCOR</div>
            <div style={{display:'flex', flexDirection:'column', gap:10, fontSize:13, color:'#c8c8d8'}}>
              <span style={{display:'flex', gap:8, alignItems:'center'}}><MapPin size={14} style={{color:'var(--champagne)'}}/> Nairobi, Kenya • Westlands • Industrial Area Warehouse</span>
              <span style={{display:'flex', gap:8, alignItems:'center'}}><Phone size={14} style={{color:'var(--champagne)'}}/> 0700 123 456 • 0722 987 654</span>
              <span style={{display:'flex', gap:8, alignItems:'center'}}><Mail size={14} style={{color:'var(--champagne)'}}/> hello@velcor.co.ke</span>
              <div style={{marginTop:8, padding:'10px 14px', background:'rgba(201,168,106,0.12)', borderRadius:12, border:'1px solid rgba(201,168,106,0.2)', fontSize:11, fontWeight:700, letterSpacing:'0.04em'}}>Mon–Sat 8AM–7PM • Sun 10AM–5PM • Pay after delivery</div>
            </div>
          </div>
        </div>
        <div style={{marginTop:36, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, fontSize:11, color:'#8a8aa0'}}>
          <span>© 2026 Velcor Appliances Ltd. All rights reserved. • Privacy • Terms • Delivery Policy</span>
          <span>Made with care in Nairobi • <span style={{color:'var(--champagne)'}}>Quality for Every Home.</span></span>
        </div>
      </div>
      <style>{`@media(max-width:900px){ footer .container > div:first-child{grid-template-columns:1fr !important} }`}</style>
    </footer>
  )
}
