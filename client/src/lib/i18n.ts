import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Importando as traduções
import ptBR from '../locales/pt-BR/translation.json';

// Recursos de tradução
const resources = {
  'pt-BR': {
    translation: ptBR
  }
} as const;

i18n
  // Usa o detector de idioma do navegador
  .use(LanguageDetector)
  // Passa a instância do i18n para o react-i18next
  .use(initReactI18next)
  // Inicializa o i18next
  .init({
    resources,
    fallbackLng: 'pt-BR',
    debug: false,
    interpolation: {
      escapeValue: false, // Não é necessário para React
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
