import React, { useState, useReducer, createContext, useContext } from 'react';
import { 
  ShoppingCart, Plus, Minus, Trash2, Search, TrendingUp, 
  History, X, Menu, Package,
  Receipt, Tag, Filter, ChevronRight
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
  description?: string;
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

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_ITEMS'; payload: CartItem[] };

interface CartState {
  items: CartItem[];
}

interface AppContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  purchaseHistory: PurchaseHistory[];
  addToHistory: (purchase: PurchaseHistory) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// ============================================================================
// REDUCER
// ============================================================================

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
    case 'LOAD_ITEMS':
      return { items: action.payload };
    default:
      return state;
  }
};

// ============================================================================
// DATA
// ============================================================================

const PRODUCTS: Product[] = [
  { 
    id: 'bread', 
    name: 'Artisan Bread', 
    price: 1.10, 
    category: 'Bakery', 
    icon: '🍞',
    description: 'Fresh baked daily'
  },
  { 
    id: 'milk', 
    name: 'Organic Milk', 
    price: 0.50, 
    category: 'Dairy', 
    icon: '🥛',
    description: 'Farm fresh organic'
  },
  { 
    id: 'cheese', 
    name: 'Cheddar Cheese', 
    price: 0.90, 
    category: 'Dairy', 
    icon: '🧀',
    description: 'Aged cheddar'
  },
  { 
    id: 'soup', 
    name: 'Tomato Soup', 
    price: 0.60, 
    category: 'Canned', 
    icon: '🥫',
    description: 'Hearty tomato'
  },
  { 
    id: 'butter', 
    name: 'Premium Butter', 
    price: 1.20, 
    category: 'Dairy', 
    icon: '🧈',
    description: 'Creamy and rich'
  },
];

const SPECIAL_OFFERS: SpecialOffer[] = [
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
    calculate: (quantity: number) => quantity * 0.55,
  },
  {
    productId: 'butter',
    description: 'Get 33% Off Premium Butter!',
    calculate: (quantity: number, price: number) => quantity * price * (1/3),
  },
];

const CATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.category)));

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateItemSavings = (item: CartItem): number => {
  const offer = SPECIAL_OFFERS.find(o => o.productId === item.id);
  return offer ? offer.calculate(item.quantity, item.price) : 0;
};

