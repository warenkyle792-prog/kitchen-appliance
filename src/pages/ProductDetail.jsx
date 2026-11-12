import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, ShoppingBag, Heart, Share2, ShieldCheck, Truck, RotateCcw, Headphones, Plus, Minus, Check, ChevronRight } from 'lucide-react'
import { products } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import { formatPrice } from '../lib/utils.js'
import { useCart } from '../context/CartContext.jsx'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p=>p.id===id)
  const { add } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)

  if (!product) return <div className="container" style={{padding:'80px 0', textAlign:'center'}}><h2>Product not found</h2><Link to="/catalog" className="btn-primary" style={{marginTop:16}}>Back to Catalog</Link></div>

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice)*100) : 0
  const related = products.filter(p=>p.category===product.category && p.id!==product.id).slice(0,4)

  const handleAdd = () => {
    add(product, qty)
    setAdded(true)
    setTimeout(()=>setAdded(false), 1500)
  }
  const buyNow = () => { add(product, qty); navigate('/cart') }

  return (
    <div>
      <div className="container" style={{padding:'16px 24px', display:'flex', gap:8, alignItems:'center', fontSize:12, color:'var(--text-muted)', flexWrap:'wrap'}}>
        <Link to="/">Home</Link> <ChevronRight size={12}/> <Link to="/catalog">Catalog</Link> <ChevronRight size={12}/> <Link to={`/catalog/${product.category}`}>{product.category}</Link> <ChevronRight size={12}/> <span style={{color:'var(--text)', fontWeight:700}}>{product.name.slice(0,40)}...</span>
      </div>

      <div className="container" style={{display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:32, padding:'0 24px 32px'}}>
        <div>
          <div style={{background:'var(--white)', borderRadius:24, border:'1px solid var(--border)', overflow:'hidden', padding:24, position:'relative'}}>
            {discount>0 && <span className="badge badge-sale" style={{position:'absolute', left:16, top:16, zIndex:2}}>-{discount}%</span>}
            {product.bestseller && <span className="badge badge-gold" style={{position:'absolute', left:16, top: discount>0 ? 44 : 16, zIndex:2}}>Bestseller</span>}
            <img src={product.images[imgIdx]} alt={product.name} style={{width:'100%', height:400, objectFit:'contain'}}/>
            <div style={{marginTop:16, display:'flex', gap:8}}>
              {product.images.map((img,i)=>(
                <button key={i} onClick={()=>setImgIdx(i)} style={{width:64, height:64, borderRadius:12, overflow:'hidden', border: i===imgIdx ? '2px solid var(--champagne)' : '1px solid var(--border)', padding:4, background:'var(--light)'}}>
                  <img src={img} alt="" style={{width:'100%', height:'100%', objectFit:'contain'}}/>
                </button>
              ))}
            </div>
          </div>
          <div style={{marginTop:16, background:'var(--charcoal)', borderRadius:16, padding:14, color:'white', display:'flex', gap:12, alignItems:'center'}}>
            <div style={{width:40, height:40, borderRadius:'50%', background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--charcoal)'}}><Truck size={16}/></div>
            <div><div style={{fontWeight:800, fontSize:13}}>Pay after delivery</div><div style={{fontSize:11, color:'#a8a8b8'}}>Place your order today and pay when your appliances arrive.</div></div>
            <div style={{marginLeft:'auto', background:'rgba(255,255,255,0.1)', padding:'6px 12px', borderRadius:999, fontSize:11, fontWeight:800}}>Cash on Delivery</div>
          </div>
        </div>

        <div>
          <div style={{fontSize:11, letterSpacing:'0.14em', fontWeight:800, color:'var(--champagne-dark)', textTransform:'uppercase'}}>{product.category} • {product.subcategory} • {product.brand}</div>
          <h1 style={{fontSize:28, marginTop:8, lineHeight:1.2}}>{product.name}</h1>
          <div style={{display:'flex', alignItems:'center', gap:10, marginTop:12}}>
            <span style={{display:'flex', alignItems:'center', gap:6, background:'var(--light)', padding:'6px 12px', borderRadius:999, fontWeight:800, fontSize:13}}><Star size={14} style={{fill:'var(--champagne)', color:'var(--champagne)'}}/> {product.rating} • {product.reviews} reviews</span>
            <span style={{fontSize:12, color: product.stock>0 ? 'var(--success)' : 'var(--danger)', fontWeight:800}}>{product.availability} {product.stock>0 && `• ${product.stock} in stock`}</span>
          </div>
          <div style={{marginTop:16, display:'flex', alignItems:'baseline', gap:12}}>
            <div style={{fontSize:28, fontWeight:800}}>{formatPrice(product.price)}</div>
            {product.originalPrice && <div style={{fontSize:14, color:'var(--text-muted)', textDecoration:'line-through'}}>{formatPrice(product.originalPrice)}</div>}
            {discount>0 && <span style={{background:'#fef08a', color:'#854d0e', padding:'6px 10px', borderRadius:999, fontWeight:800, fontSize:11}}>Save {formatPrice(product.originalPrice - product.price)}</span>}
          </div>
          <p style={{marginTop:12, color:'var(--text-muted)', lineHeight:1.7, fontSize:13}}>{product.description}</p>

          <div style={{marginTop:16, background:'var(--light)', borderRadius:16, padding:16, border:'1px solid var(--border)'}}>
            <div style={{fontWeight:800, fontSize:12, letterSpacing:'0.08em'}}>SPECIFICATIONS</div>
            <div style={{marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              {Object.entries(product.specs).map(([k,v])=>(
                <div key={k} style={{display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--white)', borderRadius:10, fontSize:12}}>
                  <span style={{color:'var(--text-muted)'}}>{k}</span><span style={{fontWeight:700}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:10, fontSize:11, color:'var(--text-muted)'}}>Model: {product.model} • ID: {product.id} • {product.warranty}</div>
          </div>

          <div style={{marginTop:16, display:'flex', gap:12, alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:8, background:'var(--white)', border:'1px solid var(--border)', borderRadius:999, padding:6}}>
              <button onClick={()=>setQty(Math.max(1, qty-1))} style={{width:36, height:36, borderRadius:'50%', border:'none', background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center'}}><Minus size={14}/></button>
              <span style={{width:36, textAlign:'center', fontWeight:800}}>{qty}</span>
              <button onClick={()=>setQty(Math.min(product.stock, qty+1))} style={{width:36, height:36, borderRadius:'50%', border:'none', background:'var(--charcoal)', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><Plus size={14}/></button>
            </div>
            <span style={{fontSize:11, color:'var(--text-muted)'}}>{product.stock} available • Max {product.stock} per order</span>
          </div>

          <div style={{marginTop:16, display:'flex', gap:12}}>
            <button onClick={handleAdd} disabled={product.stock===0} style={{flex:1, padding:'16px', borderRadius:999, background: product.stock===0 ? '#e5e7eb' : added ? '#0e9f6e' : 'var(--charcoal)', color:'white', fontWeight:800, border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
              {added ? <Check size={16}/> : <ShoppingBag size={16}/>} {product.stock===0 ? 'Out of Stock' : added ? 'Added to Bag!' : 'Add to Bag'}
            </button>
            <button onClick={buyNow} disabled={product.stock===0} className="btn-primary" style={{flex:1, justifyContent:'center', opacity: product.stock===0 ? 0.5 : 1}}>Buy Now →</button>
          </div>
          <div style={{marginTop:8, display:'flex', gap:8}}>
            <button style={{flex:1, padding:'12px', borderRadius:999, border:'1px solid var(--border)', background:'var(--white)', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6}}><Heart size={14}/> Wishlist</button>
            <button style={{flex:1, padding:'12px', borderRadius:999, border:'1px solid var(--border)', background:'var(--white)', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6}}><Share2 size={14}/> Share</button>
          </div>

          <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8}}>
            {[
              {i:<ShieldCheck size={16}/>, t:'Genuine Warranty'},
              {i:<Truck size={16}/>, t:'Own Delivery'},
              {i:<RotateCcw size={16}/>, t:'7-Day Returns'},
            ].map(b=>(
              <div key={b.t} style={{textAlign:'center', padding:12, background:'var(--white)', border:'1px solid var(--border)', borderRadius:12}}>
                <div style={{width:32, height:32, borderRadius:'50%', background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto'}}>{b.i}</div>
                <div style={{fontSize:11, fontWeight:700, marginTop:6}}>{b.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'32px 24px'}}>
        <h2 style={{fontSize:24}}>Complete the room</h2>
        <p style={{color:'var(--text-muted)', fontSize:13}}>Customers who viewed this also bought</p>
        <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
          {related.map(p=> <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
      <style>{`@media(max-width:900px){ .container{grid-template-columns:1fr !important} div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr) !important} } @media(max-width:640px){ div[style*="repeat(4,1fr)"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
