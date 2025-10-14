import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const LanguageToggle = () => {
  const [currentLanguage, setCurrentLanguage] = useState('es');

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('preferred-language') || 'es';
    setCurrentLanguage(savedLanguage);
  }, []);

  const languages = [
    {
      code: 'es',
      name: 'Español',
      flag: '🇻🇪',
      nativeName: 'Español'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸',
      nativeName: 'English'
    }
  ];

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferred-language', languageCode);
    
    // In a real app, this would trigger a language change throughout the application
    // For now, we'll just update the local state
    console.log(`Language changed to: ${languageCode}`);
  };

  const getCurrentLanguage = () => {
    return languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];
  };

  const getOtherLanguage = () => {
    return languages?.find(lang => lang?.code !== currentLanguage) || languages?.[1];
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Current Language Display */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-card rounded-lg border border-border">
        <span className="text-lg">{getCurrentLanguage()?.flag}</span>
        <span className="text-sm font-medium text-foreground">
          {getCurrentLanguage()?.nativeName}
        </span>
      </div>
      {/* Language Switch Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleLanguageChange(getOtherLanguage()?.code)}
        className="flex items-center space-x-2"
      >
        <Icon name="Languages" size={16} />
        <span className="text-sm">{getOtherLanguage()?.flag}</span>
        <span className="text-sm">{getOtherLanguage()?.nativeName}</span>
      </Button>
      {/* Language Info */}
      <div className="hidden md:block">
        <p className="text-xs text-muted-foreground">
          {currentLanguage === 'es' ?'Cambia el idioma de la plataforma' :'Change platform language'
          }
        </p>
      </div>
    </div>
  );
};

export default LanguageToggle;