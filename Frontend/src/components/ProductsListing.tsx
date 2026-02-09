import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, ShoppingCart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { productsAPI, categoriesAPI } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name: string;
  image_url: string;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getAll(undefined, true),
        categoriesAPI.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category_id === parseInt(selectedCategory));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-gray-600 text-lg">Fresh groceries and essentials available</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Category Filter */}
        <div className="mb-8 max-w-xs">
          <label className="text-sm font-medium mb-2 block">Filter by Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardContent>
              <p className="text-gray-600 mb-4">No products found in this category.</p>
              <Button 
                onClick={() => setSelectedCategory('all')}
                variant="outline"
              >
                View All Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_BASE_URL}${product.image_url}`} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category_name}
                  </div>
                </div>

                {/* Product Info */}
                <CardHeader className="pb-3 flex-grow">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  {product.description && (
                    <CardDescription className="line-clamp-2 text-sm">
                      {product.description}
                    </CardDescription>
                  )}
                </CardHeader>

                {/* Footer */}
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-600">
                    {product.category_name}
                  </div>
                  
                  <Button 
                    className="w-full mt-4 gap-2" 
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{filteredProducts.length}</div>
            <div className="text-gray-600 text-sm">Products Available</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-gray-600 text-sm">Categories</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">100%</div>
            <div className="text-gray-600 text-sm">Fresh Quality</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">24/7</div>
            <div className="text-gray-600 text-sm">Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}
