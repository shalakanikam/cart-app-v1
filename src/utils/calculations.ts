import { CartItem } from '../types';
import { SPECIAL_OFFERS } from '../data/specialOffers';

export const calculateItemSavings = (item: CartItem): number => {
  const offer = SPECIAL_OFFERS.find(o => o.productId === item.id);
  return offer ? offer.calculate(item.quantity, item.price) : 0;
};

export const calculateSoupBreadDiscount = (items: CartItem[]): number => {
  const soupItem = items.find(i => i.id === 'soup');
  const breadItem = items.find(i => i.id === 'bread');
  if (!soupItem || !breadItem) return 0;
  const discountedBreadCount = Math.min(soupItem.quantity, breadItem.quantity);
  return discountedBreadCount * 0.55;
};

export const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemSavings = items.reduce((sum, item) => sum + calculateItemSavings(item), 0);
  const soupBreadDiscount = calculateSoupBreadDiscount(items);
  const totalSavings = itemSavings + soupBreadDiscount;
  const total = subtotal - totalSavings;
  return { subtotal, itemSavings, soupBreadDiscount, totalSavings, total };
};