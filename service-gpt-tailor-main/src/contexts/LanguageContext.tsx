import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ru';

type Translations = {
  [key in Language]: {
    welcome: string;
    subtitle: string;
    register: string;
    email: string;
    password: string;
    companyName: string;
    services: string;
    contactPhone: string;
    redirectInfo: string;
    registering: string;
    serviceDescription: string;
    redirectDescription: string;
    testSupport: string;
    testSupportDescription: string;
    thinking: string;
    typeMessage: string;
    login: string;
    loginDescription: string;
    alreadyHaveAccount: string;  // Added this line
  };
};

const translations: Translations = {
  en: {
    welcome: "Welcome to SmartSupport",
    subtitle: "Empower your business with AI-driven customer support",
    register: "Register",
    email: "Email",
    password: "Password",
    companyName: "Company Name",
    services: "Services Provided",
    contactPhone: "Contact Phone",
    redirectInfo: "Redirect Information",
    registering: "Registering...",
    serviceDescription: "Describe the services you provide",
    redirectDescription: "Where should clients be redirected? (e.g., website, booking page)",
    testSupport: "Test Your AI Support",
    testSupportDescription: "Test how your AI assistant will respond to customer inquiries",
    thinking: "Thinking",
    typeMessage: "Type your message...",
    login: "Login to SmartSupport",
    loginDescription: "Access your AI-powered customer support dashboard",
    alreadyHaveAccount: "Already have an account?",  // Added this line
  },
  ru: {
    welcome: "Добро пожаловать в SmartSupport",
    subtitle: "Расширьте возможности вашего бизнеса с поддержкой на базе ИИ",
    register: "Регистрация",
    email: "Электронная почта",
    password: "Пароль",
    companyName: "Название компании",
    services: "Предоставляемые услуги",
    contactPhone: "Контактный телефон",
    redirectInfo: "Информация для перенаправления",
    registering: "Регистрация...",
    serviceDescription: "Опишите предоставляемые вами услуги",
    redirectDescription: "Куда следует перенаправлять клиентов? (например, веб-сайт, страница бронирования)",
    testSupport: "Тестирование ИИ-поддержки",
    testSupportDescription: "Протестируйте, как ваш ИИ-ассистент будет отвечать на запросы клиентов",
    thinking: "Думаю",
    typeMessage: "Введите ваше сообщение...",
    login: "Вход в SmartSupport",
    loginDescription: "Доступ к панели поддержки клиентов на базе ИИ",
    alreadyHaveAccount: "Уже есть аккаунт?",  // Added this line
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations.en) => translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
