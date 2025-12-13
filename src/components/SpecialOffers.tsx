// Display all active special offers and promotions

import React from 'react';
import { TrendingUp, Tag } from 'lucide-react';
import { SPECIAL_OFFERS } from '../data/specialOffers'
import { PRODUCTS } from '../data/products';

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

export default SpecialOffersComponent;