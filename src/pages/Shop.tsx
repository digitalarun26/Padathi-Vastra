import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Search, Filter, SlidersHorizontal, ChevronDown, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categoryFilter = searchParams.get('category') || 'All';
  const priceFilter = searchParams.get('price') || 'All';

  const categories = ['All', 'Kanchipuram', 'Banarasi', 'Cotton', 'Chiffon', 'Mysore', 'Paithani', 'Tussar', 'Organza', 'Gadwal', 'Kalamkari', 'Patola', 'Chanderi'];
  const priceRanges = [
    { label: 'All', min: 0, max: 1000000 },
    { label: 'Under ₹5,000', min: 0, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { label: 'Above ₹20,000', min: 20000, max: 1000000 }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const path = 'products';
      try {
        let q = query(collection(db, path), orderBy('createdAt', 'desc'));
        
        if (categoryFilter !== 'All') {
          q = query(collection(db, path), where('category', '==', categoryFilter), orderBy('createdAt', 'desc'));
        }

        const snapshot = await getDocs(q);
        let fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        // Client-side filtering for price and search
        if (priceFilter !== 'All') {
          const range = priceRanges.find(r => r.label === priceFilter);
          if (range) {
            fetchedProducts = fetchedProducts.filter(p => p.price >= range.min && p.price <= range.max);
          }
        }

        if (searchTerm) {
          fetchedProducts = fetchedProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setProducts(fetchedProducts);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, priceFilter, searchTerm]);

  const handleCategoryChange = (cat: string) => {
    setSearchParams({ category: cat, price: priceFilter });
  };

  const handlePriceChange = (price: string) => {
    setSearchParams({ category: categoryFilter, price });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-primary">Our Collection</h1>
          <p className="text-gray-600 mt-2">Explore {products.length} exquisite sarees</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search sarees..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full hover:bg-brand-accent transition-colors md:hidden"
          >
            <Filter size={20} /> Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className={`lg:w-64 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div>
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <ChevronDown size={18} /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    categoryFilter === cat ? 'bg-brand-primary text-white' : 'hover:bg-brand-accent text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <ChevronDown size={18} /> Price Range
            </h3>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => handlePriceChange(range.label)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    priceFilter === range.label ? 'bg-brand-primary text-white' : 'hover:bg-brand-accent text-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-gray-200 aspect-[3/4] rounded-2xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/saree/800/1200';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors">
                        <Heart size={18} />
                      </button>
                    </div>
                  </Link>
                  <div className="p-6 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-brand-secondary font-bold">{product.category}</span>
                    <h3 className="text-lg font-serif font-bold mt-1 mb-2 group-hover:text-brand-primary transition-colors">{product.name}</h3>
                    <p className="text-brand-primary font-bold">₹{product.price.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-brand-accent w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-primary">No products found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your filters or search term.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams({});
                }}
                className="btn-primary mt-8"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
