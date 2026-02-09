import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { galleryAPI } from '@/lib/api';

interface GalleryImage {
  id: number;
  image_url: string;
  image_name: string;
}

const Products = () => {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await galleryAPI.getAll();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">{t('products.title')}</h2>
          <div className="text-center text-muted-foreground">Loading images...</div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">{t('products.title')}</h2>
          <div className="text-center text-muted-foreground">No gallery images available yet.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">{t('products.title')}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {images.map((image) => (
            <div key={image.id} className="category-card">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image.image_url.startsWith('http') ? image.image_url : `${import.meta.env.VITE_API_BASE_URL}${image.image_url}`}
                  alt={image.image_name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
