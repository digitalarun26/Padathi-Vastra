import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-brand-accent/30 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-primary text-white p-6 space-y-10">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-serif font-bold tracking-widest">ADMIN PANEL</h2>
          <p className="text-[8px] text-brand-secondary font-bold uppercase tracking-[0.2em] mt-1">Padathi Vastra</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-brand-secondary text-brand-primary font-bold shadow-lg scale-105' 
                  : 'hover:bg-white/10 text-brand-accent/70'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-20">
          <Link to="/" className="flex items-center gap-4 px-4 py-3 text-brand-accent/50 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
