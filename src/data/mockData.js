export const stats = [
  {
    id: 'revenue',
    label: 'Ingresos totales',
    value: '$48,250',
    delta: 12.5,
    icon: 'dollar',
    color: 'primary',
  },
  {
    id: 'orders',
    label: 'Pedidos',
    value: '1,284',
    delta: 8.2,
    icon: 'cart',
    color: 'info',
  },
  {
    id: 'customers',
    label: 'Clientes nuevos',
    value: '342',
    delta: -3.1,
    icon: 'users',
    color: 'success',
  },
  {
    id: 'conversion',
    label: 'Tasa de conversión',
    value: '4.6%',
    delta: 1.4,
    icon: 'trending',
    color: 'warning',
  },
]

export const monthlySales = [
  { month: 'Ene', value: 3200 },
  { month: 'Feb', value: 4100 },
  { month: 'Mar', value: 3800 },
  { month: 'Abr', value: 5200 },
  { month: 'May', value: 4800 },
  { month: 'Jun', value: 6100 },
  { month: 'Jul', value: 5600 },
  { month: 'Ago', value: 6800 },
]

export const orders = [
  { id: '#FB-1042', customer: 'Laura Gómez', product: 'Teclado mecánico', amount: '$89.00', status: 'Completado' },
  { id: '#FB-1041', customer: 'Carlos Ruiz', product: 'Monitor 27" 4K', amount: '$329.00', status: 'Enviado' },
  { id: '#FB-1040', customer: 'Ana Torres', product: 'Mouse inalámbrico', amount: '$24.50', status: 'Pendiente' },
  { id: '#FB-1039', customer: 'Miguel Díaz', product: 'Base para laptop', amount: '$45.00', status: 'Completado' },
  { id: '#FB-1038', customer: 'Sofía Castro', product: 'Webcam HD', amount: '$67.99', status: 'Cancelado' },
  { id: '#FB-1037', customer: 'Jorge Salas', product: 'Audífonos Bluetooth', amount: '$54.00', status: 'Pendiente' },
]

export const activities = [
  {
    id: 1,
    user: 'Laura Gómez',
    action: 'completó el pedido',
    target: '#FB-1042',
    time: 'Hace 12 min',
    color: 'success',
  },
  {
    id: 2,
    user: 'Sistema',
    action: 'procesó el pago de',
    target: '#FB-1041',
    time: 'Hace 48 min',
    color: 'info',
  },
  {
    id: 3,
    user: 'Ana Torres',
    action: 'registró una cuenta nueva',
    target: '',
    time: 'Hace 2 h',
    color: 'warning',
  },
  {
    id: 4,
    user: 'Stock',
    action: 'marcó como agotado:',
    target: 'Mouse Pro X2',
    time: 'Hace 3 h',
    color: 'danger',
  },
  {
    id: 5,
    user: 'Jorge Salas',
    action: 'solicitó devolución de',
    target: '#FB-1035',
    time: 'Hace 5 h',
    color: 'warning',
  },
]

export const topProducts = [
  { name: 'Monitor 27" 4K', sales: 312, share: 78 },
  { name: 'Teclado mecánico', sales: 254, share: 64 },
  { name: 'Audífonos Bluetooth', sales: 198, share: 49 },
  { name: 'Webcam HD', sales: 142, share: 36 },
  { name: 'Base para laptop', sales: 96, share: 24 },
]
