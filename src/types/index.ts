export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  fabric: string;
  category: string;
  color: string;
  imageUrl: string;
  images?: string[];
  createdAt: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  address: string;
  mapLocation: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}
