import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">{t('shop.name')}</h3>
          <p className="text-sm opacity-90 mb-4">{t('shop.tagline')}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm opacity-80">
            <span>{t('location.hours')}</span>
            <span className="hidden sm:inline">•</span>
            <span>📞 048522105</span>
          </div>
          
          <div className="mt-6 pt-4 border-t border-primary-foreground/20">
            <p className="text-sm opacity-70">
              © {currentYear} {t('shop.name')}. {t('footer.rights')}.
            </p>
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed contact buttons */}
      <div className="h-24 md:h-0" />
    </footer>
  );
};

export default Footer;
