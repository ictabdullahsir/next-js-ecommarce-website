import { getDb } from '@/lib/mongo'
import { ORDER_STATUSES } from '@/lib/order-statuses'

export { ORDER_STATUSES }
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export type OrderItem = {
  slug: string
  name: string
  image: string
  price: number
  size: string
  color: string
  quantity: number
}

export type Order = {
  number: string
  createdAt: string
  status: OrderStatus
  customer: { name: string; email: string; phone: string; address: string; city: string; postalCode: string }
  items: OrderItem[]
  subtotal: number
  discount: number
  couponCode?: string
  shipping: number
  total: number
  paymentMethod: 'cash-on-delivery'
  note?: string
  adminNote?: string
}

export async function ordersCollection() {
  return (await getDb()).collection<Order>('orders')
}

const clean = (o: Order & { _id?: unknown }): Order => {
  const { _id, ...rest } = o
  void _id
  return rest
}

export async function listOrders(status?: string): Promise<Order[]> {
  const c = await ordersCollection()
  const filter = status && (ORDER_STATUSES as readonly string[]).includes(status) ? { status: status as OrderStatus } : {}
  return (await c.find(filter).sort({ createdAt: -1 }).limit(500).toArray()).map(clean)
}

export async function getOrder(number: string): Promise<Order | null> {
  const c = await ordersCollection()
  const o = await c.findOne({ number })
  return o ? clean(o) : null
}

export type Customer = { email: string; name: string; phone: string; orders: number; spent: number; lastOrder: string }

export async function listCustomers(): Promise<Customer[]> {
  const orders = (await listOrders()).filter((o) => o.status !== 'cancelled')
  const map = new Map<string, Customer>()
  for (const o of orders) {
    const key = o.customer.email.toLowerCase()
    const c = map.get(key) ?? { email: key, name: o.customer.name, phone: o.customer.phone, orders: 0, spent: 0, lastOrder: o.createdAt }
    c.orders += 1
    c.spent += o.total
    if (o.createdAt > c.lastOrder) c.lastOrder = o.createdAt
    map.set(key, c)
  }
  return [...map.values()].sort((a, b) => b.spent - a.spent)
}
