import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { galleryAPI } from '@/lib/api';

interface GalleryImage {
  id: number;
  image_url: string;
  image_name: string;
  cloudinary_public_id: string;
  created_at: string;
}

const Gallery = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);
        const data = await galleryAPI.getAll();
        setImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const imageWidth = scrollRef.current.querySelector('div')?.offsetWidth || 0;
      const gap = 16; // 1rem gap
      const scrollAmount = imageWidth + gap;
      
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll functionality with smoother animation
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current && !isPaused) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // If we've reached the end, scroll back to start
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll one image at a time
          const imageWidth = scrollRef.current.querySelector('div')?.offsetWidth || 0;
          const gap = 16;
          const scrollAmount = imageWidth + gap;
          
          scrollRef.current.scrollTo({
            left: scrollRef.current.scrollLeft + scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-8">{t('gallery.title')}</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('gallery.noImages') || 'No gallery images available'}</p>
          </div>
        ) : (
          <div 
            className="relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background p-3 rounded-full shadow-lg transition-all duration-300 ${
                canScrollLeft ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Previous images"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex-shrink-0 w-[280px] md:w-[380px] snap-center"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src={image.image_url}
                      alt={image.image_name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background p-3 rounded-full shadow-lg transition-all duration-300 ${
                canScrollRight ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Next images"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Scroll Indicator */}
        {images.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {t('gallery.swipe')}
          </p>
        )}
      </div>
    </section>
  );
};

export default Gallery;
