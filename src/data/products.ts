// Product catalog and category definitions

import { Product } from '../types';

export const PRODUCTS: Product[] = [
  { 
    id: 'bread', 
    name: 'Bread', 
    price: 1.10, 
    category: 'Bakery', 
    icon: '🍞',
    description: 'Fresh baked daily'
  },
  { 
    id: 'milk', 
    name: 'Milk', 
    price: 0.50, 
    category: 'Dairy', 
    icon: '🥛',
    description: 'Farm fresh organic'
  },
  { 
    id: 'cheese', 
    name: 'Cheese', 
    price: 0.90, 
    category: 'Dairy', 
    icon: '🧀',
    description: 'Aged cheddar'
  },
  { 
    id: 'soup', 
    name: 'Soup', 
    price: 0.60, 
    category: 'Canned', 
    icon: '🥫',
    description: 'Hearty tomato'
  },
  { 
    id: 'butter', 
    name: 'Butter', 
    price: 1.20, 
    category: 'Dairy', 
    icon: '🧈',
    description: 'Creamy and rich'
  },
];

export const CATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.category)));