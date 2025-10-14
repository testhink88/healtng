import React from 'react';
import Icon from '@/components/AppIcon';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  color = 'primary',
  currency = false,
  vesValue = null,
  className = '' 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10',
          icon: 'text-success',
          trend: trend === 'up' ? 'text-success' : 'text-error'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          icon: 'text-warning',
          trend: trend === 'up' ? 'text-success' : 'text-error'
        };
      case 'error':
        return {
          bg: 'bg-error/10',
          icon: 'text-error',
          trend: trend === 'up' ? 'text-success' : 'text-error'
        };
      default:
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          trend: trend === 'up' ? 'text-success' : 'text-error'
        };
    }
  };

  const colors = getColorClasses();

  const getTrendIcon = () => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colors?.bg} flex items-center justify-center`}>
          <Icon name={icon} size={24} className={colors?.icon} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 ${colors?.trend}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-foreground">
            {currency && '$'}{value}
          </p>
          {vesValue && (
            <span className="text-sm text-muted-foreground">
              (~{vesValue} VES)
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default KPICard;