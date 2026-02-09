import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Plus, Edit2, Trash2, LogOut, SearchIcon, Upload, X } from 'lucide-react';
import { productsAPI, categoriesAPI, galleryAPI } from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name: string;
  image_url: string;
  image_name: string;
  is_active: boolean;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface GalleryImage {
  id: number;
  image_url: string;
  image_name: string;
  cloudinary_public_id: string;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [categorySortOrder, setCategorySortOrder] = useState<'asc' | 'desc'>('asc');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category_id: '',
    image: null as File | null
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, galleryData] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        galleryAPI.getAll()
      ]);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setGalleryImages(Array.isArray(galleryData) ? galleryData : []);
      setSelectedGalleryImages(new Set());
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductForm(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('category_id', productForm.category_id);
      if (productForm.image) {
        formData.append('image', productForm.image);
      }

      let response;
      if (editingProduct) {
        response = await productsAPI.update(editingProduct.id, formData);
      } else {
        response = await productsAPI.create(formData);
      }

      if (response.id || response.product) {
        setSuccess(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setProductForm({ name: '', description: '', category_id: '', image: null });
        setEditingProduct(null);
        setShowProductDialog(false);
        await fetchData();
      } else {
        setError(response.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category_id: product.category_id.toString(),
      image: null
    });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await productsAPI.delete(id);
      if (response.message) {
        setSuccess('Product deleted successfully!');
        await fetchData();
      } else {
        setError(response.message || 'Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await categoriesAPI.create(categoryForm.name, categoryForm.description);
      if (response.id) {
        setSuccess('Category added successfully!');
        setCategoryForm({ name: '', description: '' });
        setShowCategoryDialog(false);
        await fetchData();
      } else {
        setError(response.message || 'Failed to add category');
      }
    } catch (err) {
      setError('Error adding category');
    } finally {
      setLoading(false);
    }
  };

  // Gallery Image Handlers
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(Array.from(e.target.files));
    }
  };

  const handleUploadGalleryImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (galleryFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (galleryFiles.length === 1) {
        response = await galleryAPI.upload(galleryFiles[0]);
      } else {
        response = await galleryAPI.uploadMultiple(galleryFiles);
      }

      if (response.success) {
        setSuccess(`Successfully uploaded ${response.uploadedCount || 1} image(s)!`);
        setGalleryFiles([]);
        setShowGalleryDialog(false);
        await fetchData();
      } else {
        setError(response.message || 'Failed to upload images');
      }
    } catch (err) {
      setError('Error uploading images');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGalleryImage = (id: number) => {
    const newSelected = new Set(selectedGalleryImages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedGalleryImages(newSelected);
  };

  const handleDeleteGalleryImage = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await galleryAPI.delete(id);
      if (response.success) {
        setSuccess('Image deleted successfully!');
        await fetchData();
      } else {
        setError(response.message || 'Failed to delete image');
      }
    } catch (err) {
      setError('Error deleting image');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDeleteGalleryImages = async () => {
    if (selectedGalleryImages.size === 0) {
      setError('Please select at least one image');
      return;
    }

    if (!window.confirm(`Delete ${selectedGalleryImages.size} image(s)?`)) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await galleryAPI.deleteMultiple(Array.from(selectedGalleryImages));
      if (response.success) {
        setSuccess(`Deleted ${response.deletedCount} image(s) successfully!`);
        setSelectedGalleryImages(new Set());
        await fetchData();
      } else {
        setError(response.message || 'Failed to delete images');
      }
    } catch (err) {
      setError('Error deleting images');
    } finally {
      setLoading(false);
    }
  };

  // Get products for selected category
  const categoryProducts = selectedCategoryId
    ? products.filter(p => p.category_id === selectedCategoryId)
    : [];

  const filteredCategoryProducts = categoryProducts
    .filter(product => 
      product.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      product.description.toLowerCase().includes(categorySearch.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return categorySortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your store products and categories</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Product Management Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="flex gap-2">
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Category Name</label>
                      <Input
                        name="name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Vegetables"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Textarea
                        name="description"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Category description"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Adding...' : 'Add Category'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Product Name</label>
                      <Input
                        name="name"
                        value={productForm.name}
                        onChange={handleProductChange}
                        placeholder="Product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Textarea
                        name="description"
                        value={productForm.description}
                        onChange={handleProductChange}
                        placeholder="Product description"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <Select value={productForm.category_id} onValueChange={(value) => setProductForm(prev => ({ ...prev, category_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Image Preview when Editing */}
                    {editingProduct && editingProduct.image_url && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Current Image</label>
                        <img
                          src={editingProduct.image_url.startsWith('http') ? editingProduct.image_url : `${import.meta.env.VITE_API_BASE_URL}${editingProduct.image_url}`}
                          alt={editingProduct.name}
                          className="w-full h-40 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Product Image {editingProduct ? '(Optional - leave blank to keep current)' : ''}</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Categories as Gallery */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Categories</h2>
            {categories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-muted-foreground">No categories yet. Add your first category!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map(category => {
                  const categoryProductCount = products.filter(p => p.category_id === category.id).length;
                  return (
                    <Dialog key={category.id}>
                      <DialogTrigger asChild>
                        <Card 
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => {
                            setSelectedCategoryId(category.id);
                            setCategorySearch('');
                            setCategorySortOrder('asc');
                          }}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="text-4xl font-bold text-primary mb-2">
                              {categoryProductCount}
                            </div>
                            <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{categoryProductCount} product{categoryProductCount !== 1 ? 's' : ''}</p>
                            {category.description && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{category.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{category.name} Products</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Filters */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="Search products..."
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Select value={categorySortOrder} onValueChange={(value: any) => setCategorySortOrder(value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="asc">A - Z</SelectItem>
                                <SelectItem value="desc">Z - A</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Products List */}
                          {filteredCategoryProducts.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">No products in this category</p>
                            </div>
                          ) : (
                            <div className="max-h-96 overflow-y-auto space-y-2">
                              {filteredCategoryProducts.map(product => (
                                <div key={product.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-slate-50">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                                  </div>
                                  <div className="flex gap-2 ml-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        handleEditProduct(product);
                                        setSelectedCategoryId(null);
                                      }}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Products Table */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">All Products</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No products yet. Add your first product!
                          </td>
                        </tr>
                      ) : (
                        products.map(product => (
                          <tr key={product.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-sm">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.description?.slice(0, 50)}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">{product.category_name}</td>
                            <td className="px-4 py-3">
                              {product.image_url ? (
                                <img 
                                  src={product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_BASE_URL}${product.image_url}`}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">No image</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gallery Section */}
          <div className="space-y-6 mt-12">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gallery Images</h2>
              <div className="flex gap-2">
                {selectedGalleryImages.size > 0 && (
                  <Button 
                    variant="destructive" 
                    onClick={handleBulkDeleteGalleryImages}
                    disabled={loading}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedGalleryImages.size})
                  </Button>
                )}
                <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Images
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Gallery Images</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUploadGalleryImages} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Select Images (Support bulk upload - max 20 files, 5MB each)
                        </label>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleGalleryFileChange}
                          className="cursor-pointer"
                        />
                        {galleryFiles.length > 0 && (
                          <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm text-blue-800">
                              {galleryFiles.length} file(s) selected
                            </p>
                            <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                              {Array.from(galleryFiles).map((file, idx) => (
                                <div key={idx} className="text-xs text-blue-700 flex justify-between items-center">
                                  <span>{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFiles = galleryFiles.filter((_, i) => i !== idx);
                                      setGalleryFiles(newFiles);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button type="submit" disabled={loading || galleryFiles.length === 0} className="w-full">
                        {loading ? 'Uploading...' : `Upload ${galleryFiles.length} Image(s)`}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Gallery Grid */}
            {galleryImages.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground mb-4">No gallery images yet. Upload your first image!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map(image => (
                  <div
                    key={image.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedGalleryImages.has(image.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleToggleGalleryImage(image.id)}
                  >
                    {/* Image */}
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={image.image_url.startsWith('http') ? image.image_url : `${import.meta.env.VITE_API_BASE_URL}${image.image_url}`}
                        alt={`Gallery ${image.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Checkbox Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          selectedGalleryImages.has(image.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-white border-white group-hover:border-blue-300'
                        }`}
                      >
                        {selectedGalleryImages.has(image.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Delete Button on Hover */}
                    {!selectedGalleryImages.has(image.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGalleryImage(image.id);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
