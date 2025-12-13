// Individual cart item with quantity controls and savings display

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { calculateItemSavings } from '../utils/calculations';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}) => {
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

export default CartItemComponent;