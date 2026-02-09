import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Globe, LogIn, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t, toggleLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full grocery-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                {isRTL ? 'ع' : 'A'}
              </span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                {t('shop.name')}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                {t('shop.tagline')}
              </p>
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center gap-2">
            {/* View Products Button */}
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium"
              aria-label="View Products"
              title="View Products"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </button>

            {/* Admin Button */}
            <button
              onClick={() => navigate('/admin/login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
              aria-label="Admin Login"
              title="Owner Login"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
              aria-label="Toggle Language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{t('toggle.language')}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              aria-label={t('toggle.theme')}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
