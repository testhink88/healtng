import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const HealthGreeting = ({ className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherInfo] = useState({
    temperature: 28,
    condition: 'sunny',
    humidity: 65
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getHealthTip = () => {
    const tips = [
      "Recuerda tomar al menos 8 vasos de agua hoy",
      "Una caminata de 30 minutos puede mejorar tu salud cardiovascular",
      "Mantén una postura correcta mientras trabajas",
      "Toma descansos regulares para cuidar tu vista",
      "Una alimentación balanceada es clave para tu bienestar"
    ];
    
    const dayOfYear = Math.floor((currentTime - new Date(currentTime.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return tips?.[dayOfYear % tips?.length];
  };

  const getWeatherIcon = () => {
    switch (weatherInfo?.condition) {
      case 'sunny': return 'Sun';
      case 'cloudy': return 'Cloud';
      case 'rainy': return 'CloudRain';
      default: return 'Sun';
    }
  };

  return (
    <div className={`bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">
            {getGreeting()}, María
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            {currentTime?.toLocaleDateString('es-VE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Icon name={getWeatherIcon()} size={20} color="white" />
              <span className="text-lg font-semibold">{weatherInfo?.temperature}°C</span>
            </div>
            <p className="text-xs text-primary-foreground/70">Caracas</p>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-subtle">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Heart" size={16} color="white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Consejo de Salud del Día</h3>
            <p className="text-sm text-primary-foreground/90 leading-relaxed">
              {getHealthTip()}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="Activity" size={14} color="white" />
            <span>Última consulta: 15 Ago</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} color="white" />
            <span>Próxima cita: 18 Ago</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-xs">Estado: Saludable</span>
        </div>
      </div>
    </div>
  );
};

export default HealthGreeting;