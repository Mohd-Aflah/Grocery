import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MessageCircle } from 'lucide-react';

const ContactButtons = () => {
  const { t, isRTL } = useLanguage();

  const handleCall = () => {
    window.location.href = 'tel:048522105';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello! I would like to inquire about your products.');
    window.open(`https://wa.me/971505936217?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:bottom-6 md:left-auto md:right-6">
      <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        {/* Call Button */}
        <button
          onClick={handleCall}
          className="contact-btn call-btn flex-1 sm:flex-none"
        >
          <Phone className="w-5 h-5" />
          <div className="text-start">
            <span className="block text-sm font-semibold">{t('contact.call')}</span>
            <span className="block text-xs opacity-90">{t('contact.call.subtitle')}</span>
          </div>
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="contact-btn whatsapp-btn flex-1 sm:flex-none"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">{t('contact.whatsapp')}</span>
        </button>
      </div>
    </div>
  );
};

export default ContactButtons;
