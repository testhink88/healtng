import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PrescriptionTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    {
      key: 'issued',
      label: 'Emitidas',
      icon: 'FileText',
      count: counts?.issued,
      description: 'Recetas activas listas para dispensar'
    },
    {
      key: 'dispensed',
      label: 'Dispensadas',
      icon: 'CheckCircle',
      count: counts?.dispensed,
      description: 'Medicamentos ya retirados'
    },
    {
      key: 'expired',
      label: 'Expiradas',
      icon: 'Clock',
      count: counts?.expired,
      description: 'Recetas vencidas'
    }
  ];

  return (
    <div className="mb-6">
      {/* Desktop Tabs */}
      <div className="hidden md:flex bg-card border border-border rounded-lg p-1">
        {tabs?.map((tab) => (
          <Button
            key={tab?.key}
            variant={activeTab === tab?.key ? "default" : "ghost"}
            onClick={() => onTabChange(tab?.key)}
            className={`flex-1 justify-start px-4 py-3 h-auto ${
              activeTab === tab?.key ? '' : 'hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeTab === tab?.key 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-muted'
              }`}>
                <Icon 
                  name={tab?.icon} 
                  size={16} 
                  color={activeTab === tab?.key ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)'}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{tab?.label}</span>
                  {tab?.count > 0 && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activeTab === tab?.key
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {tab?.count}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${
                  activeTab === tab?.key 
                    ? 'text-primary-foreground/80' 
                    : 'text-muted-foreground'
                }`}>
                  {tab?.description}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
      {/* Mobile Tabs */}
      <div className="md:hidden">
        <div className="flex bg-card border border-border rounded-lg overflow-hidden">
          {tabs?.map((tab) => (
            <Button
              key={tab?.key}
              variant={activeTab === tab?.key ? "default" : "ghost"}
              onClick={() => onTabChange(tab?.key)}
              className={`flex-1 flex-col py-3 px-2 h-auto rounded-none ${
                activeTab === tab?.key ? '' : 'hover:bg-muted/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                activeTab === tab?.key 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-muted'
              }`}>
                <Icon 
                  name={tab?.icon} 
                  size={16} 
                  color={activeTab === tab?.key ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)'}
                />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm font-medium">{tab?.label}</span>
                  {tab?.count > 0 && (
                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                      activeTab === tab?.key
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {tab?.count}
                    </span>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTabs;