import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'shop.name': 'Abdul Rasheed Grocery',
    'shop.tagline': 'Your Trusted Neighborhood Grocery in Sayh Mudayrah',
    
    // Contact
    'contact.call': 'Call for Delivery',
    'contact.call.subtitle': 'Nearby Areas',
    'contact.whatsapp': 'WhatsApp Us',
    
    // About
    'about.title': 'About Us',
    'about.text': 'Abdul Rasheed Grocery is a local neighborhood shop providing daily essentials to nearby residents. We offer groceries, personal care items, snacks, beverages, and household products with honest pricing and friendly service, just like a traditional local grocery.',
    
    // Products
    'products.title': 'Our Products',
    'category.personal': 'Personal Care',
    'category.pantry': 'Pantry & Grocery',
    'category.beverages': 'Beverages',
    'category.snacks': 'Snacks',
    'category.household': 'Household Items',
    
    // Gallery
    'gallery.title': 'Inside Our Store',
    'gallery.swipe': 'Swipe or click arrows to browse',
    
    // Location
    'location.title': 'Visit Us',
    'location.address': 'Masfoot, Sheikh Khalifa Hospital A2, Sayh Mudayrah, Ajman, UAE',
    'location.hours': 'Open Daily: 7:00 AM - 11:00 PM',
    
    // Footer
    'footer.rights': 'All rights reserved',
    
    // Toggle
    'toggle.theme': 'Toggle Theme',
    'toggle.language': 'العربية',
  },
  ar: {
    // Header
    'shop.name': 'بقالة عبدالرشيد',
    'shop.tagline': 'بقالتكم الموثوقة في صيح مديّرة',
    
    // Contact
    'contact.call': 'اتصل للتوصيل',
    'contact.call.subtitle': 'المناطق القريبة',
    'contact.whatsapp': 'تواصل معنا عبر واتساب',
    
    // About
    'about.title': 'من نحن',
    'about.text': 'بقالة عبدالرشيد هي بقالة محلية تخدم سكان المنطقة بجميع الاحتياجات اليومية. نوفر المواد الغذائية، منتجات العناية الشخصية، الوجبات الخفيفة، المشروبات، ومستلزمات المنزل بأسعار مناسبة وخدمة ودودة كما هو معروف عن البقالات التقليدية.',
    
    // Products
    'products.title': 'منتجاتنا',
    'category.personal': 'العناية الشخصية',
    'category.pantry': 'المواد الغذائية',
    'category.beverages': 'المشروبات',
    'category.snacks': 'الوجبات الخفيفة',
    'category.household': 'مستلزمات المنزل',
    
    // Gallery
    'gallery.title': 'داخل متجرنا',
    'gallery.swipe': 'اسحب أو اضغط على الأسهم للتصفح',
    
    // Location
    'location.title': 'زورونا',
    'location.address': 'مصفوت، مستشفى الشيخ خليفة A2، صيح مديّرة، عجمان، الإمارات',
    'location.hours': 'مفتوح يومياً: ٧:٠٠ صباحاً - ١١:٠٠ مساءً',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    
    // Toggle
    'toggle.theme': 'تغيير المظهر',
    'toggle.language': 'English',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
