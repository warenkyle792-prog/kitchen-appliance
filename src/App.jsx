import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PhoneAuth from './pages/PhoneAuth.jsx'
import Account from './pages/Account.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import AdminOrders from './pages/admin/Orders.jsx'
import AdminInventory from './pages/admin/Inventory.jsx'
import AdminDeliveries from './pages/admin/Deliveries.jsx'
import AdminAnalytics from './pages/admin/Analytics.jsx'

function ProtectedAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="container" style={{padding:'80px 0', textAlign:'center'}}>Loading Velcor...</div>
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />
  return children
}
function ProtectedUser({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="container" style={{padding:'80px 0', textAlign:'center'}}>Loading...</div>
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <Navbar />
      <main style={{flex:1}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:room" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<PhoneAuth />} />
          <Route path="/account" element={<ProtectedUser><Account /></ProtectedUser>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="deliveries" element={<AdminDeliveries />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
          <Route path="*" element={<div className="container" style={{padding:'80px 0', textAlign:'center'}}><h2>Page not found</h2><a href="/" className="btn-primary" style={{marginTop:16}}>Go Home</a></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
