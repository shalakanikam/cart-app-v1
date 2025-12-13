// Individual product card with special offer badges

import React from 'react';
import { Plus, Tag } from 'lucide-react';
import { Product } from '../types';
import { SPECIAL_OFFERS } from '../data/specialOffers';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  cartQuantity, 
  onAdd 
}) => {
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

export default ProductCard;