const calculateSoupBreadDiscount = (items: CartItem[]): number => {
  const soupItem = items.find(i => i.id === 'soup');
  const breadItem = items.find(i => i.id === 'bread');
  if (!soupItem || !breadItem) return 0;
  const discountedBreadCount = Math.min(soupItem.quantity, breadItem.quantity);
  return discountedBreadCount * 0.55;
};

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemSavings = items.reduce((sum, item) => sum + calculateItemSavings(item), 0);
  const soupBreadDiscount = calculateSoupBreadDiscount(items);
  const totalSavings = itemSavings + soupBreadDiscount;
  const total = subtotal - totalSavings;
  return { subtotal, itemSavings, soupBreadDiscount, totalSavings, total };
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Sidebar Component
const Sidebar: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ selectedCategory, onCategoryChange, isOpen, onClose }) => {
  const categoryIcons: Record<string, string> = {
    'All': '🏪',
    'Bakery': '🍞',
    'Dairy': '🥛',
    'Canned': '🥫',
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white shadow-xl z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Filter size={24} className="text-blue-600" />
            Categories
          </h2>
          <button onClick={onClose} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <button
              onClick={() => {
                onCategoryChange('All');
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{categoryIcons['All']}</span>
              <span className="font-medium flex-1">All Products</span>
              <ChevronRight size={18} />
            </button>

            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Categories
            </div>

            {CATEGORIES.map(category => {
              const count = PRODUCTS.filter(p => p.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{categoryIcons[category]}</span>
                  <div className="flex-1">
                    <div className="font-medium">{category}</div>
                    <div className={`text-xs ${selectedCategory === category ? 'text-blue-100' : 'text-gray-500'}`}>
                      {count} items
                    </div>
                  </div>
                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-sm text-gray-600 mb-2">💡 Shopping Tip</div>
          <div className="text-xs text-gray-500">
            Check our special offers for great savings on your favorite items!
          </div>
        </div>
      </aside>
    </>
  );
};

// Product Card Component
const ProductCard: React.FC<{
  product: Product;
  cartQuantity: number;
  onAdd: () => void;
}> = ({ product, cartQuantity, onAdd }) => {
  const hasOffer = SPECIAL_OFFERS.some(o => o.productId === product.id);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {hasOffer && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold py-1 px-3 flex items-center gap-1">
          <Tag size={12} />
          SPECIAL OFFER
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {product.icon}
          </div>
          {cartQuantity > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse">
              {cartQuantity}
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">£{product.price.toFixed(2)}</div>
            <div className="text-xs text-gray-500">{product.category}</div>
          </div>
          
          <button
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Products Grid Component
const ProductsGrid: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCartQuantity = (productId: string) => {
    const item = state.items.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 overflow-hidden">
        <div className="sticky top-0 bg-white shadow-md z-30 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Package className="text-blue-600" size={28} />
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={getCartQuantity(product.id)}
                  onAdd={() => dispatch({ type: 'ADD_ITEM', payload: product })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Cart Item Component
const CartItemComponent: React.FC<{
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}> = ({ item, onUpdateQuantity, onRemove }) => {
  const savings = calculateItemSavings(item);
  const itemCost = item.price * item.quantity - (item.id === 'soup' ? 0 : savings);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{item.icon}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">£{item.price.toFixed(2)} each</p>
            </div>
            <button
              onClick={onRemove}
              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              title="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold text-gray-800">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="text-right">
              {savings > 0 && (
                <div className="text-xs text-green-600 font-medium mb-1">
                  -£{savings.toFixed(2)} saved
                </div>
              )}
              <div className="text-lg font-bold text-gray-900">
                £{itemCost.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shopping Cart Component
const ShoppingCartComponent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const totals = calculateTotals(state.items);

  const handleCheckout = () => {
    if (state.items.length === 0) return;
    
    alert(`✅ Order placed successfully!\n\nTotal: £${totals.total.toFixed(2)}\nYou saved: £${totals.totalSavings.toFixed(2)}`);
    dispatch({ type: 'CLEAR_CART' });
  };

  if (state.items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart size={28} />
          Shopping Cart
        </h2>
        <p className="text-blue-100 mt-1">{state.items.length} {state.items.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
        {state.items.map(item => (
          <CartItemComponent
            key={item.id}
            item={item}
            onUpdateQuantity={(qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: qty } })}
            onRemove={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
          />
        ))}
      </div>

      {totals.soupBreadDiscount > 0 && (
        <div className="mx-6 mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
            <Tag size={16} />
            Soup Special: Half price bread applied!
          </div>
          <div className="text-xs text-green-600 mt-1">
            Discount: -£{totals.soupBreadDiscount.toFixed(2)}
          </div>
        </div>
      )}

      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-medium">£{totals.subtotal.toFixed(2)}</span>
          </div>
          {totals.totalSavings > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="font-medium">Total Savings:</span>
              <span className="font-bold">-£{totals.totalSavings.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-2 border-t-2 border-gray-300 flex justify-between text-xl font-bold text-gray-900">
            <span>Total:</span>
            <span>£{totals.total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
        >
          <Receipt size={20} />
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

// Special Offers Component
const SpecialOffersComponent: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-lg p-6 border border-green-100">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
        <TrendingUp className="text-green-600" size={28} />
        Special Offers
      </h2>
      <div className="space-y-3">
        {SPECIAL_OFFERS.map((offer, index) => {
          const product = PRODUCTS.find(p => p.id === offer.productId);
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500 flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl">{product?.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 mb-1">{product?.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Tag size={14} className="text-green-600" />
                  {offer.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Statistics Dashboard Component
const StatisticsDashboard: React.FC = () => {
  const { state, purchaseHistory } = useAppContext();
  const totals = calculateTotals(state.items);

  const stats = [
    {
      label: 'Cart Items',
      value: state.items.reduce((sum, item) => sum + item.quantity, 0),
      icon: <ShoppingCart size={24} />,
      color: 'blue',
    },
    {
      label: 'Current Total',
      value: `£${totals.total.toFixed(2)}`,
      icon: <Receipt size={24} />,
      color: 'green',
    },
    {
      label: 'Current Savings',
      value: `£${totals.totalSavings.toFixed(2)}`,
      icon: <Tag size={24} />,
      color: 'red',
    },
    {
      label: 'Total Orders',
      value: purchaseHistory.length,
      icon: <History size={24} />,
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className={`text-${stat.color}-600 mb-2`}>{stat.icon}</div>
          <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
          <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [activeView, setActiveView] = useState<'products' | 'cart' | 'offers'>('products');

  const addToHistory = (purchase: PurchaseHistory) => {
    setPurchaseHistory(prev => [purchase, ...prev]);
  };

  return (
    <AppContext.Provider value={{ state, dispatch, purchaseHistory, addToHistory }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🛒</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Smart Shopping</h1>
                  <p className="text-sm text-gray-600">Save more with every purchase</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('products')}
                  className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                    activeView === 'products'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Package size={18} />
                  Products
                </button>
                <button
                  onClick={() => setActiveView('cart')}
                  className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 relative ${
                    activeView === 'cart'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ShoppingCart size={18} />
                  Cart
                  {state.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveView('offers')}
                  className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                    activeView === 'offers'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp size={18} />
                  Offers
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden mt-4 flex gap-2">
              <button
                onClick={() => setActiveView('products')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'products'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Package size={18} className="inline mr-1" />
                Products
              </button>
              <button
                onClick={() => setActiveView('cart')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all relative ${
                  activeView === 'cart'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <ShoppingCart size={18} className="inline mr-1" />
                Cart
                {state.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveView('offers')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'offers'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <TrendingUp size={18} className="inline mr-1" />
                Offers
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <StatisticsDashboard />

          <div className="mt-6">
            {activeView === 'products' && <ProductsGrid />}
            {activeView === 'cart' && (
              <div className="max-w-2xl mx-auto">
                <ShoppingCartComponent />
              </div>
            )}
            {activeView === 'offers' && (
              <div className="max-w-4xl mx-auto">
                <SpecialOffersComponent />
              </div>
            )}
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
