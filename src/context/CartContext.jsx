import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('velcor-cart')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('velcor-cart', JSON.stringify(items))
  }, [items])

  const add = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      const currentQty = existing ? existing.qty : 0
      const newQty = currentQty + qty
      if (newQty > product.stock) {
        // limit to stock
        if (existing) {
          return prev.map(i => i.id === product.id ? { ...i, qty: product.stock } : i)
        }
        return [...prev, { ...product, qty: Math.min(qty, product.stock) }]
      }
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: newQty } : i)
      }
      return [...prev, { ...product, qty }]
    })
  }

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const updateQty = (id, qty) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i
      const safe = Math.max(1, Math.min(qty, i.stock))
      return { ...i, qty: safe }
    }))
  }
  const inc = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.min(i.qty + 1, i.stock) } : i))
  const dec = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
  const clear = () => setItems([])
  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, inc, dec, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart outside CartProvider')
  return ctx
}
