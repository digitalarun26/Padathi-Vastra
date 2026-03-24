import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold tracking-widest">PADATHI VASTRA</h2>
            <p className="text-brand-accent/70 text-sm leading-relaxed">
              Celebrating the timeless elegance of Indian heritage through curated premium sarees. 
              Every saree tells a story of craftsmanship and grace.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="hover:text-brand-secondary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-brand-secondary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-brand-secondary transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-brand-accent/70 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Categories</h3>
            <ul className="space-y-3 text-brand-accent/70 text-sm">
              <li><Link to="/shop?category=Kanchipuram" className="hover:text-white transition-colors">Kanchipuram Silk</Link></li>
              <li><Link to="/shop?category=Banarasi" className="hover:text-white transition-colors">Banarasi Silk</Link></li>
              <li><Link to="/shop?category=Cotton" className="hover:text-white transition-colors">Handloom Cotton</Link></li>
              <li><Link to="/shop?category=Chiffon" className="hover:text-white transition-colors">Designer Chiffon</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Store Info</h3>
            <ul className="space-y-4 text-brand-accent/70 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-brand-secondary" />
                <span>123 Silk Street, Jubilee Hills, Hyderabad, Telangana 500033</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0 text-brand-secondary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0 text-brand-secondary" />
                <span>contact@padathivastra.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-brand-accent/50 text-xs">
          <p>© {new Date().getFullYear()} Padathi Vastra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
