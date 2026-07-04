import { Category, Feature, Product, Seller, Testimonial } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Electrónica', count: '8,234 productos', icon: 'Smartphone', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: '2', name: 'Moda', count: '6,542 productos', icon: 'Shirt', bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
  { id: '3', name: 'Hogar', count: '4,175 productos', icon: 'Sofa', bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
  { id: '4', name: 'Tecnología', count: '3,061 productos', icon: 'Laptop', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
];

export const trendingProducts: Product[] = [
  {
    id: 't1',
    name: 'AirPods Pro 2',
    brand: 'Apple',
    price: 249.99,
    oldPrice: 299.99,
    rating: 4.9,
    reviews: 1200,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
  },
  {
    id: 't2',
    name: 'Apple Watch Series 8',
    brand: 'Apple',
    price: 399.99,
    oldPrice: 499.99,
    rating: 4.8,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80',
  },
  {
    id: 't3',
    name: 'Nike Air Max 270',
    brand: 'Nike',
    price: 129.99,
    oldPrice: 150.00,
    rating: 4.7,
    reviews: 640,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  },
  {
    id: 't4',
    name: 'Sony A7 IV',
    brand: 'Sony',
    price: 1799.99,
    oldPrice: 1999.99,
    rating: 4.9,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  },
  {
    id: 't5',
    name: 'Lámpara Nórdica',
    brand: 'HomeDeco',
    price: 44.99,
    oldPrice: 59.99,
    rating: 4.6,
    reviews: 410,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
  },
];

export const features: Feature[] = [
  { id: 'f1', title: 'Compra Segura', description: 'Protección al comprador en todas tus compras', icon: 'ShieldCheck', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { id: 'f2', title: 'Envío Rápido', description: 'Envíos rápidos y seguros a todo el país', icon: 'Rocket', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { id: 'f3', title: 'Atención Directa', description: 'Pedidos rápidos y directos por WhatsApp', icon: 'MessageCircle', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: 'f4', title: 'Garantía de Calidad', description: 'Recibe tus productos con garantía extendida', icon: 'Award', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
];

export const bestSellers: Product[] = [
  {
    id: 'b1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 1199.99,
    oldPrice: 1299.99,
    rating: 4.9,
    reviews: 3275,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', // Wide layout image
    discount: '-$50',
    isWide: true,
    badge: 'Bestseller'
  },
  {
    id: 'b2',
    name: 'MacBook Air M2',
    brand: 'Apple',
    price: 999.99,
    oldPrice: 1199.99,
    rating: 4.8,
    reviews: 1420,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    discount: '-17%',
  },
  {
    id: 'b3',
    name: 'PlayStation 5',
    brand: 'Sony',
    price: 499.99,
    oldPrice: 549.99,
    rating: 4.9,
    reviews: 8430,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80',
    discount: '-9%',
  },
  {
    id: 'b4',
    name: 'Samsung 55" 4K TV',
    brand: 'Samsung',
    price: 549.99,
    oldPrice: 649.99,
    rating: 4.7,
    reviews: 930,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80',
    discount: '-15%',
  },
];

export const topSellers: Seller[] = [
  { id: 's1', name: 'TechStore', verified: true, rating: 4.9, sales: '1,234', products: '324', avatar: 'https://i.pravatar.cc/150?u=techstore' },
  { id: 's2', name: 'ModStyle', verified: true, rating: 4.8, sales: '982', products: '182', avatar: 'https://i.pravatar.cc/150?u=modstyle' },
  { id: 's3', name: 'Hogar Pro', verified: true, rating: 4.9, sales: '785', products: '243', avatar: 'https://i.pravatar.cc/150?u=hogarpro' },
  { id: 's4', name: 'GadgetWorld', verified: true, rating: 4.8, sales: '1,546', products: '545', avatar: 'https://i.pravatar.cc/150?u=gadgetworld' },
];

export const testimonials: Testimonial[] = [
  { id: 'ts1', text: 'Excelente plataforma, encontré todo lo que necesitaba a precios increíbles. Muy recomendada.', name: 'María Antúnez', avatar: 'https://i.pravatar.cc/150?u=maria', rating: 5 },
  { id: 'ts2', text: 'Vender en Your Market es muy fácil, he aumentado mis ventas considerablemente.', name: 'Carlos Mendoza', avatar: 'https://i.pravatar.cc/150?u=carlos', rating: 5 },
  { id: 'ts3', text: 'La mejor experiencia de compra online, envíos rápidos y productos de calidad.', name: 'Ana Rodríguez', avatar: 'https://i.pravatar.cc/150?u=ana', rating: 5 },
];
