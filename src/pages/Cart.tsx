import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Search, TrendingUp, History, Download, Share2 } from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface SpecialOffer {
  productId: string;
  description: string;
  calculate: (quantity: number, price: number) => number;
}

interface PurchaseHistory {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  savings: number;
}

// Redux-style state management using useReducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartState {
  items: CartItem[];
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

// Products data with categories
const products: Product[] = [
  { id: 'bread', name: 'Bread', price: 1.10, category: 'Bakery', image: '🍞' },
  { id: 'milk', name: 'Milk', price: 0.50, category: 'Dairy', image: '🥛' },
  { id: 'cheese', name: 'Cheese', price: 0.90, category: 'Dairy', image: '🧀' },
  { id: 'soup', name: 'Soup', price: 0.60, category: 'Canned', image: '🥫' },
  { id: 'butter', name: 'Butter', price: 1.20, category: 'Dairy', image: '🧈' },
];

// Special offers
const specialOffers: SpecialOffer[] = [
  {
    productId: 'cheese',
    description: 'When you buy a Cheese, you get a second Cheese free!',
    calculate: (quantity: number, price: number) => {
      const freeItems = Math.floor(quantity / 2);
      return freeItems * price;
    },
  },
  {
    productId: 'soup',
    description: 'When you buy a Soup, you get a half price Bread!',
    calculate: (quantity: number) => {
      return quantity * 0.55;
    },
  },
  {
    productId: 'butter',
    description: 'Get a third off Butter!',
    calculate: (quantity: number, price: number) => {
      return quantity * price * (1/3);
    },
  },
];

