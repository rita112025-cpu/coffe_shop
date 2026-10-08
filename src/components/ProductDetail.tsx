import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, MapPin, Flame, Tag, Settings2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetail({ product, isOpen, onClose, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cocoa-deep/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-paper rounded-sm sm:rounded-sm shadow-2xl z-50 border-2 border-gold/70"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="關閉商品詳情"
              className="absolute top-5 right-5 z-10 w-8 h-8 bg-cream rounded-full border border-gold flex items-center justify-center text-cocoa hover:bg-cream-dark transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Area */}
            <div className="h-48 sm:h-60 m-3 bg-gradient-to-br from-cocoa to-cocoa-deep border border-gold/60 flex items-center justify-center relative">
              <motion.span
                className="text-7xl sm:text-8xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {product.emoji}
              </motion.span>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="uppercase px-3 py-1 bg-gold text-[10px] font-bold text-cocoa-deep">
                  {product.category}
                </span>
                <span className="uppercase px-3 py-1 bg-cocoa-deep/80 border border-gold/30 text-[10px] text-cream">
                  {product.roast}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-7">
              <div className="mb-4">
                <p className="italic text-sm text-berry font-medium mb-1">
                  {product.nameEn}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-cocoa-deep">
                  {product.name}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-cocoa/80 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                <div className="flex items-center gap-2 p-3 bg-cream/80 rounded-sm">
                  <MapPin className="w-4 h-4 text-cocoa/70" />
                  <div>
                    <p className="text-[10px] text-berry uppercase">產地</p>
                    <p className="text-xs sm:text-sm font-medium text-cocoa">{product.origin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-cream/80 rounded-sm">
                  <Flame className="w-4 h-4 text-cocoa/70" />
                  <div>
                    <p className="text-[10px] text-berry uppercase">烘焙度</p>
                    <p className="text-xs sm:text-sm font-medium text-cocoa">{product.roast}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-cream/80 rounded-sm">
                  <Settings2 className="w-4 h-4 text-cocoa/70" />
                  <div>
                    <p className="text-[10px] text-berry uppercase">處理法</p>
                    <p className="text-xs sm:text-sm font-medium text-cocoa">{product.process}</p>
                  </div>
                </div>
              </div>

              {/* Flavor Tags */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-cocoa/70" />
                  <span className="text-xs font-medium text-cocoa/80 uppercase tracking-wide">風味描述</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.flavor.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1.5 bg-transparent text-cocoa/80 text-sm rounded-full border border-dashed border-cocoa/40"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-cocoa/15">
                <div>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-berry">
                    ${product.price}
                  </span>
                  <span className="uppercase text-[10px] text-cocoa/50 ml-1.5">TWD</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="減少數量"
                      className="w-8 h-8 bg-paper hover:bg-cream-dark disabled:opacity-40 rounded-full flex items-center justify-center text-cocoa/80 transition-colors shadow-sm border border-cocoa/15"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-base font-bold text-cocoa" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="增加數量"
                      className="w-8 h-8 bg-paper hover:bg-cream-dark rounded-full flex items-center justify-center text-cocoa/80 transition-colors shadow-sm border border-cocoa/15"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <motion.button
                    onClick={handleAdd}
                    className="px-4 sm:px-6 py-2.5 uppercase bg-cocoa hover:bg-cocoa-deep text-cream font-semibold transition-colors text-xs sm:text-[13px]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    加入購物車
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
