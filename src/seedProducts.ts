import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './lib/firestore-errors';

const sampleProducts = [
  {
    name: "Royal Kanchipuram Silk",
    price: 15500,
    description: "Handwoven pure silk saree with intricate gold zari work. Perfect for weddings and grand occasions.",
    fabric: "Pure Silk",
    category: "Kanchipuram",
    color: "Deep Red",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1610030469668-935142b96fe4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1610030469915-9a88e4703a13?auto=format&fit=crop&q=80&w=800"
    ],
    createdAt: new Date().toISOString()
  },
  {
    name: "Banarasi Brocade Saree",
    price: 12800,
    description: "Classic Banarasi silk with floral motifs and heavy pallu. A timeless addition to your wardrobe.",
    fabric: "Silk Brocade",
    category: "Banarasi",
    color: "Emerald Green",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1610030469618-d91493676dae?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1610030469611-0e318336106e?auto=format&fit=crop&q=80&w=800"
    ],
    createdAt: new Date().toISOString()
  },
  {
    name: "Handloom Cotton Elegance",
    price: 3500,
    description: "Breathable handloom cotton saree with subtle borders. Ideal for daily wear and office.",
    fabric: "Cotton",
    category: "Cotton",
    color: "Indigo Blue",
    imageUrl: "https://images.unsplash.com/photo-1610030469668-935142b96fe4?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Designer Chiffon Drape",
    price: 6200,
    description: "Lightweight chiffon saree with sequin detailing. Modern and chic for evening parties.",
    fabric: "Chiffon",
    category: "Chiffon",
    color: "Peach Blush",
    imageUrl: "https://images.unsplash.com/photo-1610030469915-9a88e4703a13?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Mysore Silk Tradition",
    price: 8900,
    description: "Soft Mysore silk with minimalist gold borders. Elegant and comfortable.",
    fabric: "Mysore Silk",
    category: "Mysore",
    color: "Mustard Yellow",
    imageUrl: "https://images.unsplash.com/photo-1610030469618-d91493676dae?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Paithani Peacock Saree",
    price: 18000,
    description: "Traditional Maharashtrian Paithani with peacock motifs on the pallu.",
    fabric: "Silk",
    category: "Paithani",
    color: "Purple",
    imageUrl: "https://images.unsplash.com/photo-1610030469611-0e318336106e?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Tussar Silk Hand-painted",
    price: 7500,
    description: "Raw Tussar silk featuring hand-painted Kalamkari art.",
    fabric: "Tussar Silk",
    category: "Tussar",
    color: "Beige",
    imageUrl: "https://images.unsplash.com/photo-1610030469649-34e87002e16d?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Organza Floral Fantasy",
    price: 5400,
    description: "Sheer organza saree with delicate floral embroidery.",
    fabric: "Organza",
    category: "Organza",
    color: "Lavender",
    imageUrl: "https://images.unsplash.com/photo-1610030469941-26685f0965e1?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Gadwal Silk Heritage",
    price: 11000,
    description: "Classic Gadwal saree with contrasting silk borders and cotton body.",
    fabric: "Gadwal Silk",
    category: "Gadwal",
    color: "Teal",
    imageUrl: "https://images.unsplash.com/photo-1610030469638-3f820b677dbe?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Kalamkari Cotton Drape",
    price: 4200,
    description: "Traditional block-printed Kalamkari cotton saree.",
    fabric: "Cotton",
    category: "Kalamkari",
    color: "Earth Brown",
    imageUrl: "https://images.unsplash.com/photo-1610030469658-06839556d43e?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Patola Silk Masterpiece",
    price: 25000,
    description: "Double ikat Patola silk saree from Gujarat. A true collector's item.",
    fabric: "Patola Silk",
    category: "Patola",
    color: "Multi-color",
    imageUrl: "https://images.unsplash.com/photo-1610030469628-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  },
  {
    name: "Chanderi Silk Cotton",
    price: 4800,
    description: "Lightweight Chanderi saree with golden booti work.",
    fabric: "Chanderi Silk",
    category: "Chanderi",
    color: "Sky Blue",
    imageUrl: "https://images.unsplash.com/photo-1610030469618-d91493676dae?auto=format&fit=crop&q=80&w=800",
    createdAt: new Date().toISOString()
  }
];

export const seedProducts = async () => {
  const path = 'products';
  try {
    const productsCol = collection(db, path);
    const snapshot = await getDocs(productsCol);
    
    if (snapshot.empty) {
      console.log('Seeding products...');
      for (const product of sampleProducts) {
        await addDoc(productsCol, product);
      }
      console.log('Seeding complete!');
    }
  } catch (error: any) {
    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      console.warn('Seeding skipped: Missing permissions. Only admins can seed products.');
      return;
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
};
