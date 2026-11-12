import { useState, useEffect } from 'react'
import { products as seedProducts } from '../../data/products.js'
import { roomCategories } from '../../data/categories.js'
import { formatPrice } from '../../lib/utils.js'
import { Plus, Edit2, Trash2, Upload } from 'lucide-react'

const STORAGE_KEY = 'velcor-products'

export default function AdminProducts() {
  const [products, setProducts] = useState(()=> {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : seedProducts
  })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name:'', category:'kitchen', subcategory:'Refrigerators', brand:'', model:'', price:'', originalPrice:'', stock:'', warranty:'1 Year Warranty', description:'', featured:false, bestseller:false, images:''
  })

  useEffect(()=>{ localStorage.setItem(STORAGE_KEY, JSON.stringify(products)) }, [products])

  const startEdit = (p) => {
    setEditing(p.id)
    setForm({
      name: p.name, category: p.category, subcategory: p.subcategory, brand: p.brand, model: p.model,
      price: p.price.toString(), originalPrice: p.originalPrice?.toString() || '', stock: p.stock.toString(),
      warranty: p.warranty, description: p.description, featured: p.featured, bestseller: p.bestseller, images: p.images.join(', ')
    })
    setShowForm(true)
  }
  const startAdd = () => {
    setEditing(null)
    setForm({ name:'', category:'kitchen', subcategory:'Refrigerators', brand:'', model:'', price:'', originalPrice:'', stock:'', warranty:'1 Year Warranty', description:'', featured:false, bestseller:false, images:'' })
    setShowForm(true)
  }
  const save = () => {
    if (!form.name || !form.price || !form.stock) { alert('Name, price and stock required'); return }
    const images = form.images.split(',').map(s=>s.trim()).filter(Boolean)
    if (images.length===0) { alert('Add at least one image URL'); return }
    const price = parseInt(form.price)
    const originalPrice = form.originalPrice ? parseInt(form.originalPrice) : undefined
    const stock = parseInt(form.stock)
    if (editing) {
      setProducts(prev=> prev.map(p=> p.id===editing ? { ...p, name: form.name, category: form.category, subcategory: form.subcategory, brand: form.brand, model: form.model, price, originalPrice, stock, warranty: form.warranty, description: form.description, featured: form.featured, bestseller: form.bestseller, images, availability: stock===0 ? 'Out of Stock' : stock <5 ? 'Low Stock' : 'In Stock' } : p))
    } else {
      const newP = {
        id: `VEL-${Date.now().toString().slice(-6)}`,
        name: form.name, slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
        category: form.category, subcategory: form.subcategory, brand: form.brand, model: form.model,
        price, originalPrice, stock, warranty: form.warranty, description: form.description, featured: form.featured, bestseller: form.bestseller,
        images, specs: { 'Warranty': form.warranty }, rating:4.8, reviews:0, dateAdded: new Date().toISOString().slice(0,10), availability: stock===0 ? 'Out of Stock' : 'In Stock'
      }
      setProducts(prev=> [newP, ...prev])
    }
    setShowForm(false)
    setEditing(null)
  }
  const del = (id) => { if(confirm('Delete this product? This removes it from catalog.')) setProducts(prev=> prev.filter(p=>p.id!==id)) }

  const cats = roomCategories

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div><h2 style={{fontSize:20}}>Product Management</h2><p style={{fontSize:12, color:'var(--text-muted)'}}>{products.length} products • Manage categories, stock, featured</p></div>
        <button onClick={startAdd} className="btn-primary" style={{fontSize:12}}><Plus size={14}/> Add Product</button>
      </div>

      <div style={{marginTop:12, display:'flex', gap:8, flexWrap:'wrap'}}>
        {cats.map(c=>(
          <span key={c.id} style={{padding:'6px 12px', borderRadius:999, background:'var(--white)', border:'1px solid var(--border)', fontSize:11, fontWeight:700}}>{c.icon} {c.name}: {c.subcategories.join(', ')}</span>
        ))}
        <span style={{padding:'6px 12px', borderRadius:999, background:'var(--champagne)', color:'var(--charcoal)', fontWeight:800, fontSize:11}}>Admin can add more categories — edit categories.js</span>
      </div>

      {showForm && (
        <div style={{marginTop:16, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
          <h3 style={{fontWeight:800}}>{editing ? 'Edit Product' : 'Add New Product'}</h3>
          <div style={{marginTop:12, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800}}>PRODUCT NAME *</span><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800}}>CATEGORY *</span><select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="input select" style={{marginTop:6, borderRadius:12}}>{cats.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label><span style={{fontSize:11, fontWeight:800}}>SUBCATEGORY *</span><input value={form.subcategory} onChange={e=>setForm({...form, subcategory:e.target.value})} placeholder="e.g. Refrigerators" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800}}>BRAND *</span><input value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})} className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800}}>MODEL NUMBER</span><input value={form.model} onChange={e=>setForm({...form, model:e.target.value})} className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800}}>PRICE KSh *</span><input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} type="number" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800}}>ORIGINAL PRICE (optional)</span><input value={form.originalPrice} onChange={e=>setForm({...form, originalPrice:e.target.value})} type="number" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800}}>STOCK QTY *</span><input value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} type="number" className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label><span style={{fontSize:11, fontWeight:800}}>WARRANTY</span><input value={form.warranty} onChange={e=>setForm({...form, warranty:e.target.value})} className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800}}>DESCRIPTION</span><textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="input textarea" rows={3} style={{marginTop:6, borderRadius:12}}></textarea></label>
            <label style={{gridColumn:'1 / -1'}}><span style={{fontSize:11, fontWeight:800}}>IMAGE URLs (comma separated, multiple photos) *</span><input value={form.images} onChange={e=>setForm({...form, images:e.target.value})} placeholder="https://... , https://..." className="input" style={{marginTop:6, borderRadius:12}}/></label>
            <label style={{display:'flex', alignItems:'center', gap:8}}><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form, featured:e.target.checked})}/> Featured</label>
            <label style={{display:'flex', alignItems:'center', gap:8}}><input type="checkbox" checked={form.bestseller} onChange={e=>setForm({...form, bestseller:e.target.checked})}/> Bestseller</label>
          </div>
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <button onClick={save} className="btn-primary">{editing ? 'Update Product' : 'Create Product'}</button>
            <button onClick={()=>setShowForm(false)} style={{padding:'12px 20px', borderRadius:999, border:'1px solid var(--border)', background:'var(--light)', fontWeight:700}}>Cancel</button>
          </div>
          <div style={{marginTop:8, fontSize:11, color:'var(--text-muted)'}}>Images stored via Supabase Storage in production — here using URLs. Stock updates safely when orders are confirmed.</div>
        </div>
      )}

      <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        {products.map(p=>(
          <div key={p.id} style={{background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden'}}>
            <div style={{height:140, background:'var(--light)', padding:12, display:'flex', alignItems:'center', justifyContent:'center'}}><img src={p.images[0]} alt={p.name} style={{maxWidth:'100%', maxHeight:'100%', objectFit:'contain'}}/></div>
            <div style={{padding:12}}>
              <div style={{fontSize:10, letterSpacing:'0.08em', fontWeight:800, color:'var(--champagne-dark)'}}>{p.id} • {p.category} • {p.stock} in stock</div>
              <div style={{fontWeight:700, fontSize:12, marginTop:4, minHeight:32}}>{p.name}</div>
              <div style={{fontWeight:800, marginTop:6}}>{formatPrice(p.price)} {p.originalPrice && <span style={{fontSize:10, color:'var(--text-muted)', textDecoration:'line-through', marginLeft:6}}>{formatPrice(p.originalPrice)}</span>}</div>
              <div style={{fontSize:10, color:'var(--text-muted)'}}>{p.brand} {p.model} • {p.warranty}</div>
              <div style={{marginTop:8, display:'flex', gap:6}}>
                <button onClick={()=>startEdit(p)} style={{flex:1, padding:'8px', borderRadius:999, background:'var(--charcoal)', color:'white', border:'none', fontWeight:700, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', gap:4}}><Edit2 size={12}/> Edit</button>
                <button onClick={()=>del(p.id)} style={{flex:1, padding:'8px', borderRadius:999, background:'#fef2f2', color:'#991b1b', border:'1px solid #fecaca', fontWeight:700, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', gap:4}}><Trash2 size={12}/> Delete</button>
              </div>
              <div style={{marginTop:6, display:'flex', gap:4}}>{p.featured && <span className="badge badge-gold" style={{fontSize:9}}>Featured</span>} {p.bestseller && <span className="badge badge-dark" style={{fontSize:9}}>Bestseller</span>} {p.stock===0 && <span className="badge" style={{background:'#fecaca', color:'#991b1b', fontSize:9}}>Out of stock</span>}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:900px){ div[style*="repeat(3,1fr)"]{grid-template-columns:repeat(2,1fr) !important} div[style*="gridTemplateColumns:'1fr 1fr'"]{grid-template-columns:1fr !important} } @media(max-width:640px){ div[style*="repeat(3,1fr)"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
