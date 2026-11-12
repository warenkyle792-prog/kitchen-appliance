import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link, useParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { products } from '../data/products.js'
import { roomCategories, allCategories } from '../data/categories.js'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const { room } = useParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const [sort, setSort] = useState(params.get('sort') || (params.get('special') ? 'price-asc' : 'featured'))
  const [category, setCategory] = useState(room || params.get('category') || 'all')
  const [priceRange, setPriceRange] = useState(params.get('price') || 'all')
  const [brandFilter, setBrandFilter] = useState(params.get('brand') || 'all')
  const [showFilters, setShowFilters] = useState(false)

  // Sync with URL params for New Arrivals / Special Offers
  useEffect(() => {
    const filter = params.get('filter')
    const special = params.get('special')
    const sortParam = params.get('sort')
    if (sortParam) setSort(sortParam)
    else if (filter === 'new') setSort('newest')
    else if (special === 'offers') setSort('price-asc')
    if (search !== (params.get('search')||'')) setSearch(params.get('search')||'')
  }, [params])

  const brands = useMemo(()=> [...new Set(products.map(p=>p.brand))], [])

  const filtered = useMemo(()=>{
    let res = [...products]
    if (category !== 'all') res = res.filter(p=>p.category===category)
    if (search) {
      const s = search.toLowerCase()
      res = res.filter(p=> p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.subcategory.toLowerCase().includes(s) || p.description.toLowerCase().includes(s))
    }
    // Existing filters
    if (params.get('filter')==='featured') res = res.filter(p=>p.featured)
    if (params.get('filter')==='bestsellers') res = res.filter(p=>p.bestseller)
    if (params.get('filter')==='new') res = [...res].sort((a,b)=> new Date(b.dateAdded) - new Date(a.dateAdded))
    // Special offers: has discount
    if (params.get('special')==='offers') res = res.filter(p=> p.originalPrice && p.originalPrice > p.price)
    if (priceRange==='under20k') res = res.filter(p=>p.price < 20000)
    if (priceRange==='20k-50k') res = res.filter(p=>p.price >=20000 && p.price <50000)
    if (priceRange==='50k-100k') res = res.filter(p=>p.price >=50000 && p.price <100000)
    if (priceRange==='over100k') res = res.filter(p=>p.price >=100000)
    if (brandFilter!=='all') res = res.filter(p=>p.brand===brandFilter)
    if (sort==='price-asc') res.sort((a,b)=>a.price-b.price)
    if (sort==='price-desc') res.sort((a,b)=>b.price-a.price)
    if (sort==='rating') res.sort((a,b)=>b.rating-a.rating)
    if (sort==='newest') res.sort((a,b)=> new Date(b.dateAdded)-new Date(a.dateAdded))
    if (sort==='name') res.sort((a,b)=>a.name.localeCompare(b.name))
    return res
  }, [category, search, sort, priceRange, brandFilter, params])

  const currentRoom = roomCategories.find(r=>r.slug===category)

  // Determine page title based on filters
  const getTitle = () => {
    if (currentRoom) return currentRoom.name
    if (params.get('filter')==='featured') return 'Featured'
    if (params.get('filter')==='bestsellers') return 'Bestsellers'
    if (params.get('filter')==='new') return 'New Arrivals'
    if (params.get('special')==='offers') return 'Special Offers'
    return 'All Appliances'
  }
  const getSubtitle = () => {
    if (params.get('special')==='offers') return `${filtered.length} products on offer • Save up to 22% • Pay after delivery`
    if (params.get('filter')==='new') return `${filtered.length} new arrivals • Latest premium appliances`
    return `${filtered.length} products • Premium appliances for ${currentRoom ? currentRoom.name.toLowerCase() : 'every home'} • Pay after delivery`
  }

  return (
    <div className="container" style={{padding:'24px'}}>
      <div style={{display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text-muted)'}}>
        <Link to="/">Home</Link> <span>›</span> <span style={{color:'var(--text)', fontWeight:700}}>Catalog</span> {currentRoom && <><span>›</span> <span style={{color:'var(--champagne-dark)', fontWeight:800}}>{currentRoom.name}</span></>}
        {params.get('filter') && <><span>›</span> <span style={{color:'var(--champagne-dark)', fontWeight:800}}>{getTitle()}</span></>}
        {params.get('special') && <><span>›</span> <span style={{color:'var(--champagne-dark)', fontWeight:800}}>{getTitle()}</span></>}
      </div>

      <div style={{marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'end', flexWrap:'wrap', gap:16}}>
        <div>
          <h1 style={{fontSize:32}}>{getTitle()}</h1>
          <p style={{color:'var(--text-muted)', fontSize:13, marginTop:4}}>{getSubtitle()}</p>
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
          <div style={{position:'relative'}}>
            <Search size={16} style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search brand, model..." style={{padding:'12px 16px 12px 36px', borderRadius:999, border:'1px solid var(--border)', background:'var(--white)', width:260, fontSize:13}}/>
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="input select" style={{width:'auto', borderRadius:999, height:44, fontSize:13}}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
          <button onClick={()=>setShowFilters(!showFilters)} style={{display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderRadius:999, border:'1px solid var(--border)', background: showFilters ? 'var(--charcoal)' : 'var(--white)', color: showFilters ? 'white' : 'var(--text)', fontWeight:700, fontSize:13}}>
            <SlidersHorizontal size={14}/> Filters
          </button>
        </div>
      </div>

      <div style={{marginTop:16, display:'flex', gap:8, overflowX:'auto', paddingBottom:8}}>
        {allCategories.map(c=>(
          <button key={c.id} onClick={()=>setCategory(c.id)} style={{whiteSpace:'nowrap', padding:'10px 18px', borderRadius:999, border:'1px solid var(--border)', background: category===c.id ? 'var(--charcoal)' : 'var(--white)', color: category===c.id ? 'white' : 'var(--text)', fontWeight:700, fontSize:13}}>
            <span style={{marginRight:6}}>{c.icon}</span>{c.name}
          </button>
        ))}
      </div>

      {showFilters && (
        <div style={{marginTop:12, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
          <div>
            <div style={{fontWeight:800, fontSize:12, letterSpacing:'0.08em'}}>PRICE RANGE</div>
            <select value={priceRange} onChange={e=>setPriceRange(e.target.value)} className="input select" style={{marginTop:8, borderRadius:12}}>
              <option value="all">All Prices</option>
              <option value="under20k">Under KSh 20,000</option>
              <option value="20k-50k">KSh 20K – 50K</option>
              <option value="50k-100k">KSh 50K – 100K</option>
              <option value="over100k">Over KSh 100K</option>
            </select>
          </div>
          <div>
            <div style={{fontWeight:800, fontSize:12, letterSpacing:'0.08em'}}>BRAND</div>
            <select value={brandFilter} onChange={e=>setBrandFilter(e.target.value)} className="input select" style={{marginTop:8, borderRadius:12}}>
              <option value="all">All Brands</option>
              {brands.map(b=> <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={{display:'flex', alignItems:'end'}}>
            <button onClick={()=>{setSearch(''); setCategory('all'); setPriceRange('all'); setBrandFilter('all'); setSort('featured')}} style={{padding:'12px 16px', borderRadius:999, border:'1px solid var(--border)', background:'var(--light)', fontWeight:700, width:'100%'}}><X size={14} style={{marginRight:6}}/> Clear Filters</button>
          </div>
        </div>
      )}

      {currentRoom && (
        <div style={{marginTop:12, background:'linear-gradient(135deg, var(--charcoal) 0%, #2a2a30 100%)', borderRadius:16, padding:16, color:'white', display:'flex', gap:16, alignItems:'center'}}>
          <img src={currentRoom.image} alt={currentRoom.name} style={{width:80, height:80, borderRadius:12, objectFit:'cover'}}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:800, fontFamily:'Cormorant Garamond', fontSize:16}}>{currentRoom.icon} {currentRoom.name}</div>
            <div style={{fontSize:12, color:'#a8a8b8'}}>{currentRoom.subcategories.join(' • ')} • {filtered.length} products • Premium selection</div>
          </div>
          <div style={{background:'var(--champagne)', color:'var(--charcoal)', padding:'8px 14px', borderRadius:999, fontWeight:800, fontSize:11}}>Pay after delivery</div>
        </div>
      )}

      {params.get('special')==='offers' && (
        <div style={{marginTop:12, background:'linear-gradient(135deg, var(--champagne) 0%, #e8c992 100%)', borderRadius:16, padding:16, display:'flex', gap:16, alignItems:'center', color:'var(--charcoal)'}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:800, fontSize:14}}>Special Offers • Save up to 22%</div>
            <div style={{fontSize:12, opacity:0.8}}>Limited-time deals on Sitting Room TVs & kitchen favourites. Pay after delivery.</div>
          </div>
          <div style={{background:'var(--charcoal)', color:'white', padding:'8px 14px', borderRadius:999, fontWeight:800, fontSize:11}}>{filtered.length} deals</div>
        </div>
      )}

      <div style={{marginTop:20, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
        {filtered.map(p=> <ProductCard key={p.id} product={p} />)}
      </div>
      {filtered.length===0 && <div style={{textAlign:'center', padding:'60px 0', color:'var(--text-muted)'}}>No products match your filters.<button onClick={()=>{setSearch(''); setCategory('all'); setPriceRange('all'); setBrandFilter('all')}} style={{marginLeft:8, color:'var(--champagne-dark)', fontWeight:800, border:'none', background:'none'}}>Clear filters</button></div>}

      <style>{`@media(max-width:1100px){ div[style*="repeat(3,1fr)"]{grid-template-columns:repeat(2,1fr) !important} } @media(max-width:640px){ div[style*="repeat(3,1fr)"]{grid-template-columns:1fr !important} }`}</style>
    </div>
  )
}
