import React from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Users, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1920" 
            alt="Heritage" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-primary/60"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-4"
          >
            Our Heritage
          </motion.h1>
          <p className="text-xl text-brand-accent/80 max-w-2xl mx-auto">
            Preserving the art of handloom weaving for the modern woman.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-serif font-bold text-brand-primary">The Padathi Vastra Story</h2>
          <div className="h-1 w-20 bg-brand-secondary"></div>
          <p className="text-gray-600 leading-relaxed text-lg">
            Padathi Vastra was born out of a deep-seated love for Indian textiles and a desire to bring the finest handloom sarees to the global stage. 
            Our name, "Padathi Vastra," reflects our commitment to traditional attire that honors the grace of every woman.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            We believe that a saree is more than just six yards of fabric; it is a canvas of culture, a testament to artisan skill, and a legacy of elegance. 
            Our curators travel to the heart of weaving clusters—from the looms of Kanchipuram to the ghats of Banaras—to handpick each piece in our collection.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1610030469668-935142b96fe4?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
          <img src="https://images.unsplash.com/photo-1610030469915-9a88e4703a13?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg mt-8" referrerPolicy="no-referrer" />
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-primary">Our Core Values</h2>
            <p className="text-gray-500 mt-4">What drives us every single day</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Heart className="text-brand-secondary" />, title: "Passion", desc: "A genuine love for Indian handlooms and textiles." },
              { icon: <Star className="text-brand-secondary" />, title: "Quality", desc: "Uncompromising standards for fabric and craftsmanship." },
              { icon: <Users className="text-brand-secondary" />, title: "Artisan First", desc: "Supporting and empowering traditional weaving communities." },
              { icon: <Award className="text-brand-secondary" />, title: "Authenticity", desc: "100% genuine products directly from the source." }
            ].map((v, i) => (
              <div key={i} className="text-center space-y-4 p-6 hover:bg-brand-accent rounded-2xl transition-colors">
                <div className="flex justify-center">{v.icon}</div>
                <h3 className="text-xl font-serif font-bold">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 className="text-4xl font-serif font-bold text-brand-primary">Our Vision</h2>
        <p className="text-2xl font-serif italic text-gray-600 leading-relaxed">
          "To be the global destination for premium Indian sarees, where tradition meets modern elegance, 
          and every woman finds a piece of heritage that resonates with her soul."
        </p>
      </section>
    </div>
  );
};

export default About;
