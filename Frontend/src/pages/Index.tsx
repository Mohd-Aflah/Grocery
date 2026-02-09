import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ContactButtons from '@/components/ContactButtons';
import About from '@/components/About';
import Gallery from '@/components/Gallery';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        
        {/* View Products Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse Our Collections</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover our wide range of fresh and quality products. Browse categories, search for specific items, and find exactly what you need.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/products')}
              className="gap-2"
            >
              View All Products
            </Button>
          </div>
        </section>
        
        <Gallery />
        <Location />
      </main>
      <Footer />
      <ContactButtons />
    </div>
  );
};

export default Index;
