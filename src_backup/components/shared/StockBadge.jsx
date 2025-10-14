import React from 'react';
import { getStockBadgeInfo } from '../../../utils/inventory'; 

const StockBadge = ({ item, className = '' }) => {
  const badgeInfo = getStockBadgeInfo(item);
  
  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'secondary':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'destructive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVariantClasses(badgeInfo?.variant)} ${className}`}
    >
      {badgeInfo?.text}
    </span>
  );
};

export default StockBadge;