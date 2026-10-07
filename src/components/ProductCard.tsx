import { motion } from 'framer-motion';
import { Plus, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

const roastColors: Record<string, string> = {
  '淺焙': 'bg-amber-100 text-amber-800',
  '淺中焙': 'bg-orange-100 text-orange-800',
  '中焙': 'bg-yellow-100 text-yellow-800',
  '中深焙': 'bg-amber-200 text-amber-900',
  '深焙': 'bg-amber-300 text-amber-900',
};

const categoryGradients: Record<string, string> = {
  '單品豆': 'from-amber-50 to-orange-50',
  '調和豆': 'from-orange-50 to-yellow-50',
  '掛耳包': 'from-yellow-50 to-amber-50',
};

export default function ProductCard({ product, index, onAddToCart, onViewDetail }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100/60"
    >
      {/* Product Image Area */}
      <div
        className={`relative h-48 sm:h-56 bg-gradient-to-br ${categoryGradients[product.category] || 'from-amber-50 to-orange-50'} flex items-center justify-center overflow-hidden`}
      >
        <motion.span
          className="text-6xl sm:text-7xl"
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {product.emoji}
        </motion.span>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm text-xs font-medium text-amber-800 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Roast Level Badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full ${roastColors[product.roast] || 'bg-amber-100 text-amber-800'}`}>
          {product.roast}
        </span>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-all duration-300 flex items-center justify-center">
          <motion.button
            onClick={() => onViewDetail(product)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-white/90 backdrop-blur-sm text-amber-800 rounded-full text-sm font-medium shadow-lg hover:bg-white flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4" />
            查看詳情
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        <div className="mb-2">
          <p className="text-xs text-amber-500/70 font-medium tracking-wide mb-0.5">
            {product.nameEn}
          </p>
          <h3 className="text-base sm:text-lg font-bold text-amber-950 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Flavor Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.flavor.slice(0, 3).map((f) => (
            <span
              key={f}
              className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-50">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-amber-800">
              ${product.price}
            </span>
            <span className="text-xs text-amber-500 ml-1">TWD</span>
          </div>
          <motion.button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">加入購物車</span>
            <span className="sm:hidden">加入</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
