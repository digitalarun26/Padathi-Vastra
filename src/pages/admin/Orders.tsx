import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Order } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { Search, Eye, Truck, CheckCircle, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const AdminOrders: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && user && auth.currentUser) {
      fetchOrders();
    }
  }, [authLoading, user]);

  const fetchOrders = async () => {
    setLoading(true);
    const path = 'orders';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: Order['status']) => {
    const path = 'orders';
    try {
      await updateDoc(doc(db, path, orderId), { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-brand-primary">Order Management</h1>
        <p className="text-gray-500">Track and manage customer orders</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by Order ID or Address..."
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
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-accent/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{order.address}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-primary">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-brand-primary hover:bg-brand-accent rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-2xl font-serif font-bold text-brand-primary">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Customer Address</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedOrder.address}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Order Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'shipped', 'delivered'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedOrder.id, s as any)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                          selectedOrder.status === s 
                            ? 'bg-brand-primary text-white scale-110' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Items Ordered</h4>
                <div className="space-y-4">
                  {selectedOrder.products.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-brand-accent/30 rounded-xl">
                      <div>
                        <p className="font-bold text-brand-primary">{item.name}</p>
                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t flex justify-between items-center">
                <span className="text-xl font-serif font-bold text-brand-primary">Total Amount</span>
                <span className="text-2xl font-bold text-brand-primary">₹{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
