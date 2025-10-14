import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const RevenueTracking = ({ className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const revenueData = {
    daily: {
      current: 450.00,
      previous: 380.00,
      trend: 'up',
      trendValue: '+18.4%',
      currency: 'USD',
      vesEquivalent: '16,425.00',
      transactions: 8,
      breakdown: [
        { type: 'Consultas', amount: 320.00, count: 6 },
        { type: 'Procedimientos', amount: 130.00, count: 2 }
      ]
    },
    weekly: {
      current: 2850.00,
      previous: 2640.00,
      trend: 'up',
      trendValue: '+8.0%',
      currency: 'USD',
      vesEquivalent: '104,025.00',
      transactions: 42,
      breakdown: [
        { type: 'Consultas', amount: 2100.00, count: 35 },
        { type: 'Procedimientos', amount: 750.00, count: 7 }
      ]
    },
    monthly: {
      current: 12400.00,
      previous: 11200.00,
      trend: 'up',
      trendValue: '+10.7%',
      currency: 'USD',
      vesEquivalent: '452,600.00',
      transactions: 186,
      breakdown: [
        { type: 'Consultas', amount: 8900.00, count: 148 },
        { type: 'Procedimientos', amount: 3500.00, count: 38 }
      ]
    }
  };

  const currentData = revenueData?.[selectedPeriod];

  const periods = [
    { key: 'daily', label: 'Diario', icon: 'Calendar' },
    { key: 'weekly', label: 'Semanal', icon: 'CalendarDays' },
    { key: 'monthly', label: 'Mensual', icon: 'CalendarRange' }
  ];

  const getTrendIcon = () => {
    return currentData?.trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = () => {
    return currentData?.trend === 'up' ? 'text-success' : 'text-error';
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Seguimiento de Ingresos</h2>
          <Button 
            variant="ghost" 
            size="sm"
            iconName="DollarSign"
            onClick={() => window.location.href = '/payment-processing'}
          >
            Ver Finanzas
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Period Selector */}
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <Button
              key={period?.key}
              variant={selectedPeriod === period?.key ? 'default' : 'ghost'}
              size="sm"
              iconName={period?.icon}
              iconPosition="left"
              onClick={() => setSelectedPeriod(period?.key)}
            >
              {period?.label}
            </Button>
          ))}
        </div>

        {/* Revenue Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Ingresos {periods?.find(p => p?.key === selectedPeriod)?.label?.toLowerCase()}
              </p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-foreground">
                  ${currentData?.current?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-sm text-muted-foreground">
                  (~{currentData?.vesEquivalent} VES)
                </span>
              </div>
            </div>
            
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              <Icon name={getTrendIcon()} size={20} />
              <span className="text-lg font-semibold">{currentData?.trendValue}</span>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Receipt" size={16} />
            <span>{currentData?.transactions} transacciones</span>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Desglose por Tipo</h3>
          {currentData?.breakdown?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon 
                    name={item?.type === 'Consultas' ? 'Stethoscope' : 'Activity'} 
                    size={16} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item?.type}</p>
                  <p className="text-sm text-muted-foreground">{item?.count} servicios</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  ${item?.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {((item?.amount / currentData?.current) * 100)?.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              iconPosition="left"
              onClick={() => window.location.href = '/payment-processing?view=reports'}
              fullWidth
            >
              Reportes
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => {
                // Mock export functionality
                const data = `Reporte de Ingresos ${periods?.find(p => p?.key === selectedPeriod)?.label}\nTotal: $${currentData?.current}\nTransacciones: ${currentData?.transactions}`;
                const blob = new Blob([data], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ingresos-${selectedPeriod}-${new Date()?.toISOString()?.split('T')?.[0]}.txt`;
                a?.click();
                URL.revokeObjectURL(url);
              }}
              fullWidth
            >
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTracking;