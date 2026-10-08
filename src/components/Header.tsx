import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, X, Coffee } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-cocoa-deep/95 backdrop-blur-sm border-b border-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 sm:gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 border border-gold rounded-full flex items-center justify-center">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-cream leading-none">
                焙香咖啡
              </h1>
              <p className="uppercase text-[9px] sm:text-[10px] text-gold mt-1 hidden sm:block">
                Artisan Coffee Roasters
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
              <input
                type="text"
                placeholder="搜尋咖啡..."
                aria-label="搜尋咖啡"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-cocoa border border-gold/40 rounded-sm text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="清除搜尋"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/70 hover:text-cream transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Cart Button */}
          <motion.button
            onClick={onCartClick}
            aria-label="開啟購物車"
            className="relative px-3 sm:px-4 py-2 sm:py-2.5 border border-gold text-gold hover:bg-gold hover:text-cocoa-deep rounded-sm transition-colors flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.96 }}
          >
            <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="uppercase text-[10px] hidden md:inline">購物車</span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-berry text-cream text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg"
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
