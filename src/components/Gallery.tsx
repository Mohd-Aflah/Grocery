import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Gallery = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // All shop images
  const images = [
    '/shop/WhatsApp Image 2026-02-03 at 8.07.03 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.04 PM (1).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.04 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.05 PM (1).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.05 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.06 PM (1).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.06 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.07 PM (1).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.07 PM (2).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.07 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.08 PM (1).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.08 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.09 PM (1).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.09 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.10 PM (1).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.10 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.11 PM (1).jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.11 PM.jpeg',
    '/shop/WhatsApp Image 2026-02-03 at 8.07.12 PM.jpeg',
  ];

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
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] md:w-[380px] snap-center"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={image}
                    alt={`Shop interior ${index + 1}`}
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

        {/* Scroll Indicator */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          {t('gallery.swipe')}
        </p>
      </div>
    </section>
  );
};

export default Gallery;
