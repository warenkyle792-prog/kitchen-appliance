export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(price).replace('KES', 'KSh')
}

export const generateOrderNumber = () => {
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  const num = Math.floor(1000 + Math.random() * 9000)
  return `VEL-${year}-${num}${rand}`
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
