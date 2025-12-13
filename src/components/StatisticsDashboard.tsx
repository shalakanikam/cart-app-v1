// Display shopping statistics and metrics

import React from 'react';
import { ShoppingCart, Receipt, Tag, History } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { calculateTotals } from '../utils/calculations';

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

export default StatisticsDashboard;