import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../firebase';
import { Product } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { Plus, Trash2, Edit, X, Upload, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const AdminProducts: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    fabric: '',
    category: '',
    color: '',
    imageUrl: '',
    images: [] as string[]
  });

  useEffect(() => {
    if (!authLoading && user && auth.currentUser) {
      fetchProducts();
    }
  }, [authLoading, user]);

  const fetchProducts = async () => {
    setLoading(true);
    const path = 'products';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      if (isGallery) {
        setFormData(prev => ({ ...prev, images: [...prev.images, downloadURL] }));
      } else {
        setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
      }
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Check permissions.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('Please upload or provide a main image URL');
      return;
    }

    const path = 'products';
    const productData = {
      ...formData,
      price: Number(formData.price),
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, path, editingProduct.id), productData);
        toast.success('Product updated!');
      } else {
        await addDoc(collection(db, path), productData);
        toast.success('Product added!');
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', description: '', fabric: '', category: '', color: '', imageUrl: '', images: [] });
      fetchProducts();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const path = 'products';
      try {
        await deleteDoc(doc(db, path, id));
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      fabric: product.fabric,
      category: product.category,
      color: product.color,
      imageUrl: product.imageUrl,
      images: product.images || []
    });
    setShowModal(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-primary">Product Management</h1>
          <p className="text-gray-500">Manage your saree inventory</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '', fabric: '', category: '', color: '', imageUrl: '', images: [] });
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-accent/30 text-xs uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Fabric</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-brand-accent/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={product.imageUrl} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/saree/200/300';
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{product.name}</span>
                        <span className="text-[10px] text-gray-400">{(product.images?.length || 0) + 1} images</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-brand-primary">₹{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.fabric}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-2xl font-serif font-bold text-brand-primary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price (INR)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <input
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fabric</label>
                  <input
                    required
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Color</label>
                  <input
                    required
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Main Image</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                      id="main-image-upload"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('main-image-upload')?.click()}
                      disabled={uploading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-accent/50 border border-dashed border-gray-300 rounded-xl hover:border-brand-primary transition-colors disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                      {uploading ? 'Uploading...' : 'Upload Main'}
                    </button>
                  </div>
                  <input
                    placeholder="Or paste main image URL"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Gallery Images</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                      id="gallery-image-upload"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('gallery-image-upload')?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-3 py-1 bg-brand-accent text-brand-primary rounded-lg text-xs font-bold hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50"
                    >
                      <Plus size={14} /> Add to Gallery
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                  {/* Main Image Preview */}
                  {formData.imageUrl && (
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-brand-primary shadow-md">
                      <img src={formData.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-0 left-0 bg-brand-primary text-white text-[8px] px-1 font-bold">MAIN</div>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                  
                  {/* Gallery Previews */}
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl outline-none"
                />
              </div>
              <button type="submit" disabled={uploading} className="w-full btn-primary py-4 text-lg disabled:opacity-50">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
