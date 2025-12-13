// Main application component - combines all modules

import React, { useState, useReducer } from 'react';
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import AppContext from '../context/AppContext';
import { cartReducer } from '../store/cartReducer';
import { PurchaseHistory } from '../types';
import ProductsGrid from '../components/ProductsGrid';
import ShoppingCartComponent from '../components/ShoppingCart';
import SpecialOffersComponent from '../components/SpecialOffers';
import StatisticsDashboard from '../components/StatisticsDashboard';

const ShoppingCartApp: React.FC = () => {
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

export default ShoppingCartApp;