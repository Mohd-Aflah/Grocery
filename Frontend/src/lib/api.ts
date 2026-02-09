const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Products API calls
export const productsAPI = {
  getAll: async (categoryId?: number, isActive?: boolean) => {
    let url = `${API_BASE_URL}/products`;
    const params = new URLSearchParams();
    if (categoryId) params.append('category_id', categoryId.toString());
    if (isActive !== undefined) params.append('is_active', isActive.toString());
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url);
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },

  create: async (data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: data
    });
    return response.json();
  },

  update: async (id: number, data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      body: data
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Categories API calls
export const categoriesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
  },

  create: async (name: string, description: string) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Gallery API calls
export const galleryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/gallery`);
    return response.json();
  },

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    const response = await fetch(`${API_BASE_URL}/gallery/bulk-upload`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  deleteMultiple: async (ids: number[]) => {
    const response = await fetch(`${API_BASE_URL}/gallery/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    return response.json();
  }
};
