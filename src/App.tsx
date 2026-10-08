import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles, Star } from 'lucide-react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { products, categories } from './data/products';
import { Product, CartItem, Category } from './types';

const CART_KEY = 'coffe_shop_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('invalid cart');
    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item.quantity === 'number' &&
        item.quantity > 0 &&
        item.product &&
        typeof item.product.id === 'number' &&
        typeof item.product.price === 'number'
    );
  } catch {
    try {
      localStorage.removeItem(CART_KEY);
    } catch {
      // ignore storage errors
    }
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('全部');
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        [
          product.name,
          product.nameEn,
          product.origin,
          product.roast,
          product.process,
          product.category,
          ...product.flavor,
        ].some((field) => field.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Cart functions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`${product.name} 已加入購物車`);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-cocoa">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)}
        isCartOpen={isCartOpen}
        onCartClose={() => setIsCartOpen(false)}
      />

      {/* Hero Section — the specimen box */}
      <section className="relative overflow-hidden bg-cocoa">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 15%, rgba(201,137,47,0.14) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(158,43,78,0.16) 0%, transparent 45%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9 pb-7 sm:pb-9 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative border-2 border-gold px-5 sm:px-10 pt-10 pb-8 sm:pb-10"
          >
            <div className="absolute inset-1.5 border border-gold/35 pointer-events-none" />
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 bg-cocoa font-display italic text-lg sm:text-xl text-cream whitespace-nowrap">
              Single-Origin Reserve
            </span>

            <p className="uppercase text-[10px] sm:text-xs text-gold mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Dossier No. 047 — 精選咖啡標本
            </p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-cream leading-[1.08]">
                職人的
                <span className="italic font-semibold text-gold"> 風味標本 </span>
                收藏盒
              </h2>
              <p className="text-sm sm:text-base text-cream/80 leading-relaxed max-w-sm lg:border-l lg:border-gold/60 lg:pl-5">
                每一款咖啡豆都依產地、處理法與烘焙度編目歸檔。
                掀開盒蓋，品味每一片土地孕育出的獨特風味。
              </p>
            </div>

            {/* Specimen tiles */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-cocoa-deep border border-black/50 shadow-[inset_0_6px_18px_rgba(0,0,0,0.7)]">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="relative aspect-[4/3] bg-gradient-to-br from-cocoa to-cocoa-deep border border-gold/40 flex items-center justify-center"
                >
                  <span className="text-5xl drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)]">{product.emoji}</span>
                  <span className="uppercase absolute bottom-1.5 left-2 text-[8px] text-gold/80">
                    {product.origin.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <p className="uppercase text-[9px] sm:text-[10px] text-cream/50 text-center mt-5">
              † The lid rises on entry · {products.length} specimens catalogued
            </p>
          </motion.div>
        </div>

        {/* Strata divider */}
        <div className="py-5 border-y border-gold/50 relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rule-double opacity-60" />
          <div className="relative flex items-center justify-center gap-4">
            <Star className="w-3.5 h-3.5 text-berry fill-berry" />
            <span className="uppercase text-[10px] sm:text-xs text-gold px-4 bg-cocoa">Strata · 產地故事如下</span>
            <Star className="w-3.5 h-3.5 text-berry fill-berry" />
          </div>
        </div>
      </section>

      {/* Main Content — cream catalogue */}
      <main className="bg-cream text-cocoa">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <p className="uppercase text-[10px] text-berry font-semibold mb-2">Instrument I</p>
            <div className="flex items-end gap-4 mb-5">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-cocoa leading-none">
                分類<span className="italic font-semibold text-gold"> 瀏覽</span>
              </h3>
              <div className="flex-1 border-b border-dashed border-cocoa/40 mb-1.5" />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`uppercase px-4 sm:px-5 py-2.5 text-[11px] font-semibold transition-colors border ${
                    selectedCategory === category
                      ? 'bg-cocoa text-cream border-cocoa'
                      : 'bg-transparent text-cocoa border-cocoa/40 hover:border-cocoa hover:bg-cream-dark'
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="uppercase text-[11px] text-cocoa/70">
              {filteredProducts.length > 0 ? (
                <>找到 <span className="font-bold text-berry">{filteredProducts.length}</span> 款咖啡</>
              ) : (
                <span className="text-cocoa/50">沒有找到符合條件的產品</span>
              )}
            </p>
            {(searchQuery || selectedCategory !== '全部') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('全部');
                }}
                className="text-sm text-berry hover:text-cocoa underline underline-offset-4 transition-colors"
              >
                清除篩選
              </button>
            )}
          </div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAddToCart={(p) => addToCart(p)}
                    onViewDetail={(p) => {
                      setSelectedProduct(p);
                      setIsDetailOpen(true);
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <span className="text-5xl mb-4 block">🔍</span>
                <p className="font-display text-xl font-bold text-cocoa mb-2">沒有找到相關產品</p>
                <p className="text-cocoa/60 text-sm">請嘗試其他搜尋關鍵字或分類</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer — the ledger */}
      <footer className="bg-cocoa">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 bg-paper text-cocoa shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] border border-cream-dark">
            <div className="p-6 sm:p-8 md:border-r border-dashed border-cocoa/40">
              <div className="flex items-center justify-between border-b border-cocoa/60 pb-2 mb-5">
                <span className="uppercase text-[9px] text-cocoa/70">The Reserve Ledger</span>
                <span className="uppercase text-[9px] text-cocoa/70">Fol. I</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Coffee className="w-5 h-5 text-berry" />
                <span className="font-display font-extrabold text-xl">焙香咖啡</span>
              </div>
              <p className="text-sm leading-relaxed text-cocoa/80">
                致力於為您帶來世界各地最優質的精品咖啡體驗。每一顆豆子都經過嚴格篩選與精心烘焙。
              </p>
              <div className="space-y-2 text-sm mt-5 text-cocoa/80">
                <p>📧 hello@artisancoffee.tw</p>
                <p>📞 (02) 2345-6789</p>
                <p>📍 台北市大安區咖啡街 88 號</p>
              </div>
            </div>
            <div className="p-6 sm:p-8 border-t md:border-t-0 border-dashed border-cocoa/40">
              <div className="flex items-center justify-between border-b border-cocoa/60 pb-2 mb-5">
                <span className="uppercase text-[9px] text-cocoa/70">Service Index</span>
                <span className="uppercase text-[9px] text-cocoa/70">Fol. II</span>
              </div>
              <div className="space-y-4 text-sm">
                {[
                  ['滿 $800 免運費', 'Free shipping'],
                  ['7 天鑑賞期', 'Return window'],
                  ['工作日 24hr 出貨', 'Dispatch'],
                ].map(([zh, en]) => (
                  <div key={zh} className="flex items-baseline gap-2">
                    <span className="font-display font-bold">{zh}</span>
                    <span className="flex-1 border-b border-dotted border-cocoa/40" />
                    <span className="uppercase text-[9px] text-berry">{en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-gold/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
            <span className="font-display italic text-gold text-lg">Terroir &amp; Co.</span>
            <span className="uppercase text-[9px] text-cream/50">
              © 2026 焙香咖啡 Artisan Coffee Roasters · Catalogued by soil
            </span>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={(product, qty) => addToCart(product, qty)}
      />

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onComplete={handleCheckoutComplete}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[60] px-5 py-3 bg-cocoa-deep text-cream border border-gold shadow-xl text-sm font-medium flex items-center gap-2"
          >
            <span className="text-pistachio text-lg">✓</span>
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
