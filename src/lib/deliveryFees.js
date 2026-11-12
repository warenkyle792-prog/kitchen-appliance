export const deliveryFees = {
  nairobi_cbd: 300,
  westlands: 350,
  parklands: 400,
  kilimani: 400,
  lavington: 450,
  karen: 600,
  syokimau: 700,
  kitengela: 800,
  thika: 900,
  mombasa: 1500,
  kisumu: 1500,
  nakuru: 1200,
  eldoret: 1300,
  default: 500
}

export const towns = [
  { id: 'nairobi_cbd', label: 'Nairobi CBD', fee: 300 },
  { id: 'westlands', label: 'Westlands', fee: 350 },
  { id: 'parklands', label: 'Parklands', fee: 400 },
  { id: 'kilimani', label: 'Kilimani', fee: 400 },
  { id: 'lavington', label: 'Lavington', fee: 450 },
  { id: 'karen', label: 'Karen', fee: 600 },
  { id: 'syokimau', label: 'Syokimau', fee: 700 },
  { id: 'kitengela', label: 'Kitengela', fee: 800 },
  { id: 'thika', label: 'Thika', fee: 900 },
  { id: 'mombasa', label: 'Mombasa', fee: 1500 },
  { id: 'kisumu', label: 'Kisumu (via G4S)', fee: 1500 },
  { id: 'nakuru', label: 'Nakuru', fee: 1200 },
  { id: 'eldoret', label: 'Eldoret', fee: 1300 },
  { id: 'other', label: 'Other Town', fee: 500 }
]

export const getDeliveryFee = (townId) => deliveryFees[townId] ?? deliveryFees.default

export const orderStatuses = [
  'New Order',
  'Confirmed',
  'Processing',
  'Ready for Delivery',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
]

export const paymentStatuses = ['Unpaid', 'Paid', 'Payment disputed', 'Refunded']
