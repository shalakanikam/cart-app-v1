// Main shopping cart view with totals and checkout

import React from 'react';
import { ShoppingCart, Receipt, Tag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { calculateTotals } from '../utils/calculations';
import CartItemComponent from './CartItem';

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

export default ShoppingCartComponent;