import React, { useState, useEffect } from 'react';
import { X, Star, Truck, ShieldCheck, Heart, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export default function ProductModal({ product, isOpen, onClose, isWishlisted, onToggleWishlist }: ProductModalProps) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setClientName(user.user_metadata.full_name);
    }
  }, [user]);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (product?.id && isOpen) {
      supabase.from('product_reviews')
        .select('*')
        .eq('product_id', parseInt(product.id))
        .order('created_at', { ascending: false })
        .then(({ data }) => setReviews(data || []));
    }
  }, [product?.id, isOpen]);

  const submitReview = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }
    
    if (product.id) {
      try {
        await supabase.from('product_reviews').insert({
          user_id: user.id,
          product_id: parseInt(product.id),
          rating: reviewRating,
          comment: reviewComment
        });
        
        toast.success('¡Gracias por tu reseña!');
        setReviewComment('');
        setReviewRating(5);
        
        // Refresh reviews
        const { data } = await supabase.from('product_reviews')
          .select('*')
          .eq('product_id', parseInt(product.id))
          .order('created_at', { ascending: false });
        setReviews(data || []);
      } catch (err) {
        toast.error('Error al guardar la reseña');
      }
    }
  };

  if (!isOpen) return null;

  const handleWhatsAppOrder = async () => {
    if (!clientName || !address) {
      toast.error("Por favor, ingresa tu nombre y dirección para el envío.");
      return;
    }

    try {
      if (user && product.id) {
        // Only track if user is logged in and product has a DB id
        await supabase.from('orders').insert({
          user_id: user.id,
          product_id: parseInt(product.id) || null,
          quantity: quantity,
          customer_name: clientName,
          address: address,
          status: 'pending'
        });
      }
      
      toast.success('¡Pedido iniciado con éxito!');
      
      const phoneNumber = "1234567890"; // Reemplazar con el número real de WhatsApp
      const message = `¡Hola! Me gustaría hacer un pedido:
      
🛍️ *Producto:* ${product.name}
🖼️ *Imagen:* ${window.location.origin}${product.image}
💵 *Precio:* $${product.price}
🔢 *Cantidad:* ${quantity}
💰 *Total:* $${(product.price * quantity).toFixed(2)}

👤 *Cliente:* ${clientName}
📍 *Dirección:* ${address}`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      
      onClose();
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Hubo un error al iniciar el pedido.");
    }
  };

  const toggleWishlistHandler = () => {
    onToggleWishlist();
    if (!isWishlisted) {
      toast.success(`${product.name} agregado a favoritos`);
    } else {
      toast.success(`${product.name} eliminado de favoritos`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Gallery Area */}
          <div className="md:w-1/2 p-6 md:p-8 bg-slate-50 flex flex-col items-center justify-center relative">
            <button 
              onClick={toggleWishlistHandler}
              className={`absolute top-6 left-6 p-3 rounded-full shadow-sm transition-colors z-10 ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-slate-400 bg-white hover:text-red-500'}`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500' : ''}`} />
            </button>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full max-w-sm aspect-square object-contain mix-blend-multiply"
            />
          </div>

          {/* Details Area */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-bold text-blue-600 tracking-wider uppercase">{product.brand}</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{product.name}</h2>
            
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">{product.rating}</span>
                <span className="text-sm text-slate-500">({product.reviews} reseñas)</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-sm font-medium text-green-600">En stock</span>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-extrabold text-slate-900">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-lg text-slate-400 line-through mb-1">${product.oldPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full mb-1">
                    {product.discount}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">Los precios incluyen IVA.</p>
            </div>

            {/* Formulario de WhatsApp */}
            <div className="bg-green-50 p-4 rounded-xl mb-6 border border-green-100">
              <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Pedido por WhatsApp
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-green-900 mb-1">Cantidad</label>
                  <div className="flex items-center">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-l-lg bg-white border border-green-200 text-green-700 font-bold hover:bg-green-50">-</button>
                    <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 h-8 text-center border-y border-green-200 bg-white text-sm focus:outline-none" />
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-r-lg bg-white border border-green-200 text-green-700 font-bold hover:bg-green-50">+</button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-green-900 mb-1">Nombre completo</label>
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Tu nombre" className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-green-900 mb-1">Dirección particular</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej: Calle Principal 123, Ciudad" className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6 mt-auto">
              <button onClick={handleWhatsAppOrder} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-lg">
                <MessageCircle className="w-6 h-6 fill-white" />
                Pedir por WhatsApp
              </button>
            </div>

            {/* Reviews Section */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Reseñas de Usuarios</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Deja tu opinión</h4>
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)}>
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="¿Qué te pareció este producto?" 
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 min-h-[80px]"
                />
                <button onClick={submitReview} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Enviar Reseña
                </button>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {reviews.length > 0 ? reviews.map((review, i) => (
                  <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{review.comment}</p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 text-center py-4">Aún no hay reseñas para este producto.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
