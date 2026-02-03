import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ContactButtons from '@/components/ContactButtons';
import About from '@/components/About';
import Products from '@/components/Products';
import Location from '@/components/Location';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Products />
        <Location />
      </main>
      <Footer />
      <ContactButtons />
    </div>
  );
};

export default Index;
