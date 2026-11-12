import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X, Moon, Sun, Heart, Package, LogOut, Settings } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const { count } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const search = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/catalog?search=${encodeURIComponent(q.trim())}`)
  }

  return (
    <>
      <div style={{background:'var(--charcoal)', color:'#e8d5b5', textAlign:'center', padding:'7px 16px', fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase'}}>
        Pay after delivery • Free delivery over KSh 20,000 • Same-day dispatch in Nairobi
      </div>
      <nav className="glass-nav" style={{boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07)' : 'none'}}>
        <div className="container" style={{display:'flex', alignItems:'center', height:'76px', gap:'20px', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'32px'}}>
            <Link to="/" style={{display:'flex', alignItems:'center', gap:'12px'}}>
              <div style={{width:48, height:48, borderRadius:'14px', background:'linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--charcoal)', fontFamily:'Cormorant Garamond', fontWeight:800, fontSize:'22px', letterSpacing:'-0.04em'}}>V</div>
              <div>
                <div style={{fontFamily:'Cormorant Garamond', fontWeight:700, fontSize:'22px', letterSpacing:'-0.03em', lineHeight:1, color:'var(--text)'}}>VELCOR</div>
                <div style={{fontSize:'10px', letterSpacing:'0.18em', fontWeight:800, color:'var(--champagne-dark)', marginTop:'-2px'}}>APPLIANCES</div>
              </div>
              <span style={{display:'none'}} className="hide-mobile"></span>
            </Link>

            <div className="nav-links" style={{alignItems:'center', fontSize:'14px', fontWeight:600}}>
              <Link to="/catalog" style={{padding:'8px 16px', borderRadius:'999px', background: location.pathname.startsWith('/catalog') ? 'var(--charcoal)' : 'transparent', color: location.pathname.startsWith('/catalog') ? 'var(--white)' : 'var(--text)', transition:'all 0.2s'}}>Shop</Link>
              <Link to="/catalog?filter=bestsellers" style={{padding:'8px 16px', borderRadius:'999px', hover:'var(--light)'}}>Bestsellers</Link>
              <Link to="/track" style={{padding:'8px 16px', borderRadius:'999px'}}>Track Order</Link>
              {isAdmin && <Link to="/admin" style={{padding:'8px 16px', borderRadius:'999px', background:'var(--champagne)', color:'var(--charcoal)', fontWeight:800}}>Admin</Link>}
            </div>
          </div>

          <form onSubmit={search} style={{flex:1, maxWidth:420, position:'relative', display:'flex', alignItems:'center'}} className="search-wrap">
            <Search size={16} style={{position:'absolute', left:14, color:'var(--text-muted)'}} />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search televisions, fridges, cookers..." className="input" style={{paddingLeft:42, paddingRight:16, height:44, fontSize:'13px', background:'var(--light)', border:'1px solid var(--border)'}} />
          </form>

          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <div style={{position:'relative'}}>
              <button onClick={()=>setShowUser(!showUser)} style={{width:44, height:44, borderRadius:'50%', background: user ? 'var(--charcoal)' : 'var(--white)', color: user ? 'white' : 'var(--text)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <User size={18} />
              </button>
              {showUser && (
                <div style={{position:'absolute', right:0, top:52, width:260, background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, boxShadow:'var(--shadow-lg)', padding:12, zIndex:60}}>
                  {user ? (
                    <>
                      <div style={{padding:12, background:'var(--light)', borderRadius:12, marginBottom:8}}>
                        <div style={{fontWeight:800, fontSize:14}}>{user.full_name || user.email}</div>
                        <div style={{fontSize:12, color:'var(--text-muted)'}}>{user.email}</div>
                        {isAdmin && <span className="badge badge-gold" style={{marginTop:6}}>Administrator</span>}
                      </div>
                      <Link to="/account" onClick={()=>setShowUser(false)} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, fontWeight:600, fontSize:14}}><Package size={16}/> My Orders</Link>
                      <Link to="/account" onClick={()=>setShowUser(false)} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, fontWeight:600, fontSize:14}}><Settings size={16}/> Account Settings</Link>
                      {isAdmin && <Link to="/admin" onClick={()=>setShowUser(false)} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, fontWeight:700, fontSize:14, background:'var(--champagne)', color:'var(--charcoal)'}}>Go to Dashboard</Link>}
                      <button onClick={()=>{logout(); setShowUser(false)}} style={{width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, fontWeight:600, fontSize:14, border:'none', background:'transparent', textAlign:'left', color:'var(--danger)'}}><LogOut size={16}/> Sign Out</button>
                    </>
                  ) : (
                    <>
                      <div style={{padding:12, textAlign:'center'}}>
                        <div style={{fontWeight:800}}>Welcome to Velcor</div>
                        <div style={{fontSize:12, color:'var(--text-muted)', marginTop:4}}>Sign in to track orders & save delivery info</div>
                      </div>
                      <Link to="/login" onClick={()=>setShowUser(false)} style={{display:'block', textAlign:'center', padding:'12px', background:'var(--charcoal)', color:'white', borderRadius:999, fontWeight:700, marginTop:8}}>Sign In</Link>
                      <Link to="/register" onClick={()=>setShowUser(false)} style={{display:'block', textAlign:'center', padding:'12px', border:'1.5px solid var(--border)', borderRadius:999, fontWeight:700, marginTop:8}}>Create Account</Link>
                      <Link to="/track" onClick={()=>setShowUser(false)} style={{display:'block', textAlign:'center', padding:'10px', fontSize:13, fontWeight:600, color:'var(--text-muted)', marginTop:4}}>Track order as guest →</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/cart" style={{position:'relative', width:44, height:44, borderRadius:'50%', background:'var(--charcoal)', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <ShoppingBag size={18} />
              {count>0 && <span style={{position:'absolute', top:-4, right:-4, background:'var(--champagne)', color:'var(--charcoal)', fontWeight:800, fontSize:11, width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--white)'}}>{count}</span>}
            </Link>

            <button onClick={()=>setOpen(true)} style={{width:44, height:44, borderRadius:'50%', border:'1px solid var(--border)', background:'var(--white)', display:'flex', alignItems:'center', justifyContent:'center'}} className="show-mobile-only">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu open">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
            <div style={{fontFamily:'Cormorant Garamond', fontWeight:700, fontSize:20}}>Menu</div>
            <button onClick={()=>setOpen(false)} style={{width:44, height:44, borderRadius:'50%', background:'var(--light)', border:'none', display:'flex', alignItems:'center', justifyContent:'center'}}><X size={18}/></button>
          </div>
          <Link to="/" onClick={()=>setOpen(false)} style={{display:'block', padding:'16px', fontSize:16, fontWeight:700, background:'var(--charcoal)', color:'white', borderRadius:12, marginBottom:8}}>Home</Link>
          <Link to="/catalog" onClick={()=>setOpen(false)} style={{display:'block', padding:'16px', fontSize:16, fontWeight:700, border:'1px solid var(--border)', borderRadius:12, marginBottom:8}}>Shop All</Link>
          <Link to="/track" onClick={()=>setOpen(false)} style={{display:'block', padding:'16px', fontSize:16, fontWeight:700, border:'1px solid var(--border)', borderRadius:12, marginBottom:8}}>Track Order</Link>
          {user ? <Link to="/account" onClick={()=>setOpen(false)} style={{display:'block', padding:'16px', fontSize:16, fontWeight:700, border:'1px solid var(--border)', borderRadius:12}}>My Account</Link> : <Link to="/login" onClick={()=>setOpen(false)} style={{display:'block', padding:'16px', fontSize:16, fontWeight:700, border:'1px solid var(--border)', borderRadius:12}}>Sign In</Link>}
          <Link to="/cart" onClick={()=>setOpen(false)} style={{display:'block', padding:'16px', fontSize:16, fontWeight:800, background:'var(--champagne)', color:'var(--charcoal)', borderRadius:12, marginTop:8, textAlign:'center'}}>Cart • {count} items</Link>
          <style>{`@media(min-width:1025px){ .show-mobile-only{display:none !important} } @media(max-width:1024px){ .search-wrap{display:none !important} }`}</style>
        </div>
      )}
    </>
  )
}
