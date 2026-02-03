import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-grocery.jpg';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-8 md:pb-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
            {t('shop.name')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {t('shop.tagline')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
