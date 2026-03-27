import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'ADMIN' };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-md md:hidden text-gray-500 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            {t('nav.dashboard')}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
            title={t('common.logout')}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
