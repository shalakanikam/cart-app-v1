// Core type definitions for the shopping cart application

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SpecialOffer {
  productId: string;
  description: string;
  calculate: (quantity: number, price: number) => number;
}

export interface PurchaseHistory {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  savings: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_ITEMS'; payload: CartItem[] };

export interface CartState {
  items: CartItem[];
}

export interface AppContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  purchaseHistory: PurchaseHistory[];
  addToHistory: (purchase: PurchaseHistory) => void;
}