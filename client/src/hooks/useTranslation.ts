import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  const changeLanguage = (language: string) => {
    return i18n.changeLanguage(language);
  };

  const currentLanguage = i18n.language;

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage,
  };
};

export default useTranslation;
