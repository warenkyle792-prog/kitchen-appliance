import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Warehouse, Truck, BarChart3, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const nav = [
    { path:'/admin', label:'Overview', icon:<LayoutDashboard size={16}/>, exact:true },
    { path:'/admin/products', label:'Products', icon:<Package size={16}/> },
    { path:'/admin/orders', label:'Orders', icon:<ShoppingCart size={16}/> },
    { path:'/admin/inventory', label:'Inventory', icon:<Warehouse size={16}/> },
    { path:'/admin/deliveries', label:'Deliveries', icon:<Truck size={16}/> },
    { path:'/admin/analytics', label:'Analytics', icon:<BarChart3 size={16}/> },
  ]
  return (
    <div style={{display:'flex', minHeight:'70vh'}}>
      <aside style={{width:260, background:'var(--charcoal)', color:'#e8e6e1', padding:16, display:'flex', flexDirection:'column', gap:12}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:36, height:36, borderRadius:10, background:'var(--champagne)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--charcoal)', fontWeight:800}}>V</div>
          <div><div style={{fontWeight:800, fontSize:13}}>VELCOR ADMIN</div><div style={{fontSize:10, color:'#a8a8b8'}}>{user?.email}</div></div>
        </div>
        <nav style={{marginTop:12, display:'flex', flexDirection:'column', gap:4}}>
          {nav.map(n=>{
            const active = n.exact ? location.pathname==='/admin' : location.pathname.startsWith(n.path)
            return <Link key={n.path} to={n.path} style={{display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, background: active ? 'var(--champagne)' : 'transparent', color: active ? 'var(--charcoal)' : '#e8e6e1', fontWeight:700, fontSize:13}}>{n.icon} {n.label}</Link>
          })}
        </nav>
        <div style={{marginTop:'auto', display:'flex', flexDirection:'column', gap:8}}>
          <Link to="/" style={{display:'flex', alignItems:'center', gap:8, padding:'12px', borderRadius:12, background:'rgba(255,255,255,0.08)', color:'white', fontWeight:700, fontSize:12}}><ArrowLeft size={14}/> Back to Store</Link>
          <button onClick={()=>{logout(); navigate('/admin/login')}} style={{display:'flex', alignItems:'center', gap:8, padding:'12px', borderRadius:12, background:'#991b1b', color:'white', border:'none', fontWeight:700, fontSize:12}}><LogOut size={14}/> Sign Out</button>
        </div>
      </aside>
      <div style={{flex:1, background:'var(--off-white)', padding:20, overflowX:'auto'}}>
        <Outlet />
      </div>
      <style>{`@media(max-width:900px){ aside{width:100% !important} div[style*="display:flex"]{flex-direction:column !important} }`}</style>
    </div>
  )
}
