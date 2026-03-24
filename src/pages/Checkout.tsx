import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion } from 'motion/react';
import { MapPin, Phone, User, Home, CreditCard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    pincode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to place an order');
    
    setLoading(true);
    const path = 'orders';
    try {
      const orderData = {
        userId: user.uid,
        products: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total,
        status: 'pending',
        address: `${formData.name}, ${formData.address}, ${formData.landmark}, ${formData.city} - ${formData.pincode}. Phone: ${formData.phone}`,
        mapLocation: { lat: 17.3850, lng: 78.4867 }, // Dummy Hyderabad location
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, path), orderData);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 size={48} className="text-green-600" />
        </motion.div>
        <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-10 max-w-md mx-auto">
          Thank you for shopping with Padathi Vastra. Your order is being processed and will be delivered soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/orders')} className="btn-primary">View My Orders</button>
          <button onClick={() => navigate('/shop')} className="btn-secondary">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-brand-primary flex items-center gap-2">
                <User size={20} /> Shipping Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Detailed Address</label>
                <textarea
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                  placeholder="House No, Street, Area..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Landmark</label>
                  <input
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    required
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="6-digit PIN"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-brand-primary flex items-center gap-2">
                <CreditCard size={20} /> Payment Method
              </h3>
              <div className="p-4 border-2 border-brand-primary bg-brand-accent/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-4 border-brand-primary"></div>
                  <div>
                    <p className="font-bold text-brand-primary">Cash on Delivery (COD)</p>
                    <p className="text-xs text-gray-500">Pay when you receive your saree</p>
                  </div>
                </div>
                <CheckCircle2 className="text-brand-primary" />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm sticky top-32 space-y-6">
            <h3 className="text-xl font-serif font-bold text-brand-primary border-b pb-4">Your Order</h3>
            <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 flex-1 truncate mr-4">{item.name} x {item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-xl font-serif font-bold text-brand-primary pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
