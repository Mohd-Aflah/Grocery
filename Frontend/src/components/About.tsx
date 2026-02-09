import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">{t('about.title')}</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/Contact.jpeg" 
              alt="Abdul Rasheed Grocery" 
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
          
          {/* Text */}
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.text')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
