// Category filtering sidebar with responsive mobile drawer

import React from 'react';
import { Filter, X, ChevronRight } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/products';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onCategoryChange, 
  isOpen, 
  onClose 
}) => {
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

export default Sidebar;