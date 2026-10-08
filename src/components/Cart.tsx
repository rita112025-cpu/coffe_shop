import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="購物車"
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-paper shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-cocoa/15 bg-gradient-to-r from-cream to-cream">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cream-dark rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-cocoa/80" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-cocoa-deep">購物車</h2>
                  <p className="text-xs text-cocoa/70">{totalItems} 件商品</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="關閉購物車"
                className="w-9 h-9 bg-paper hover:bg-cream-dark rounded-full flex items-center justify-center text-cocoa/80 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="text-cocoa font-medium text-lg mb-2">購物車是空的</p>
                  <p className="text-berry text-sm">瀏覽我們的精選咖啡，開始您的味覺之旅</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                        className="flex items-center gap-3 p-3 bg-cream/50 rounded-sm border border-cocoa/15"
                      >
                        {/* Emoji */}
                        <div className="w-14 h-14 bg-gradient-to-br from-cream to-cream rounded-sm flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{item.product.emoji}</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-cocoa-deep truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-berry mt-0.5">
                            ${item.product.price} / 包
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            aria-label="減少數量"
                            className="w-7 h-7 bg-paper hover:bg-cream-dark rounded-full flex items-center justify-center text-cocoa/80 transition-colors shadow-sm border border-cocoa/15"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-bold text-cocoa">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            aria-label="增加數量"
                            className="w-7 h-7 bg-paper hover:bg-cream-dark rounded-full flex items-center justify-center text-cocoa/80 transition-colors shadow-sm border border-cocoa/15"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          aria-label="移除商品"
                          className="w-7 h-7 hover:bg-berry/10 rounded-full flex items-center justify-center text-cocoa/50 hover:text-berry transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-5 sm:p-6 border-t border-cocoa/15 bg-gradient-to-r from-cream to-cream"
              >
                {/* Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-cocoa/80">
                    <span>小計</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cocoa/80">
                    <span>運費</span>
                    <span className="text-pistachio font-medium">免運費</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-cocoa-deep pt-2 border-t border-cocoa/25">
                    <span>合計</span>
                    <span>${total.toLocaleString()} TWD</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  onClick={onCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-cocoa to-cocoa-deep hover:from-cocoa-deep hover:to-cocoa/70 text-white font-bold rounded-sm shadow-lg hover:shadow-xl transition-all text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  前往結帳
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
