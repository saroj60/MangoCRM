import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lng', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground rounded-lg transition-colors cursor-pointer font-medium"
      title="Toggle Language"
    >
      <Languages size={20} className="text-primary" />
      <span className="hidden sm:inline">{i18n.language === 'en' ? 'नेपाली' : 'English'}</span>
    </button>
  );
};

export default LanguageSwitcher;
