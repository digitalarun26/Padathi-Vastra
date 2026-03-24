import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-10 max-w-md mx-auto">
          Looks like you haven't added any beautiful sarees to your cart yet. 
          Start exploring our collection to find your perfect drape.
        </p>
        <Link to="/shop" className="btn-primary px-10 py-3 text-lg inline-flex items-center gap-2">
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-12">Shopping Bag ({itemCount})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white p-6 rounded-2xl shadow-sm flex gap-6 items-center"
              >
                <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-brand-secondary font-bold">{item.category}</span>
                      <h3 className="text-lg font-serif font-bold text-brand-primary truncate">{item.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">Fabric: {item.fabric}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-brand-primary transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-brand-primary transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="font-bold text-brand-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm sticky top-32 space-y-6">
            <h3 className="text-xl font-serif font-bold text-brand-primary border-b pb-4">Order Summary</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (GST)</span>
                <span>Included</span>
              </div>
              <div className="pt-4 border-t flex justify-between text-xl font-serif font-bold text-brand-primary">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>

            <div className="pt-6 text-center">
              <p className="text-xs text-gray-400">Secure Checkout | Cash on Delivery Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
