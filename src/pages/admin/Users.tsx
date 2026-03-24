import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { User, Order } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { Search, User as UserIcon, Calendar, ShoppingBag, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const AdminUsers: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user || !auth.currentUser) return;

      try {
        const usersSnap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
        const ordersSnap = await getDocs(collection(db, 'orders'));
        
        setUsers(usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)));
        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'admin_users_data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authLoading, user]);

  const getUserOrderStats = (userId: string) => {
    const userOrders = orders.filter(o => o.userId === userId);
    return {
      count: userOrders.length,
      total: userOrders.reduce((sum, o) => sum + o.total, 0)
    };
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-brand-primary">Customer Management</h1>
        <p className="text-gray-500">View and manage registered customers</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by Name or Email..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const stats = getUserOrderStats(user.uid);
          return (
            <div key={user.uid} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary">
                  <UserIcon size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-lg text-brand-primary truncate">{user.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail size={12} />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Orders</p>
                  <p className="text-xl font-bold text-brand-primary">{stats.count}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Spent</p>
                  <p className="text-xl font-bold text-brand-primary">₹{stats.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-brand-accent text-brand-primary'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsers;
