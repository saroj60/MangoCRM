import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Map, LayoutDashboard, Receipt, Users, Leaf, TrendingUp } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('nav.gardens'), path: '/gardens', icon: Map },
    { name: t('nav.expenses'), path: '/expenses', icon: Receipt },
    { name: t('nav.suppliers'), path: '/suppliers', icon: Users },
    { name: t('nav.harvests'), path: '/harvests', icon: Leaf },
    { name: t('nav.sales'), path: '/sales', icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm pt-6 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Leaf className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">Mango CRM</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-green-50 hover:text-primary'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
