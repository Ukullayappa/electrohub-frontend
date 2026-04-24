import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import { toast } from 'react-toastify';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    brand: '',
    category_id: '',
    stock: '',
    images: '',
    featured: false,
    new_arrival: false,
    rating: 0,
    reviews_count: 0
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.categories);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getById(id);
      const p = res.data.product;
      setFormData({
        ...p,
        images: Array.isArray(p.images) ? p.images.join(', ') : p.images
      });
    } catch (err) {
      toast.error('Failed to load product');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Prepare data
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: formData.images.split(',').map(img => img.trim()).filter(img => img)
    };

    try {
      if (isEdit) {
        await productsAPI.update(id, submissionData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(submissionData);
        toast.success('Product created successfully');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner-border text-primary"></div></div>;

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, margin: 0 }}>
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button onClick={() => navigate('/admin')} className="btn btn-outline-secondary btn-sm">
          Cancel
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Product Name</label>
              <input 
                type="text" name="name" className="form-control" 
                value={formData.name} onChange={handleChange} required 
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Slug</label>
              <input 
                type="text" name="slug" className="form-control" 
                value={formData.slug} onChange={handleChange} required 
              />
            </div>
            
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea 
                name="description" className="form-control" rows="4"
                value={formData.description} onChange={handleChange} required
              ></textarea>
            </div>

            <div className="col-md-4">
              <label className="form-label">Price (₹)</label>
              <input 
                type="number" name="price" className="form-control" 
                value={formData.price} onChange={handleChange} required 
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Brand</label>
              <input 
                type="text" name="brand" className="form-control" 
                value={formData.brand} onChange={handleChange} required 
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <select 
                name="category_id" className="form-select" 
                value={formData.category_id} onChange={handleChange} required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Stock Quantity</label>
              <input 
                type="number" name="stock" className="form-control" 
                value={formData.stock} onChange={handleChange} required 
              />
            </div>
            <div className="col-md-8">
              <label className="form-label">Images (Comma separated URLs)</label>
              <input 
                type="text" name="images" className="form-control" 
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                value={formData.images} onChange={handleChange} required 
              />
            </div>

            <div className="col-12 d-flex gap-4 my-2">
              <div className="form-check">
                <input 
                  type="checkbox" name="featured" className="form-check-input" id="featured"
                  checked={formData.featured} onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="featured">Featured Product</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" name="new_arrival" className="form-check-input" id="new_arrival"
                  checked={formData.new_arrival} onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="new_arrival">New Arrival</label>
              </div>
            </div>

            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-primary w-100 py-3" disabled={saving}>
                {saving ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                ) : (
                  isEdit ? 'Update Product' : 'Create Product'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
