'use client'

import { createContext, useContext, useMemo, useReducer } from 'react'
export type CartItem = {
  slug: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

type Action =
  | { type: 'add'; item: CartItem }
  | { type: 'update'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

const MAX_QTY = 10

export const itemKey = (i: Pick<CartItem, 'slug' | 'size' | 'color'>) =>
  `${i.slug}__${i.size}__${i.color}`

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'add': {
      const key = itemKey(action.item)
      const existing = state.find((i) => itemKey(i) === key)
      if (existing) {
        return state.map((i) =>
          itemKey(i) === key
            ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + action.item.quantity) }
            : i,
        )
      }
      return [...state, { ...action.item, quantity: Math.min(MAX_QTY, action.item.quantity) }]
    }
    case 'update':
      return state
        .map((i) =>
          itemKey(i) === action.key
            ? { ...i, quantity: Math.max(0, Math.min(MAX_QTY, action.quantity)) }
            : i,
        )
        .filter((i) => i.quantity > 0)
    case 'remove':
      return state.filter((i) => itemKey(i) !== action.key)
    case 'clear':
      return []
  }
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  add: (item: CartItem) => void
  update: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    return {
      items,
      count,
      subtotal,
      add: (item) => dispatch({ type: 'add', item }),
      update: (key, quantity) => dispatch({ type: 'update', key, quantity }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
