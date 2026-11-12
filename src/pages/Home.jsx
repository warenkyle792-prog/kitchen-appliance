import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones, Star, Clock, Award, Zap } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { roomCategories } from '../data/categories.js'
import { featuredProducts, bestsellers, newArrivals, products } from '../data/products.js'

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section style={{background:'linear-gradient(180deg, #1a1a1e 0%, #252529 100%)', color:'#fafaf8', overflow:'hidden', position:'relative'}}>
        <div className="container" style={{display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:40, padding:'48px 24px 32px', alignItems:'center', position:'relative', zIndex:1}}>
          <div>
            <div style={{display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,106,0.14)', border:'1px solid rgba(201,168,106,0.25)', color:'var(--champagne)', padding:'8px 14px', borderRadius:999, fontSize:11, fontWeight:800, letterSpacing:'0.14em'}}>NEW COLLECTION 2026 • PREMIUM APPLIANCES</div>
            <h1 style={{fontSize:'54px', lineHeight:0.95, marginTop:16, fontWeight:700}}>Quality for<br/><span style={{color:'var(--champagne)', fontStyle:'italic', fontWeight:400}}>Every Home.</span></h1>
            <p style={{color:'#c8c8d8', fontSize:16, lineHeight:1.7, marginTop:16, maxWidth:520}}>Curated premium appliances for every room — from Hisense fridges to LG air conditioners and Sony home theatres. Velcor delivers and you pay when your appliances arrive.</p>
            <div style={{marginTop:20, display:'flex', gap:12, flexWrap:'wrap'}}>
              <Link to="/catalog" className="btn-primary" style={{fontSize:14}}>Shop Collection <ArrowRight size={16}/></Link>
              <Link to="/catalog/kitchen" style={{padding:'14px 24px', borderRadius:999, border:'1px solid rgba(255,255,255,0.18)', fontWeight:700, color:'white', background:'rgba(255,255,255,0.06)', backdropFilter:'blur(8px)'}}>Explore Kitchen →</Link>
            </div>
            <div style={{marginTop:24, display:'flex', gap:16, alignItems:'center', flexWrap:'wrap'}}>
              <div style={{display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.06)', padding:'10px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)'}}>
                <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f367d8?w=100&auto=format&fit=crop&q=60" style={{width:48, height:48, borderRadius:10, objectFit:'cover'}} alt="" />
                <div><div style={{fontWeight:800, fontSize:13}}>Samsung 65" 4K Smart TV</div><div style={{fontSize:11, color:'#a8a8b8'}}>KSh 89,900 • Bestseller</div></div>
              </div>
              <div style={{fontSize:12, color:'#a8a8b8', display:'flex', alignItems:'center', gap:8}}><span style={{width:8, height:8, borderRadius:'50%', background:'#0e9f6e', display:'inline-block'}}></span> 2,400+ homes trust Velcor • 4.9★ average</div>
            </div>
          </div>
          <div style={{position:'relative'}}>
            <div style={{background:'linear-gradient(180deg, #fafaf8 0%, #f5f3ef 100%)', borderRadius:24, overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,0.35)', border:'1px solid rgba(255,255,255,0.6)'}}>
              <img src="https://images.unsplash.com/photo-1721327074853-9c3529b2d6f1?w=800&auto=format&fit=crop&q=60" alt="Premium living room" style={{width:'100%', height:320, objectFit:'cover'}} />
              <div style={{padding:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                <div style={{background:'var(--charcoal)', color:'white', borderRadius:16, padding:16}}>
                  <div style={{fontSize:11, letterSpacing:'0.12em', fontWeight:800, color:'var(--champagne)'}}>PAY AFTER DELIVERY</div>
                  <div style={{fontWeight:800, marginTop:4}}>Order today,<br/>pay on arrival.</div>
                  <div style={{fontSize:11, color:'#a8a8b8', marginTop:8}}>Cash on delivery across Kenya. No advance payment.</div>
                </div>
                <div style={{background:'linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%)', borderRadius:16, padding:16, color:'var(--charcoal)'}}>
                  <div style={{fontSize:22, fontWeight:800}}>42+</div>
                  <div style={{fontSize:11, fontWeight:700, letterSpacing:'0.06em'}}>PREMIUM BRANDS</div>
                  <div style={{fontSize:11, marginTop:4}}>Samsung • LG • Bosch • Hisense • Dyson</div>
                </div>
              </div>
            </div>
            <div style={{position:'absolute', top:-10, right:-10, background:'white', borderRadius:16, padding:12, boxShadow:'0 12px 32px rgba(0,0,0,0.18)', display:'flex', alignItems:'center', gap:10, color:'#1a1a1e'}}>
              <div style={{width:36, height:36, borderRadius:'50%', background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center'}}><Truck size={16} style={{color:'#0e9f6e'}}/></div>
              <div><div style={{fontWeight:800, fontSize:12}}>Free delivery over KSh 20k</div><div style={{fontSize:11, color:'#6b6b78'}}>Nairobi same-day</div></div>
            </div>
          </div>
        </div>
        <div style={{position:'absolute', top:80, right:'-80px', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,168,106,0.12) 0%, transparent 70%)', pointerEvents:'none'}}></div>
        <style>{`@media(max-width:900px){ .container{grid-template-columns:1fr !important} h1{font-size:38px !important} }`}</style>
      </section>

      {/* TRUST BAR */}
      <div style={{background:'var(--white)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
        <div className="container" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, padding:'16px 24px'}}>
          {[
            {icon:<ShieldCheck size={18} style={{color:'var(--champagne-dark)'}}/>, title:'Genuine Warranty', sub:'Manufacturer + Velcor care'},
            {icon:<Truck size={18} style={{color:'var(--champagne-dark)'}}/>, title:'Own Delivery Fleet', sub:'Nairobi + nationwide'},
            {icon:<RotateCcw size={18}/>, title:'7-Day Returns', sub:'No questions asked'},
            {icon:<Headphones size={18}/>, title:'Expert Support', sub:'0700 123 456'},
          ].map(b=>(
            <div key={b.title} style={{display:'flex', gap:12, alignItems:'center'}}>
              <div style={{width:40, height:40, borderRadius:'50%', background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--border)'}}>{b.icon}</div>
              <div><div style={{fontWeight:800, fontSize:12}}>{b.title}</div><div style={{fontSize:11, color:'var(--text-muted)'}}>{b.sub}</div></div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:768px){ .container{grid-template-columns:1fr 1fr !important} }`}</style>
      </div>

      {/* SHOP BY ROOM */}
      <section className="section" style={{background:'var(--off-white)'}}>
        <div className="container">
          <div style={{display:'flex', alignItems:'end', justifyContent:'space-between', flexWrap:'wrap', gap:16}}>
            <div>
              <div style={{color:'var(--champagne-dark)', fontWeight:800, letterSpacing:'0.16em', fontSize:11}}>SHOP BY ROOM</div>
              <h2 style={{fontSize:36, marginTop:6}}>Every room, perfected.</h2>
              <p style={{color:'var(--text-muted)', marginTop:6}}>Curated appliances for how you actually live — not generic aisles.</p>
            </div>
            <Link to="/catalog" style={{padding:'12px 20px', borderRadius:999, background:'var(--charcoal)', color:'white', fontWeight:700, fontSize:13}}>View All Appliances →</Link>
          </div>
          <div style={{marginTop:24, display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16}}>
            {roomCategories.map(r=>(
              <Link key={r.id} to={`/catalog/${r.slug}`} style={{background:'var(--white)', borderRadius:20, overflow:'hidden', border:'1px solid var(--border)', padding:0}} className="hover-lift">
                <div style={{height:140, overflow:'hidden', position:'relative'}}>
                  <img src={r.image} alt={r.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.45) 100%)'}}></div>
                  <div style={{position:'absolute', bottom:10, left:12, color:'white', fontWeight:800, fontSize:12, display:'flex', alignItems:'center', gap:6}}><span style={{fontSize:16}}>{r.icon}</span> {r.count} products</div>
                </div>
                <div style={{padding:16}}>
                  <div style={{fontWeight:800, fontFamily:'Cormorant Garamond', fontSize:16}}>{r.name}</div>
                  <div style={{fontSize:11, color:'var(--text-muted)', marginTop:4}}>{r.subcategories.slice(0,3).join(' • ')}</div>
                </div>
              </Link>
            ))}
          </div>
          <style>{`@media(max-width:1100px){ .container > div:nth-child(2){grid-template-columns:repeat(3,1fr) !important} } @media(max-width:640px){ .container > div:nth-child(2){grid-template-columns:repeat(2,1fr) !important} }`}</style>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section">
        <div className="container">
          <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
            <h2 style={{fontSize:28}}>Featured</h2>
            <span className="badge badge-gold">Editor’s Picks</span>
            <Link to="/catalog?filter=featured" style={{marginLeft:'auto', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', gap:6}}>View all <ArrowRight size={14}/></Link>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20}}>
            {featuredProducts.slice(0,4).map(p=> <ProductCard key={p.id} product={p} />)}
          </div>
          <style>{`@media(max-width:1100px){ div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr) !important} } @media(max-width:640px){ div[style*="repeat(4,1fr)"]{grid-template-columns:1fr !important} }`}</style>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="section" style={{background:'var(--light)'}}>
        <div className="container">
          <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
            <h2 style={{fontSize:28}}>Bestselling Appliances</h2>
            <span style={{background:'var(--charcoal)', color:'white', padding:'6px 12px', borderRadius:999, fontSize:11, fontWeight:800, letterSpacing:'0.08em'}}>MOST LOVED</span>
          </div>
          <p style={{color:'var(--text-muted)', marginBottom:16}}>What Kenyan homes are choosing this month — proven quality, same-day delivery in Nairobi.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20}}>
            {bestsellers.slice(0,8).map(p=> <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS + SPECIAL OFFERS */}
      <section className="section">
        <div className="container" style={{display:'grid', gridTemplateColumns:'1.6fr 0.9fr', gap:20}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
              <h2 style={{fontSize:28}}>New Arrivals</h2>
              <span className="badge" style={{background:'#f5f3ef', border:'1px solid var(--border)'}}>Fresh in</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
              {newArrivals.slice(0,6).map(p=> <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            <div style={{background:'linear-gradient(135deg, var(--champagne) 0%, #e8c992 100%)', borderRadius:24, padding:24, color:'var(--charcoal)'}}>
              <div style={{fontSize:11, letterSpacing:'0.14em', fontWeight:800}}>SPECIAL OFFER</div>
              <h3 style={{fontSize:26, marginTop:8, lineHeight:1.1}}>Save up to 22%<br/>on Sitting Room</h3>
              <p style={{fontSize:13, marginTop:8, color:'rgba(26,26,30,0.7)'}}>Samsung TVs & JBL speakers. Limited stock — pay after delivery.</p>
              <Link to="/catalog/sitting-room" style={{marginTop:16, display:'inline-flex', background:'var(--charcoal)', color:'white', padding:'12px 20px', borderRadius:999, fontWeight:800, fontSize:13}}>Shop Offer <ArrowRight size={14} style={{marginLeft:6}}/></Link>
              <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f367d8?w=600&auto=format&fit=crop&q=60" alt="" style={{marginTop:16, borderRadius:16, height:140, width:'100%', objectFit:'cover'}} />
            </div>
            <div style={{background:'var(--charcoal)', borderRadius:24, padding:20, color:'white', display:'flex', gap:16, alignItems:'center'}}>
              <div style={{width:48, height:48, borderRadius:12, background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--charcoal)'}}><Award size={20}/></div>
              <div><div style={{fontWeight:800}}>Why Choose Velcor?</div><div style={{fontSize:12, color:'#a8a8b8'}}>Own stock • Own delivery • No advance payment • 12,000+ homes served</div></div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){ .container{grid-template-columns:1fr !important} .container > div > div[style*="repeat(3,1fr)"]{grid-template-columns:repeat(2,1fr) !important} }`}</style>
      </section>

      {/* WHY CHOOSE + DELIVERY */}
      <section className="section" style={{background:'var(--white)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
        <div className="container" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:32}}>
          <div>
            <h2 style={{fontSize:30}}>Delivery, on your terms.</h2>
            <p style={{color:'var(--text-muted)', marginTop:8}}>Velcor runs its own delivery — no third parties for Nairobi orders. Real-time updates from our warehouse to your doorstep.</p>
            <div style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              {[
                {t:'Nairobi Same-Day', d:'Order by 2PM, delivered today in CBD, Westlands, Parklands etc.'},
                {t:'Upcountry 24–48H', d:'Mombasa, Kisumu, Nakuru via trusted partners.'},
                {t:'Install & Demo', d:'We unbox and demonstrate your appliance.'},
                {t:'Pay After Delivery', d:'Cash on delivery. Confirm, then pay.'},
              ].map(x=>(
                <div key={x.t} style={{background:'var(--light)', borderRadius:16, padding:16, border:'1px solid var(--border)'}}>
                  <div style={{fontWeight:800, fontSize:13}}>{x.t}</div>
                  <div style={{fontSize:11, color:'var(--text-muted)', marginTop:4}}>{x.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:'var(--charcoal)', borderRadius:24, padding:24, color:'white'}}>
            <h3 style={{fontSize:20, color:'white'}}>Why thousands choose Velcor</h3>
            <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:12}}>
              {[
                {i:<Star size={16}/>, t:'Curated, not cluttered', d:'Every product vetted for Kenyan homes — no cheap clones.'},
                {i:<ShieldCheck size={16}/>, t:'Genuine warranty', d:'Manufacturer warranty + Velcor after-sales support.'},
                {i:<Zap size={16}/>, t:'Real stock, real shop', d:'We own our inventory in Industrial Area — ready to ship.'},
                {i:<Clock size={16}/>, t:'Own delivery, not outsourced', d:'Our riders & vans handle Nairobi. Trackable, accountable.'},
              ].map(x=>(
                <div key={x.t} style={{display:'flex', gap:12}}>
                  <div style={{width:36, height:36, borderRadius:'50%', background:'rgba(201,168,106,0.14)', color:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>{x.i}</div>
                  <div><div style={{fontWeight:700, fontSize:13}}>{x.t}</div><div style={{fontSize:11, color:'#a8a8b8'}}>{x.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){ .container{grid-template-columns:1fr !important} }`}</style>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{background:'var(--light)'}}>
        <div className="container">
          <h2 style={{fontSize:28, textAlign:'center'}}>Trusted by Kenyan homes</h2>
          <p style={{textAlign:'center', color:'var(--text-muted)', marginTop:6}}>Pay after delivery made us their favourite appliance store.</p>
          <div style={{marginTop:20, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
            {[
              {n:'Wanjiku M.', l:'Kilimani, Nairobi', t:'Ordered the Hisense fridge in the morning, delivered by 3PM. Rider installed and showed me the no-frost feature. Paid cash after — zero stress.', s:5},
              {n:'Brian O.', l:'Westlands', t:'My LG AC cools my sitting room in minutes. Velcor team did installation. Genuine LG with 10-year compressor warranty — very professional.', s:5},
              {n:'Aisha K.', l:'Lavington', t:'Air fryer XXL is now my kitchen favourite. I was scared to pay online — Velcor’s pay-after-delivery convinced me. Will order again.', s:5},
            ].map(x=>(
              <div key={x.n} style={{background:'var(--white)', borderRadius:16, padding:20, border:'1px solid var(--border)'}}>
                <div style={{display:'flex', gap:2, color:'var(--champagne)'}}>{Array.from({length:x.s}).map((_,i)=><Star key={i} size={14} style={{fill:'var(--champagne)', color:'var(--champagne)'}}/>)}</div>
                <p style={{fontSize:13, marginTop:12, lineHeight:1.6, color:'var(--text)'}}>"{x.t}"</p>
                <div style={{marginTop:12, fontWeight:800, fontSize:13}}>{x.n} <span style={{fontWeight:400, color:'var(--text-muted)'}}>• {x.l}</span></div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){ .container > div:last-child{grid-template-columns:1fr !important} }`}</style>
      </section>

      {/* NEWSLETTER */}
      <section style={{background:'var(--charcoal)', color:'white', padding:'32px 0'}}>
        <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap'}}>
          <div>
            <h3 style={{fontSize:22, color:'white'}}>Join the Velcor family</h3>
            <p style={{color:'#a8a8b8', fontSize:13, marginTop:6}}>Get new arrivals, sitting-room bundles & pay-after-delivery offers. No spam.</p>
          </div>
          <form onSubmit={e=>{e.preventDefault(); alert('Thank you for subscribing to Velcor! Check your email for a welcome gift.')}} style={{display:'flex', gap:8, background:'white', padding:6, borderRadius:999, minWidth:320}}>
            <input placeholder="Enter your email" type="email" required style={{flex:1, border:'none', outline:'none', padding:'10px 16px', borderRadius:999, fontSize:13, color:'var(--charcoal)'}} />
            <button className="btn-primary" style={{padding:'12px 20px', fontSize:13}}>Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}
