import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react'
import { formatPrice } from '../lib/utils.js'
import { useCart } from '../context/CartContext.jsx'
import { useState } from 'react'

export default function ProductCard({ product, spacious }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    add(product, 1)
    setAdded(true)
    setTimeout(()=>setAdded(false), 1200)
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  return (
    <Link to={`/product/${product.id}`} className="product-card" style={{padding: spacious ? 4 : 0}}>
      <div className="product-image-wrap">
        {product.bestseller && <span className="badge badge-gold" style={{position:'absolute', left:12, top:12, zIndex:2}}>Bestseller</span>}
        {product.featured && !product.bestseller && <span className="badge badge-dark" style={{position:'absolute', left:12, top:12, zIndex:2}}>Featured</span>}
        {discount > 0 && <span className="badge badge-sale" style={{position:'absolute', left:12, top: product.bestseller || product.featured ? 42 : 12, zIndex:2}}>-{discount}%</span>}
        {product.availability === 'Low Stock' && <span className="badge" style={{position:'absolute', right:12, top:12, background:'#fef08a', color:'#854d0e'}}>Low Stock</span>}
        {product.availability === 'Out of Stock' && <span className="badge" style={{position:'absolute', right:12, top:12, background:'#fecaca', color:'#991b1b'}}>Out of stock</span>}
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        <div style={{position:'absolute', bottom:12, right:12, display:'flex', gap:8, opacity:0, transition:'opacity 0.2s'}} className="card-actions">
          <button onClick={handleAdd} disabled={product.stock===0} style={{width:40, height:40, borderRadius:'50%', background: product.stock===0 ? '#e5e7eb' : added ? '#0e9f6e' : 'var(--charcoal)', color:'white', border:'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <ShoppingBag size={16} />
          </button>
          <span style={{width:40, height:40, borderRadius:'50%', background:'white', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center'}}><Eye size={16} /></span>
        </div>
      </div>
      <div style={{padding:'18px 16px 16px', flex:1, display:'flex', flexDirection:'column'}}>
        <div style={{fontSize:10, letterSpacing:'0.12em', fontWeight:800, color:'var(--champagne-dark)', textTransform:'uppercase'}}>{product.category} • {product.subcategory}</div>
        <div style={{fontWeight:700, fontSize:14, lineHeight:1.35, marginTop:6, minHeight:42}} className="truncate-2">{product.name}</div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
          <span style={{display:'flex', alignItems:'center', gap:4, background:'var(--light)', padding:'4px 8px', borderRadius:999, fontSize:12, fontWeight:700}}><Star size={12} style={{fill:'var(--champagne)', color:'var(--champagne)'}} /> {product.rating}</span>
          <span style={{fontSize:11, color:'var(--text-muted)'}}>{product.reviews} reviews</span>
          <span style={{marginLeft:'auto', fontSize:11, color: product.stock>10 ? 'var(--success)' : product.stock>0 ? '#d97706' : 'var(--danger)', fontWeight:700}}>{product.stock>10 ? 'In stock' : product.stock>0 ? `Only ${product.stock} left` : 'Out of stock'}</span>
        </div>
        <div style={{marginTop:12, display:'flex', alignItems:'end', justifyContent:'space-between', gap:8}}>
          <div>
            <div style={{fontWeight:800, fontSize:16, letterSpacing:'-0.02em'}}>{formatPrice(product.price)}</div>
            {product.originalPrice && <div style={{fontSize:11, color:'var(--text-muted)', textDecoration:'line-through'}}>{formatPrice(product.originalPrice)}</div>}
          </div>
          <button onClick={handleAdd} disabled={product.stock===0} className={product.stock===0 ? 'btn-ghost' : 'btn-primary'} style={{padding:'10px 16px', fontSize:12, opacity: product.stock===0 ? 0.5 : 1}}>
            {product.stock===0 ? 'Out of Stock' : added ? 'Added!' : 'Add to Bag'}
          </button>
        </div>
        <div style={{marginTop:8, fontSize:10, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4}}>Warranty: {product.warranty} • {product.brand}</div>
      </div>
      <style>{`.product-card:hover .card-actions{opacity:1 !important} .product-card:hover .product-image-wrap img{transform:scale(1.05)}`}</style>
    </Link>
  )
}
