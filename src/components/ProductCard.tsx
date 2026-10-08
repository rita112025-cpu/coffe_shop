import { motion } from 'framer-motion';
import { Plus, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

const roastDots: Record<string, string> = {
  '淺焙': 'bg-pistachio',
  '淺中焙': 'bg-pistachio',
  '中焙': 'bg-gold',
  '中深焙': 'bg-berry',
  '深焙': 'bg-cocoa',
};

const tagTilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

export default function ProductCard({ product, index, onAddToCart, onViewDetail }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group relative bg-paper border-2 border-cocoa/70 shadow-[0_10px_24px_-12px_rgba(31,18,12,0.55)] hover:shadow-[0_18px_34px_-14px_rgba(31,18,12,0.7)] hover:-translate-y-1 transition-all duration-300"
    >
      {/* Specimen plate */}
      <div className="relative m-3.5 h-48 sm:h-52 bg-gradient-to-br from-cocoa to-cocoa-deep border border-gold/60 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-1.5 border border-gold/25 pointer-events-none" />
        <motion.span
          className="text-6xl sm:text-7xl drop-shadow-[0_8px_10px_rgba(0,0,0,0.5)]"
          whileHover={{ scale: 1.12, rotate: 4 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {product.emoji}
        </motion.span>

        {/* Specimen number tag */}
        <span
          className={`uppercase absolute top-3 left-3 px-2 py-1 bg-gold text-cocoa-deep text-[9px] font-bold shadow-md ${tagTilts[index % tagTilts.length]}`}
        >
          Specimen {String(product.id).padStart(2, '0')}
        </span>

        {/* Roast */}
        <span className="uppercase absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-cocoa-deep/80 text-cream text-[10px] border border-gold/30">
          <span className={`w-1.5 h-1.5 rounded-full ${roastDots[product.roast] || 'bg-gold'}`} />
          {product.roast}
        </span>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-cocoa-deep/0 group-hover:bg-cocoa-deep/45 transition-all duration-300 flex items-center justify-center">
          <motion.button
            onClick={() => onViewDetail(product)}
            className="uppercase opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 px-4 py-2 bg-cream text-cocoa-deep text-[11px] font-semibold border border-gold hover:bg-gold flex items-center gap-2"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Eye className="w-4 h-4" />
            查看詳情
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-5 pb-5 pt-1">
        <p className="uppercase text-[10px] text-berry font-semibold mb-1">
          {product.category} · {product.process}
        </p>
        <h3 className="text-xl font-extrabold text-cocoa leading-tight">{product.name}</h3>
        <p className="italic text-sm text-cocoa/60 mb-3">{product.nameEn}</p>

        {/* Flavor notes */}
        <p className="text-sm text-cocoa/75 leading-relaxed mb-4">
          {product.flavor.slice(0, 3).join(' · ')}
        </p>

        <div className="rule-dotted mb-3" />

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-2xl font-extrabold text-berry">${product.price}</span>
            <span className="uppercase text-[9px] text-cocoa/50 ml-1.5">TWD</span>
          </div>
          <motion.button
            onClick={() => onAddToCart(product)}
            className="uppercase flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-cocoa hover:bg-cocoa-deep text-cream text-[11px] font-semibold transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">加入購物車</span>
            <span className="sm:hidden">加入</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
