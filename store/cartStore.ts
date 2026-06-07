import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, ProductModifier } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, modifiers?: ProductModifier[], qty?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const calculateItemPrice = (
  product: Product,
  variant?: ProductVariant,
  modifiers?: ProductModifier[]
): number => {
  const price = variant?.price ?? product.price;
  const modifierTotal = modifiers?.reduce((sum, m) => sum + m.price, 0) ?? 0;
  return price + modifierTotal;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, modifiers = [], qty = 1) => {
        const unitPrice = calculateItemPrice(product, variant, modifiers);
        const cartItemId = `${product.id}-${variant?.id ?? 'base'}-${modifiers.map(m => m.id).join('-')}`;

        set(state => {
          const existing = state.items.find(i => i.id === cartItemId);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === cartItemId
                  ? { ...i, quantity: i.quantity + qty, total: unitPrice * (i.quantity + qty) }
                  : i
              )
            };
          }
          return {
            items: [...state.items, {
              id: cartItemId,
              product,
              selectedVariant: variant,
              selectedModifiers: modifiers,
              quantity: qty,
              unitPrice,
              total: unitPrice * qty
            }]
          };
        });
      },

      removeItem: (cartItemId) =>
        set(state => ({ items: state.items.filter(i => i.id !== cartItemId) })),

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.id === cartItemId
              ? { ...i, quantity, total: i.unitPrice * quantity }
              : i
          )
        }));
      },

      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.total, 0),
    }),
    { name: 'zaynahs-cart' }
  )
);
