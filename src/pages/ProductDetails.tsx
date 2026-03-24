import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, MessageCircle, Truck, RefreshCcw, ShieldCheck, ChevronLeft, ZoomIn } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const path = `products/${id}`;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(data);
          setSelectedImage(data.imageUrl);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success('Added to cart!');
    }
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `Hi Padathi Vastra, I'm interested in ordering the ${product.name} (₹${product.price}). Can you help me with the purchase?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919876543210?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-serif font-bold">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.images || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-brand-primary mb-8 transition-colors"
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col md:flex-row-reverse gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div 
              ref={imageRef}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl cursor-zoom-in group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={selectedImage} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                  style={isZoomed ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                  } : {}}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/saree/800/1200';
                  }}
                />
              </AnimatePresence>
              {!isZoomed && (
                <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={20} />
                </div>
              )}
            </div>
          </motion.div>

          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img ? 'border-brand-primary scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/saree/200/300';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <span className="text-brand-secondary font-bold tracking-widest uppercase text-sm">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary mt-2">{product.name}</h1>
            <p className="text-3xl font-bold text-gray-900 mt-4">₹{product.price.toLocaleString()}</p>
          </div>

          <div className="prose prose-brand max-w-none text-gray-600">
            <p className="text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Fabric</span>
              <span className="font-medium text-gray-900">{product.fabric}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Color</span>
              <span className="font-medium text-gray-900">{product.color}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 btn-primary flex items-center justify-center gap-3 py-4 text-lg"
            >
              <ShoppingCart size={24} /> Add to Cart
            </button>
            <button 
              onClick={handleWhatsAppOrder}
              className="flex-1 btn-secondary flex items-center justify-center gap-3 py-4 text-lg border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              <MessageCircle size={24} /> Order on WhatsApp
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck size={20} className="text-brand-secondary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RefreshCcw size={20} className="text-brand-secondary" />
              <span>7 Days Return</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck size={20} className="text-brand-secondary" />
              <span>100% Authentic</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