// ProductList Component with Search and Filter
const ProductList: React.FC<{ 
  onAddToCart: (product: Product) => void;
  cartItems: CartItem[];
}> = ({ onAddToCart, cartItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Search size={24} />
        Products
      </h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No products found</p>
        ) : (
          filteredProducts.map(product => {
            const quantity = getCartQuantity(product.id);
            return (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl">{product.image}</span>
                  <div>
                    <span className="font-medium text-gray-800 block">{product.name}</span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-semibold">£{product.price.toFixed(2)}</span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 relative"
                  >
                    <Plus size={16} />
                    Add
                    {quantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {quantity}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Basket Component
const Basket: React.FC<{
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}> = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const calculateItemSavings = (item: CartItem): number => {
    const offer = specialOffers.find(o => o.productId === item.id);
    if (!offer) return 0;
    return offer.calculate(item.quantity, item.price);
  };

  const calculateSoupBreadDiscount = (): number => {
    const soupItem = items.find(i => i.id === 'soup');
    const breadItem = items.find(i => i.id === 'bread');
    if (!soupItem || !breadItem) return 0;
    
    const discountedBreadCount = Math.min(soupItem.quantity, breadItem.quantity);
    return discountedBreadCount * 0.55;
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemSavings = items.reduce((sum, item) => sum + calculateItemSavings(item), 0);
  const soupBreadDiscount = calculateSoupBreadDiscount();
  const totalSavings = itemSavings + soupBreadDiscount;
  const totalAmount = subtotal - totalSavings;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <ShoppingCart size={24} />
          Basket
        </h2>
        <p className="text-gray-500 text-center py-8">Your basket is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <ShoppingCart size={24} />
        Basket
      </h2>
      <div className="space-y-4">
        {items.map(item => {
          const savings = calculateItemSavings(item);
          const itemCost = item.price * item.quantity - (item.id === 'soup' ? 0 : savings);
          
          return (
            <div key={item.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.image}</span>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <span className="text-gray-600">£{item.price.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="ml-2 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    Item price: £{item.price.toFixed(2)} × {item.quantity} = £{(item.price * item.quantity).toFixed(2)}
                  </div>
                  {savings > 0 && (
                    <div className="text-xs text-red-500 font-medium">
                      Savings: £{savings.toFixed(2)}
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-800">
                    Item cost: £{itemCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {soupBreadDiscount > 0 && (
          <div className="text-sm text-gray-600 bg-green-50 p-3 rounded">
            <span className="font-medium text-green-700">Soup Special:</span> Half price bread discount applied
            <div className="text-xs text-green-600 mt-1">Savings: £{soupBreadDiscount.toFixed(2)}</div>
          </div>
        )}

        <div className="pt-4 space-y-2 border-t-2 border-gray-300">
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Sub Total:</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          {totalSavings > 0 && (
            <div className="flex justify-between text-red-600">
              <span className="font-medium">Savings:</span>
              <span>-£{totalSavings.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total Amount:</span>
            <span>£{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

// SpecialOffers Component
const SpecialOffers: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <TrendingUp size={24} />
        Special Offers
      </h2>
      <div className="space-y-3">
        {specialOffers.map((offer, index) => {
          const product = products.find(p => p.id === offer.productId);
          return (
            <div key={index} className="bg-white p-3 rounded-lg border-l-4 border-green-500 flex items-center gap-3">
              <span className="text-3xl">{product?.image}</span>
              <div>
                <div className="font-medium text-gray-800">{product?.name}</div>
                <div className="text-sm text-gray-600">{offer.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Purchase History Component
const PurchaseHistoryComponent: React.FC<{
  history: PurchaseHistory[];
  onLoadHistory: (items: CartItem[]) => void;
}> = ({ history, onLoadHistory }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <History size={24} />
          Purchase History
        </h2>
        <p className="text-gray-500 text-center py-8">No purchase history yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <History size={24} />
        Purchase History
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {history.map((purchase) => (
          <div key={purchase.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-gray-800">Order #{purchase.id.slice(0, 8)}</div>
                <div className="text-sm text-gray-500">{purchase.date}</div>
              </div>
              <button
                onClick={() => onLoadHistory(purchase.items)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Reorder
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {purchase.items.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <span>{item.image}</span>
                  <span>{item.name} x{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-sm">
              <span className="text-green-600 font-medium">Saved: £{purchase.savings.toFixed(2)}</span>
              <span className="font-bold text-gray-800">Total: £{purchase.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Statistics Component
const Statistics: React.FC<{ history: PurchaseHistory[]; currentCart: CartItem[] }> = ({ history, currentCart }) => {
  const totalOrders = history.length;
  const totalSpent = history.reduce((sum, h) => sum + h.total, 0);
  const totalSaved = history.reduce((sum, h) => sum + h.savings, 0);

  const currentSubtotal = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600 mb-1">Total Orders</div>
        <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600 mb-1">Total Spent</div>
        <div className="text-2xl font-bold text-green-600">£{totalSpent.toFixed(2)}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600 mb-1">Total Saved</div>
        <div className="text-2xl font-bold text-red-600">£{totalSaved.toFixed(2)}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600 mb-1">Current Cart</div>
        <div className="text-2xl font-bold text-purple-600">£{currentSubtotal.toFixed(2)}</div>
      </div>
    </div>
  );
};

// Main App Component
const ShoppingCartApp: React.FC = () => {
  const [state, dispatch] = React.useReducer(cartReducer, { items: [] });
  const [showCart, setShowCart] = useState(true);
  const [showOffers, setShowOffers] = useState(true);
  const [showProducts, setShowProducts] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleClearCart = () => {
    const confirmed = confirm('Are you sure you want to clear your cart?');
    if (confirmed) {
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const handleCheckout = () => {
    if (state.items.length === 0) return;

    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemSavings = state.items.reduce((sum, item) => {
      const offer = specialOffers.find(o => o.productId === item.id);
      return sum + (offer ? offer.calculate(item.quantity, item.price) : 0);
    }, 0);
    
    const soupItem = state.items.find(i => i.id === 'soup');
    const breadItem = state.items.find(i => i.id === 'bread');
    const soupBreadDiscount = (soupItem && breadItem) 
      ? Math.min(soupItem.quantity, breadItem.quantity) * 0.55 
      : 0;
    
    const totalSavings = itemSavings + soupBreadDiscount;
    const totalAmount = subtotal - totalSavings;

    const newPurchase: PurchaseHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      items: [...state.items],
      total: totalAmount,
      savings: totalSavings,
    };

    setPurchaseHistory(prev => [newPurchase, ...prev]);
    dispatch({ type: 'CLEAR_CART' });
    alert(`Order placed successfully! 🎉\nTotal: £${totalAmount.toFixed(2)}\nYou saved: £${totalSavings.toFixed(2)}`);
  };

  const handleLoadHistory = (items: CartItem[]) => {
    items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch({ type: 'ADD_ITEM', payload: item });
      }
    });
    alert('Items loaded into cart!');
  };

  const handleExportCart = () => {
    const cartData = {
      items: state.items,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(cartData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cart-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareCart = () => {
    const cartText = state.items.map(item => `${item.name} x${item.quantity}`).join(', ');
    if (navigator.share) {
      navigator.share({
        title: 'My Shopping Cart',
        text: `Check out my cart: ${cartText}`,
      });
    } else {
      const text = `My Shopping Cart:\n${cartText}`;
      navigator.clipboard.writeText(text);
      alert('Cart details copied to clipboard!');
    }
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            🛒 Smart Shopping Cart
          </h1>
          <p className="text-gray-600">Save more with our special offers!</p>
        </div>

        {showStats && (
          <div className="mb-6">
            <Statistics history={purchaseHistory} currentCart={state.items} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-3 justify-center items-center">
          <button
            onClick={() => setShowProducts(!showProducts)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              showProducts
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showProducts ? '👁️ Hide' : '👁️‍🗨️ Show'} Products
          </button>
          
          <button
            onClick={() => setShowCart(!showCart)}
            className={`px-4 py-2 rounded-md font-medium transition-all relative ${
              showCart
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showCart ? '👁️ Hide' : '👁️‍🗨️ Show'} Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setShowOffers(!showOffers)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              showOffers
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showOffers ? '👁️ Hide' : '👁️‍🗨️ Show'} Offers
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              showHistory
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showHistory ? '👁️ Hide' : '👁️‍🗨️ Show'} History
          </button>

          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              showStats
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showStats ? '👁️ Hide' : '👁️‍🗨️ Show'} Stats
          </button>

          {state.items.length > 0 && (
            <>
              <button
                onClick={handleExportCart}
                className="px-4 py-2 bg-teal-500 text-white rounded-md font-medium hover:bg-teal-600 transition-all flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>

              <button
                onClick={handleShareCart}
                className="px-4 py-2 bg-pink-500 text-white rounded-md font-medium hover:bg-pink-600 transition-all flex items-center gap-2"
              >
                <Share2 size={16} />
                Share
              </button>

              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-all"
              >
                🗑️ Clear Cart
              </button>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div
            className={`transition-all duration-500 transform ${
              showProducts
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 pointer-events-none absolute'
            }`}
          >
            {showProducts && <ProductList onAddToCart={handleAddToCart} cartItems={state.items} />}
          </div>

          <div
            className={`transition-all duration-500 transform ${
              showCart
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 pointer-events-none absolute'
            }`}
          >
            {showCart && (
              <Basket
                items={state.items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        </div>

        <div
          className={`transition-all duration-500 transform mb-6 ${
            showOffers
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'
          }`}
        >
          {showOffers && <SpecialOffers />}
        </div>

        <div
          className={`transition-all duration-500 transform ${
            showHistory
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'
          }`}
        >
          {showHistory && (
            <PurchaseHistoryComponent history={purchaseHistory} onLoadHistory={handleLoadHistory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartApp;