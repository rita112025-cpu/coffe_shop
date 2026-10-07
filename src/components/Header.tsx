import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, X, Coffee } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartItems: CartItem[];
  onCartClick: () => void;
  isCartOpen: boolean;
  onCartClose: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  cartItems,
  onCartClick,
}: HeaderProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-amber-100/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-amber-50 tracking-wide">
                焙香咖啡
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-200/80 tracking-widest hidden sm:block">
                ARTISAN COFFEE ROASTERS
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="flex-1 max-w-md mx-4 sm:mx-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/60" />
              <input
                type="text"
                placeholder="搜尋咖啡..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-amber-950/40 border border-amber-700/30 rounded-full text-sm text-amber-50 placeholder-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300/60 hover:text-amber-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Cart Button */}
          <motion.button
            onClick={onCartClick}
            className="relative p-2.5 sm:p-3 bg-amber-100/10 hover:bg-amber-100/20 rounded-full transition-all backdrop-blur-sm border border-amber-200/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
