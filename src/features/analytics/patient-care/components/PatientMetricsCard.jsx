import React from 'react';
import Icon from '../../../components/AppIcon';

const COLOR_MAP = {
  'clinical-blue': {
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    accentText: 'text-primary',
    ring: 'ring-primary/30'
  },
  'medical-green': {
    iconBg: 'bg-success/10',
    iconText: 'text-success',
    accentText: 'text-success',
    ring: 'ring-success/30'
  },
  'accent': {
    iconBg: 'bg-accent/20',
    iconText: 'text-accent-foreground',
    accentText: 'text-foreground',
    ring: 'ring-border'
  },
  'warning': {
    iconBg: 'bg-warning/10',
    iconText: 'text-warning',
    accentText: 'text-warning',
    ring: 'ring-warning/30'
  },
  'primary': {
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    accentText: 'text-primary',
    ring: 'ring-primary/30'
  },
  'success': {
    iconBg: 'bg-success/10',
    iconText: 'text-success',
    accentText: 'text-success',
    ring: 'ring-success/30'
  }
};

const PatientMetricsCard = ({
  title,
  value,
  percentage,
  trend = 'stable', // up | down | stable
  icon = 'Activity',
  color = 'primary',
  threshold
}) => {
  const styles = COLOR_MAP[color] || COLOR_MAP.primary;

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const evaluateThreshold = () => {
    if (!threshold || !value) return null;

    // Intento simple de extraer número desde strings como "4.7/5.0", "89.2%", "8.3%"
    const numeric = (() => {
      const raw = String(value);
      const maybe = raw.match(/[\d.]+/);
      return maybe ? Number(maybe[0]) : null;
    })();

    if (numeric == null) return null;

    const { good, warning } = threshold;

    // Heurística:
    // - Si good > warning, asumimos "más alto es mejor"
    // - Si good < warning, asumimos "más bajo es mejor"
    const higherIsBetter = good > warning;

    if (higherIsBetter) {
      if (numeric >= good) return 'good';
      if (numeric >= warning) return 'warning';
      return 'risk';
    } else {
      if (numeric <= good) return 'good';
      if (numeric <= warning) return 'warning';
      return 'risk';
    }
  };

  const status = evaluateThreshold();

  const statusBadge = () => {
    if (!status) return null;
    const map = {
      good: { label: 'Óptimo', dot: 'bg-success', text: 'text-success' },
      warning: { label: 'Vigilancia', dot: 'bg-warning', text: 'text-warning' },
      risk: { label: 'Riesgo', dot: 'bg-error', text: 'text-error' }
    };
    const s = map[status];
    return (
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
      </div>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 healthcare-shadow clinical-transition hover:healthcare-shadow-md`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${styles.iconBg}`}>
            <Icon name={icon} size={20} className={styles.iconText} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {status && <div className="mt-1">{statusBadge()}</div>}
          </div>
        </div>

        <div className={`px-2 py-1 rounded-full text-xs border border-border bg-muted`}>
          <span className="text-muted-foreground">Clinical KPI</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>

        {(percentage || trend) && (
          <div className="flex items-center gap-1">
            <Icon name={getTrendIcon()} size={14} className={getTrendColor()} />
            {percentage && (
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {percentage}
              </span>
            )}
            <span className="text-xs text-muted-foreground">vs periodo anterior</span>
          </div>
        )}

        {/* Micro-indicador visual suave */}
        <div className="pt-2">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`${status === 'good' ? 'bg-success' : status === 'warning' ? 'bg-warning' : status === 'risk' ? 'bg-error' : 'bg-primary'} h-full`}
              style={{ width: status === 'good' ? '85%' : status === 'warning' ? '60%' : status === 'risk' ? '35%' : '70%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMetricsCard;
