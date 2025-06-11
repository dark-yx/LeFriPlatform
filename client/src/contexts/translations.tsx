import { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

const translations: Translations = {
  'dashboard.welcome': {
    es: 'Bienvenido',
    en: 'Welcome',
    pt: 'Bem-vindo'
  },
  'dashboard.subtitle': {
    es: 'Tu asistente legal inteligente está listo para ayudarte',
    en: 'Your intelligent legal assistant is ready to help',
    pt: 'Seu assistente jurídico inteligente está pronto para ajudar'
  },
  'nav.consultation': {
    es: 'Consulta',
    en: 'Consultation',
    pt: 'Consulta'
  },
  'nav.processes': {
    es: 'Procesos',
    en: 'Processes',
    pt: 'Processos'
  },
  'nav.emergency': {
    es: 'Emergencia',
    en: 'Emergency',
    pt: 'Emergência'
  },
  'mode.consultation.title': {
    es: 'Modo Consulta',
    en: 'Consultation Mode',
    pt: 'Modo Consulta'
  },
  'mode.consultation.description': {
    es: 'Realiza consultas legales y obtén respuestas contextualizadas por país usando IA avanzada.',
    en: 'Make legal queries and get country-contextualized answers using advanced AI.',
    pt: 'Faça consultas jurídicas e obtenha respostas contextualizadas por país usando IA avançada.'
  },
  'mode.process.title': {
    es: 'Modo Proceso',
    en: 'Process Mode',
    pt: 'Modo Processo'
  },
  'mode.process.description': {
    es: 'Guía paso a paso para procesos legales comunes como divorcios, contratos y demandas.',
    en: 'Step-by-step guide for common legal processes like divorce, contracts and lawsuits.',
    pt: 'Guia passo a passo para processos jurídicos comuns como divórcio, contratos e ações judiciais.'
  },
  'mode.emergency.title': {
    es: 'Modo Emergencia',
    en: 'Emergency Mode',
    pt: 'Modo Emergência'
  },
  'mode.emergency.description': {
    es: 'Sistema de alertas automáticas vía WhatsApp a tus contactos de emergencia.',
    en: 'Automatic alert system via WhatsApp to your emergency contacts.',
    pt: 'Sistema de alertas automáticos via WhatsApp para seus contatos de emergência.'
  },
  'button.start.consultation': {
    es: 'Iniciar consulta',
    en: 'Start consultation',
    pt: 'Iniciar consulta'
  },
  'button.view.processes': {
    es: 'Ver procesos',
    en: 'View processes',
    pt: 'Ver processos'
  },
  'button.configure.alerts': {
    es: 'Configurar alertas',
    en: 'Configure alerts',
    pt: 'Configurar alertas'
  }
};

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'es',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('language') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['es'] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};