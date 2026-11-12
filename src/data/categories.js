export const roomCategories = [
  {
    id: 'sitting-room',
    name: 'Sitting Room',
    slug: 'sitting-room',
    icon: '🛋️',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=60',
    count: 24,
    subcategories: ['Televisions', 'Sound Systems', 'Home Theatre Systems', 'Fans', 'Air Conditioners', 'Lamps', 'Other']
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    slug: 'kitchen',
    icon: '🍳',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=60',
    count: 42,
    subcategories: ['Refrigerators', 'Microwaves', 'Blenders', 'Electric Kettles', 'Air Fryers', 'Cookers', 'Toasters', 'Coffee Makers', 'Other']
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    slug: 'bedroom',
    icon: '🛏️',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=60',
    count: 18,
    subcategories: ['Bedroom Televisions', 'Fans', 'Air Conditioners', 'Bedside Lamps', 'Electric Blankets', 'Digital Clocks', 'Other']
  },
  {
    id: 'dining-room',
    name: 'Dining Room',
    slug: 'dining-room',
    icon: '🍽️',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=60',
    count: 15,
    subcategories: ['Water Dispensers', 'Food Warmers', 'Coffee Makers', 'Serving Appliances', 'Dining Lighting', 'Other']
  },
  {
    id: 'laundry-cleaning',
    name: 'Laundry & Cleaning',
    slug: 'laundry-cleaning',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=60',
    count: 22,
    subcategories: ['Washing Machines', 'Dryers', 'Vacuum Cleaners', 'Irons', 'Steam Cleaners', 'Other']
  }
]

export const allCategories = [
  { id: 'all', name: 'All Appliances', icon: '🏠' },
  ...roomCategories.map(r => ({ id: r.id, name: r.name, icon: r.icon })),
]
