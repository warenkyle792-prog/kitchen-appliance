import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X, Moon, Sun, ChevronDown, ChevronRight, Home, Package, Sparkles, Tag, Info, Mail, UserCircle, ShoppingCart, LogOut, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const { count } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const [q, setQ] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [shopByRoomOpen, setShopByRoomOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const panelRef = useRef(null)
  const hamburgerRef = useRef(null)
  const closeBtnRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when panel open
  useEffect(() => {
    if (panelOpen) {
      document.body.style.overflow = 'hidden'
      // Focus close button
      setTimeout(() => closeBtnRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      hamburgerRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [panelOpen])

  // Keyboard accessibility: Escape to close, focus trap
  useEffect(() => {
    if (!panelOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPanelOpen(false)
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [panelOpen])

  const search = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/catalog?search=${encodeURIComponent(q.trim())}`)
  }

  const closePanel = () => setPanelOpen(false)

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) closePanel()
  }

  return (
    <>
      {/* Top bar */}
      <div style={{background:'var(--charcoal)', color:'#e8d5b5', textAlign:'center', padding:'7px 16px', fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase'}}>
        Pay after delivery • Free delivery over KSh 20,000 • Same-day dispatch in Nairobi
      </div>

      {/* Main header — logo left, hamburger right, search + cart accessible */}
      <nav className="glass-nav" style={{boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07)' : 'none'}} role="navigation" aria-label="Main navigation">
        <div className="container" style={{display:'flex', alignItems:'center', height:'76px', gap:'16px', justifyContent:'space-between'}}>
          {/* Logo left */}
          <Link to="/" style={{display:'flex', alignItems:'center', gap:'12px', flexShrink:0}} aria-label="Velcor Appliances home">
            <div style={{width:48, height:48, borderRadius:'14px', background:'linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--charcoal)', fontFamily:'Cormorant Garamond', fontWeight:800, fontSize:'22px', letterSpacing:'-0.04em'}}>V</div>
            <div>
              <div style={{fontFamily:'Cormorant Garamond', fontWeight:700, fontSize:'22px', letterSpacing:'-0.03em', lineHeight:1, color:'var(--text)'}}>VELCOR</div>
              <div style={{fontSize:'10px', letterSpacing:'0.18em', fontWeight:800, color:'var(--champagne-dark)', marginTop:'-2px'}}>APPLIANCES</div>
            </div>
          </Link>

          {/* Search bar — keeps accessible in header */}
          <form onSubmit={search} style={{flex:1, maxWidth:480, position:'relative', display:'flex', alignItems:'center'}} className="search-wrap" role="search" aria-label="Search products">
            <Search size={16} style={{position:'absolute', left:14, color:'var(--text-muted)'}} aria-hidden="true" />
            <input
              value={q}
              onChange={e=>setQ(e.target.value)}
              placeholder="Search televisions, fridges, cookers..."
              className="input"
              style={{paddingLeft:42, paddingRight:16, height:44, fontSize:'13px', background:'var(--light)', border:'1px solid var(--border)'}}
              aria-label="Search products"
            />
          </form>

          {/* Right side — cart + hamburger (always visible) */}
          <div style={{display:'flex', alignItems:'center', gap:'8px', flexShrink:0}}>
            <button onClick={toggle} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <Link
              to="/cart"
              style={{position:'relative', width:44, height:44, borderRadius:'50%', background:'var(--charcoal)', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}
              aria-label={`Shopping cart with ${count} items`}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {count>0 && <span style={{position:'absolute', top:-4, right:-4, background:'var(--champagne)', color:'var(--charcoal)', fontWeight:800, fontSize:11, width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--white)'}} aria-hidden="true">{count}</span>}
            </Link>

            {/* Hamburger menu button — premium charcoal with champagne icon */}
            <button
              ref={hamburgerRef}
              onClick={()=>setPanelOpen(true)}
              style={{width:44, height:44, borderRadius:'12px', background:'var(--charcoal)', color:'var(--champagne)', border:'1px solid rgba(201,168,106,0.25)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s'}}
              aria-label="Open navigation menu"
              aria-expanded={panelOpen}
              aria-controls="velcor-nav-panel"
              aria-haspopup="dialog"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        aria-hidden={!panelOpen}
        style={{
          position:'fixed', inset:0, zIndex:60,
          background:'rgba(10,10,12,0.48)',
          backdropFilter: panelOpen ? 'blur(2px)' : 'none',
          WebkitBackdropFilter: panelOpen ? 'blur(2px)' : 'none',
          opacity: panelOpen ? 1 : 0,
          visibility: panelOpen ? 'visible' : 'hidden',
          transition:'opacity 0.35s cubic-bezier(0.16,1,0.3,1), visibility 0.35s',
          pointerEvents: panelOpen ? 'auto' : 'none'
        }}
      />

      {/* Slide-out panel — desktop slides from left, mobile full-height drawer */}
      <div
        ref={panelRef}
        id="velcor-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!panelOpen}
        inert={panelOpen ? undefined : ''}
        style={{
          position:'fixed', top:0, left:0, zIndex:70,
          height:'100vh',
          width:'360px', maxWidth:'86vw',
          background:'var(--white)',
          borderRight:'1px solid var(--border)',
          boxShadow: panelOpen ? '12px 0 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.02)' : 'none',
          transform: panelOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition:'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
          display:'flex', flexDirection:'column',
          overflow:'hidden'
        }}
      >
        {/* Panel header — charcoal premium */}
        <div style={{background:'var(--charcoal)', padding:'20px 20px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, borderBottom:'1px solid rgba(201,168,106,0.14)'}}>
          <Link to="/" onClick={closePanel} style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:42, height:42, borderRadius:'12px', background:'linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--charcoal)', fontFamily:'Cormorant Garamond', fontWeight:800, fontSize:'20px'}}>V</div>
            <div>
              <div style={{fontFamily:'Cormorant Garamond', fontWeight:700, fontSize:'18px', letterSpacing:'-0.02em', lineHeight:1, color:'white'}}>VELCOR</div>
              <div style={{fontSize:'10px', letterSpacing:'0.14em', fontWeight:700, color:'var(--champagne)', marginTop:2}}>QUALITY FOR EVERY HOME</div>
            </div>
          </Link>
          <button
            ref={closeBtnRef}
            onClick={closePanel}
            style={{width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', flexShrink:0}}
            aria-label="Close navigation menu"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable navigation */}
        <div style={{flex:1, overflowY:'auto', padding:'8px 0 0', WebkitOverflowScrolling:'touch'}}>
          {/* Main navigation items */}
          <nav aria-label="Primary">
            <div style={{padding:'8px 12px 0'}}>
              <div style={{fontSize:'11px', fontWeight:800, letterSpacing:'0.14em', color:'var(--text-muted)', padding:'8px 12px 6px', textTransform:'uppercase'}}>Discover</div>

              <Link to="/" onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Home size={16} style={{color:'var(--champagne-dark)'}} aria-hidden="true" /></span>
                Home
              </Link>

              <Link to="/catalog" onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Package size={16} style={{color:'var(--champagne-dark)'}} aria-hidden="true" /></span>
                Shop All
              </Link>

              {/* Shop by Room — expandable */}
              <div>
                <button
                  onClick={()=>setShopByRoomOpen(!shopByRoomOpen)}
                  style={{width:'100%', display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48, background:'transparent', border:'none', textAlign:'left', color:'var(--text)', cursor:'pointer'}}
                  aria-expanded={shopByRoomOpen}
                  aria-controls="shop-by-room-submenu"
                >
                  <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><span style={{fontSize:14}} aria-hidden="true">🛋️</span></span>
                  Shop by Room
                  <span style={{marginLeft:'auto', color:'var(--text-muted)', transition:'transform 0.25s', transform: shopByRoomOpen ? 'rotate(90deg)' : 'rotate(0deg)'}}><ChevronRight size={16} aria-hidden="true" /></span>
                </button>
                <div
                  id="shop-by-room-submenu"
                  aria-hidden={!shopByRoomOpen}
                  style={{
                    maxHeight: shopByRoomOpen ? '320px' : '0',
                    opacity: shopByRoomOpen ? 1 : 0,
                    overflow:'hidden',
                    transition:'max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease, margin 0.25s',
                    marginLeft:12, marginRight:12,
                    borderLeft: shopByRoomOpen ? '1px solid var(--border)' : '1px solid transparent',
                    paddingLeft: shopByRoomOpen ? '16px' : '16px',
                    marginTop: shopByRoomOpen ? '4px' : '0',
                    marginBottom: shopByRoomOpen ? '8px' : '0'
                  }}
                >
                  {[
                    {label:'Sitting Room', to:'/catalog/sitting-room', icon:'🛋️'},
                    {label:'Kitchen', to:'/catalog/kitchen', icon:'🍳'},
                    {label:'Bedroom', to:'/catalog/bedroom', icon:'🛏️'},
                    {label:'Dining Room', to:'/catalog/dining-room', icon:'🍽️'},
                    {label:'Laundry & Cleaning', to:'/catalog/laundry-cleaning', icon:'✨'},
                  ].map(item=>(
                    <Link key={item.to} to={item.to} onClick={closePanel} style={{display:'flex', alignItems:'center', gap:12, padding:'12px 12px', borderRadius:10, fontWeight:500, fontSize:14, minHeight:44, background: 'transparent'}}>
                      <span style={{fontSize:16, width:20, textAlign:'center'}} aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/catalog?sort=newest" onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Sparkles size={16} style={{color:'var(--champagne-dark)'}} aria-hidden="true" /></span>
                New Arrivals
                <span style={{marginLeft:'auto', background:'var(--champagne)', color:'var(--charcoal)', padding:'4px 8px', borderRadius:999, fontSize:10, fontWeight:800, letterSpacing:'0.04em'}}>Fresh</span>
              </Link>

              <Link to="/catalog?special=offers" onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Tag size={16} style={{color:'var(--charcoal)'}} aria-hidden="true" /></span>
                Special Offers
                <span style={{marginLeft:'auto', background:'#e02424', color:'white', padding:'4px 8px', borderRadius:999, fontSize:10, fontWeight:800}}>Save</span>
              </Link>

              <Link to="/about" onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Info size={16} style={{color:'var(--champagne-dark)'}} aria-hidden="true" /></span>
                About Velcor
              </Link>

              <Link to="/contact" onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Mail size={16} style={{color:'var(--champagne-dark)'}} aria-hidden="true" /></span>
                Contact Us
              </Link>
            </div>

            <div style={{margin:'12px 12px 0', height:1, background:'var(--border)'}} aria-hidden="true"></div>

            <div style={{padding:'12px 12px 0'}}>
              <div style={{fontSize:'11px', fontWeight:800, letterSpacing:'0.14em', color:'var(--text-muted)', padding:'8px 12px 6px', textTransform:'uppercase'}}>Account</div>

              <Link to={user ? "/account" : "/login"} onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><UserCircle size={16} style={{color:'var(--champagne-dark)'}} aria-hidden="true" /></span>
                My Account
                {!user && <span style={{marginLeft:'auto', fontSize:11, color:'var(--text-muted)', fontWeight:700}}>Sign in →</span>}
              </Link>

              <Link to={user ? "/account" : "/track"} onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Package size={16} style={{color:'var(--champagne-dark)'}} aria-hidden="true" /></span>
                My Orders
              </Link>

              <Link to="/cart" onClick={closePanel} className="nav-panel-link" style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48}}>
                <span style={{width:36, height:36, borderRadius:10, background:'var(--charcoal)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><ShoppingCart size={16} aria-hidden="true" /></span>
                Shopping Cart
                {count>0 && <span style={{marginLeft:'auto', background:'var(--champagne)', color:'var(--charcoal)', padding:'6px 12px', borderRadius:999, fontWeight:800, fontSize:12, minWidth:28, textAlign:'center'}}>{count} items</span>}
              </Link>

              {isAdmin && (
                <Link to="/admin" onClick={closePanel} style={{display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:700, fontSize:15, minHeight:48, background:'var(--champagne)', color:'var(--charcoal)', marginTop:4}}>
                  <span style={{width:36, height:36, borderRadius:10, background:'rgba(26,26,30,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><Shield size={16} aria-hidden="true" /></span>
                  Admin Dashboard
                </Link>
              )}

              {user && (
                <button
                  onClick={()=>{ logout(); closePanel() }}
                  style={{width:'100%', display:'flex', alignItems:'center', gap:14, padding:'14px 12px', borderRadius:12, fontWeight:600, fontSize:15, minHeight:48, background:'transparent', border:'none', color:'var(--danger)', textAlign:'left', cursor:'pointer'}}
                >
                  <span style={{width:36, height:36, borderRadius:10, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><LogOut size={16} aria-hidden="true" /></span>
                  Sign Out
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Panel footer — premium contact */}
        <div style={{flexShrink:0, padding:'16px', background:'var(--light)', borderTop:'1px solid var(--border)'}}>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <div style={{width:32, height:32, borderRadius:'50%', background:'var(--charcoal)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--champagne)'}}><Mail size={14} aria-hidden="true" /></div>
            <div>
              <div style={{fontWeight:800, fontSize:12}}>Need help?</div>
              <div style={{fontSize:11, color:'var(--text-muted)'}}>0700 123 456 • hello@velcor.co.ke</div>
            </div>
          </div>
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <Link to="/track" onClick={closePanel} style={{flex:1, textAlign:'center', padding:'12px', borderRadius:999, background:'var(--white)', border:'1px solid var(--border)', fontWeight:700, fontSize:12}}>Track Order</Link>
            <Link to="/contact" onClick={closePanel} style={{flex:1, textAlign:'center', padding:'12px', borderRadius:999, background:'var(--charcoal)', color:'white', fontWeight:700, fontSize:12}}>Contact</Link>
          </div>
          <div style={{marginTop:10, textAlign:'center', fontSize:10, color:'var(--text-muted)', letterSpacing:'0.06em', fontWeight:600}}>Pay after delivery • Free delivery over KSh 20,000</div>
        </div>
      </div>

      {/* Styles for panel interactions */}
      <style>{`
        .nav-panel-link:hover, .nav-panel-link:focus-visible {
          background: var(--light);
          outline: none;
        }
        .nav-panel-link:focus-visible {
          box-shadow: 0 0 0 2px var(--champagne), 0 0 0 4px var(--champagne-glow);
        }
        @media (max-width: 640px) {
          #velcor-nav-panel { width: 92vw !important; max-width: none !important; }
          .search-wrap { display: none !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .search-wrap { max-width: 320px !important; }
        }
      `}</style>
    </>
  )
}
