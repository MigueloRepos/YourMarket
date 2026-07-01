export interface Product {
  id: string;
  code?: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: string;
  isWide?: boolean;
  badge?: string;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  count: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface Seller {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  sales: string;
  products: string;
  avatar: string;
}

export interface Testimonial {
  id: string;
  text: string;
  name: string;
  avatar: string;
  rating: number;
}
