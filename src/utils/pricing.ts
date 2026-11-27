import { CartItem } from '../types';

export const FREE_SHIPPING_THRESHOLD = 800;
export const SHIPPING_FEE = 80;

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  /** Amount still needed to qualify for free shipping (0 when already free). */
  remainingForFreeShipping: number;
}

export function calcOrderTotals(items: CartItem[]): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const qualifies = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = qualifies ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount,
    remainingForFreeShipping: qualifies ? 0 : FREE_SHIPPING_THRESHOLD - subtotal,
  };
}
