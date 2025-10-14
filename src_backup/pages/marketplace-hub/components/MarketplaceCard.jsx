import React from 'react';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import Icon from '@/components/AppIcon';


const MarketplaceCard = ({
  type,
  title,
  subtitle,
  description,
  features = [],
  primaryAction,
  secondaryAction,
  stats = [],
  icon: Icon,
  gradient = "from-blue-500 to-purple-500",
  isRecommended = false
}) => {
  return (
    <div className="relative">
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
            <Star className="h-4 w-4 fill-current" />
            Recomendado
          </div>
        </div>
      )}

      <div className={`
        relative overflow-hidden rounded-2xl border border-border/50 bg-card
        hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group
        ${isRecommended ? 'ring-2 ring-primary/20' : ''}
      `}>
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        
        <div className="relative p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-1">
                  {title}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>

          {/* Features */}
          <div className="mb-6">
            <ul className="space-y-2">
              {features?.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          {stats?.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
              {stats?.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-bold text-foreground text-lg">
                    {stat?.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat?.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={primaryAction?.onClick}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-3 
                bg-gradient-to-r ${gradient} text-white font-medium rounded-xl
                hover:shadow-lg transform hover:scale-105 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary/50
              `}
            >
              {primaryAction?.label}
              <ArrowRight className="h-4 w-4" />
            </button>
            
            {secondaryAction && (
              <button
                onClick={secondaryAction?.onClick}
                className="
                  flex-1 flex items-center justify-center gap-2 px-6 py-3
                  border border-border bg-background text-foreground font-medium rounded-xl
                  hover:bg-muted/50 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                "
              >
                {secondaryAction?.label}
              </button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              Seguro y confiable
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Atención 24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;