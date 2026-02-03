import { useLanguage } from '@/contexts/LanguageContext';

interface Category {
  key: string;
  image: string;
}

// Using shop images for category display
const categories: Category[] = [
  { key: 'category.personal', image: '/shop/WhatsApp Image 2026-02-03 at 8.07.03 PM.jpeg' },
  { key: 'category.pantry', image: '/shop/WhatsApp Image 2026-02-03 at 8.07.04 PM.jpeg' },
  { key: 'category.beverages', image: '/shop/WhatsApp Image 2026-02-03 at 8.07.05 PM.jpeg' },
  { key: 'category.snacks', image: '/shop/WhatsApp Image 2026-02-03 at 8.07.06 PM.jpeg' },
  { key: 'category.household', image: '/shop/WhatsApp Image 2026-02-03 at 8.07.07 PM.jpeg' },
];

const Products = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">{t('products.title')}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <div key={category.key} className="category-card">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={category.image} 
                  alt={t(category.key)}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-3 md:p-4 text-center">
                <h3 className="font-semibold text-sm md:text-base text-foreground">
                  {t(category.key)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
