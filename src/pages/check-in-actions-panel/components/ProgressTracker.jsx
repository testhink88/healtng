import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTracker = ({ appointment, consultationTime }) => {
  if (!appointment || !appointment?.duration) return null;

  const totalSeconds = appointment?.duration * 60;
  const progress = Math.min((consultationTime / totalSeconds) * 100, 100);
  const isOvertime = consultationTime > totalSeconds;

  const getProgressColor = () => {
    if (isOvertime) return 'bg-error';
    if (progress > 80) return 'bg-warning';
    return 'bg-primary';
  };

  const getProgressLabel = () => {
    if (isOvertime) {
      const overtimeSeconds = consultationTime - totalSeconds;
      const overtimeMinutes = Math.floor(overtimeSeconds / 60);
      const overtimeSecs = overtimeSeconds % 60;
      return `+${overtimeMinutes}:${overtimeSecs?.toString()?.padStart(2, '0')} excedido`;
    }
    return `${Math.round(progress)}% completado`;
  };

  const milestones = [
    { label: 'Inicio', time: 0, icon: 'Play', completed: true },
    { 
      label: 'Medio', 
      time: totalSeconds / 2, 
      icon: 'Clock', 
      completed: consultationTime >= totalSeconds / 2 
    },
    { 
      label: 'Finalización', 
      time: totalSeconds, 
      icon: 'CheckCircle', 
      completed: consultationTime >= totalSeconds 
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-medium text-foreground">
          Progreso de Consulta
        </h5>
        <span className={`text-xs font-medium ${
          isOvertime ? 'text-error' : 'text-muted-foreground'
        }`}>
          {getProgressLabel()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {/* Overtime indicator */}
        {isOvertime && (
          <div className="absolute inset-0 bg-error/20 rounded-full animate-pulse" />
        )}
      </div>

      {/* Milestones */}
      <div className="flex justify-between items-center">
        {milestones?.map((milestone, index) => (
          <div 
            key={index}
            className="flex flex-col items-center space-y-1"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              milestone?.completed 
                ? 'bg-primary text-white' :'bg-muted/30 text-muted-foreground'
            }`}>
              <Icon name={milestone?.icon} size={12} />
            </div>
            <span className={`text-xs ${
              milestone?.completed 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground'
            }`}>
              {milestone?.label}
            </span>
          </div>
        ))}
      </div>

      {/* Time Indicators */}
      <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border">
        <span>0 min</span>
        <span>{appointment?.duration / 2} min</span>
        <span>{appointment?.duration} min</span>
      </div>
    </div>
  );
};

export default ProgressTracker;