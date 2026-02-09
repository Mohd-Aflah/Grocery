import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Clock } from 'lucide-react';

const Location = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">{t('location.title')}</h2>
        
        <div className="max-w-4xl mx-auto">
          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {/* Address */}
            <div className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border">
              <div className="p-2 rounded-lg grocery-gradient">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {t('location.title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('location.address')}
                </p>
              </div>
            </div>
            
            {/* Hours */}
            <div className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border">
              <div className="p-2 rounded-lg grocery-gradient">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {t('location.hours').split(':')[0]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  7:00 AM - 11:00 PM
                </p>
              </div>
            </div>
          </div>
          
          {/* Map Embed */}
          <div className="rounded-xl overflow-hidden shadow-lg border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.0!2d56.0!3d25.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zUjNDRytDUCwgU2F5aCBNdWRheXJhaCwgQWptYW4!5e0!3m2!1sen!2sae!4v1234567890"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Abdul Rasheed Grocery Location"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
