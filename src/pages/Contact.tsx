import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary">Contact Us</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Have a question about our collection or need help with an order? 
          We're here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/5 space-y-4">
              <div className="w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold">Call Us</h3>
              <p className="text-gray-600 text-sm">+91 98765 43210</p>
              <p className="text-gray-600 text-sm">Mon - Sat, 10am - 7pm</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/5 space-y-4">
              <div className="w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold">Email Us</h3>
              <p className="text-gray-600 text-sm">contact@padathivastra.com</p>
              <p className="text-gray-600 text-sm">support@padathivastra.com</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/5 space-y-6">
            <h3 className="text-2xl font-serif font-bold flex items-center gap-3">
              <MapPin size={24} className="text-brand-secondary" /> Our Boutique
            </h3>
            <p className="text-gray-600">
              123 Silk Street, Jubilee Hills, Hyderabad, Telangana 500033
            </p>
            <div className="h-64 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.827222661234!2d78.3991841!3d17.4334468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158f201b205%3A0x11bbe7be7792411b!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1711261368000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>
          </div>

          <button 
            onClick={() => window.open('https://wa.me/919876543210', '_blank')}
            className="w-full flex items-center justify-center gap-3 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-bold text-lg"
          >
            <MessageCircle size={24} /> Chat on WhatsApp
          </button>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <h3 className="text-2xl font-serif font-bold text-brand-primary mb-8">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <input
                required
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="How can we help?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-brand-accent/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="Write your message here..."
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : <><Send size={20} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
