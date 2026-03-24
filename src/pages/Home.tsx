import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion } from 'motion/react';
import { ArrowRight, Star, Truck, ShieldCheck, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const path = 'products';
      try {
        const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(products);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Saree" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Elegance in Every <span className="text-brand-secondary">Weave</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-brand-accent/90 leading-relaxed">
              Discover the finest collection of handpicked premium sarees. 
              From traditional Kanchipuram to modern Chiffon, find your perfect story.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2 text-lg px-8 py-3">
                Shop Collection <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-brand-primary text-lg px-8 py-3">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Star className="text-brand-secondary" />, title: "Premium Quality", desc: "Handpicked fabrics with authentic craftsmanship." },
            { icon: <Truck className="text-brand-secondary" />, title: "Fast Delivery", desc: "Secure and timely shipping across India." },
            { icon: <ShieldCheck className="text-brand-secondary" />, title: "Authentic Weaves", desc: "100% genuine handloom and designer sarees." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/5 text-center space-y-4">
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-serif font-bold">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-brand-primary">Featured Collection</h2>
            <div className="h-1 w-20 bg-brand-secondary mt-2"></div>
          </div>
          <Link to="/shop" className="text-brand-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-gray-200 aspect-[3/4] rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
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
        )}
      </section>

      {/* Brand Story Teaser */}
      <section className="bg-brand-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800" 
              alt="Artisan" 
              className="rounded-2xl shadow-2xl relative z-10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-brand-secondary rounded-2xl z-0"></div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold">The Art of Padathi Vastra</h2>
            <p className="text-brand-accent/80 leading-relaxed text-lg">
              Our journey began with a simple vision: to preserve the rich heritage of Indian handlooms. 
              We work directly with master weavers across the country to bring you sarees that are not just garments, 
              but pieces of art.
            </p>
            <p className="text-brand-accent/80 leading-relaxed text-lg">
              Every thread is woven with passion, and every pattern tells a story of tradition passed down through generations.
            </p>
            <Link to="/about" className="inline-block btn-secondary !border-brand-secondary !text-brand-secondary hover:!bg-brand-secondary hover:!text-brand-primary">
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-serif font-bold text-brand-primary mb-16">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Anjali Sharma", text: "The Kanchipuram silk saree I bought is absolutely stunning. The quality of zari is exceptional!" },
            { name: "Priya Reddy", text: "Fast delivery and beautiful packaging. The saree looks even better in person than in photos." },
            { name: "Meera Das", text: "Padathi Vastra has become my go-to for all wedding shopping. Their collection is truly unique." }
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/5 italic">
              <p className="text-gray-600 mb-6">"{t.text}"</p>
              <h4 className="font-serif font-bold text-brand-primary not-italic">— {t.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
