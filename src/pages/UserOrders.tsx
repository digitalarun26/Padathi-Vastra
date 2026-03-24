import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { motion } from 'motion/react';
import { Package, Clock, Truck, CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const UserOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const path = 'orders';
      try {
        const q = query(
          collection(db, path),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">No orders yet</h2>
        <p className="text-gray-600 mb-10 max-w-md mx-auto">
          You haven't placed any orders yet. Start exploring our collection to find your perfect drape.
        </p>
        <Link to="/shop" className="btn-primary px-10 py-3 text-lg inline-flex items-center gap-2">
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-12">My Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Order ID</p>
                <p className="font-mono text-sm text-brand-primary">#{order.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Date</p>
                <p className="font-medium">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total</p>
                <p className="font-bold text-brand-primary text-xl">₹{order.total.toLocaleString()}</p>
              </div>
              <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {order.status === 'delivered' ? <CheckCircle size={16} /> : 
                 order.status === 'shipped' ? <Truck size={16} /> : <Clock size={16} />}
                {order.status}
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Items</h4>
                <div className="space-y-3">
                  {order.products.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.name} x {item.quantity}</span>
                      <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Shipping Address</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{order.address}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
