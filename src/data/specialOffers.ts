// Special offers and promotions configuration

import { SpecialOffer } from '../types';

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    productId: 'cheese',
    description: 'Buy One Get One Free on Cheese!',
    calculate: (quantity: number, price: number) => {
      const freeItems = Math.floor(quantity / 2);
      return freeItems * price;
    },
  },
  {
    productId: 'soup',
    description: 'Buy Soup, Get Half Price Bread!',
    calculate: (quantity: number) => quantity*0,
  },
  {
    productId: 'butter',
    description: 'Get 33% Off Premium Butter!',
    calculate: (quantity: number, price: number) => quantity * price * (1/3),
  },
];
