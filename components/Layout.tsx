
import React from 'react';
import { UserCog, Layout as LayoutIcon, Menu } from 'lucide-react';
import { APP_LOGO_URL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'builder' | 'manage';
  onTabChange: (tab: 'builder' | 'manage') => void;
  onToggleMobileSidebar?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onToggleMobileSidebar }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-aduane-navy text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             {/* Mobile Menu Button (Builder Mode Only) */}
             {activeTab === 'builder' && onToggleMobileSidebar && (
               <button 
                 onClick={onToggleMobileSidebar}
                 className="lg:hidden p-2 text-white hover:bg-aduane-navyDark rounded-lg transition-colors"
                 title="Mostrar Plantel"
               >
                 <Menu size={24} />
               </button>
             )}

             {/* Logo - Hidden on mobile if in Builder mode (to make room/reduce clutter), shown otherwise */}
             <div className={`h-10 ${activeTab === 'builder' ? 'hidden lg:block' : 'block'}`}>
               <img src={APP_LOGO_URL} alt="Aduane Sports" className="h-full w-auto object-contain" />
             </div>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('builder')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'builder' 
                  ? 'bg-aduane-gold text-aduane-navy font-bold' 
                  : 'text-gray-300 hover:bg-aduane-navyDark hover:text-white'
              }`}
            >
              <LayoutIcon size={18} className="mr-2" />
              <span className="hidden md:inline">Construtor</span>
              <span className="md:hidden">Tática</span>
            </button>
            <button
              onClick={() => onTabChange('manage')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'manage' 
                  ? 'bg-aduane-gold text-aduane-navy font-bold' 
                  : 'text-gray-300 hover:bg-aduane-navyDark hover:text-white'
              }`}
            >
              <UserCog size={18} className="mr-2" />
              <span className="hidden md:inline">Gestor de Equipa</span>
              <span className="md:hidden">Gestor</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
