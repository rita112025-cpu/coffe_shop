import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { products, categories } from './data/products';
import { Product, CartItem, Category } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('全部');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavor.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-amber-50/50">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)}
        isCartOpen={isCartOpen}
        onCartClose={() => setIsCartOpen(false)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/10 backdrop-blur-sm rounded-full border border-amber-200/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm text-amber-200">精選產地直送</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-50 mb-4 leading-tight">
              每一杯，都是
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-200">
                風味的探索
              </span>
            </h2>
            <p className="text-amber-200/80 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed">
              我們嚴選世界各地的精品咖啡豆，以精湛的烘焙技藝，
              為您呈現最純粹的咖啡風味體驗
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 text-amber-200/60 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                <span>精品烘焙</span>
              </div>
              <div className="w-1 h-1 bg-amber-400/40 rounded-full" />
              <span>產地直送</span>
              <div className="w-1 h-1 bg-amber-400/40 rounded-full" />
              <span>新鮮保證</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">分類瀏覽</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-800 text-white shadow-md shadow-amber-800/20'
                    : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-100 hover:border-amber-200'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-amber-600">
            {filteredProducts.length > 0 ? (
              <>找到 <span className="font-semibold text-amber-800">{filteredProducts.length}</span> 款咖啡</>
            ) : (
              <span className="text-amber-400">沒有找到符合條件的產品</span>
            )}
          </p>
          {(searchQuery || selectedCategory !== '全部') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('全部');
              }}
              className="text-sm text-amber-600 hover:text-amber-800 underline underline-offset-2 transition-colors"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
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
              <p className="text-amber-800 font-medium text-lg mb-2">沒有找到相關產品</p>
              <p className="text-amber-500 text-sm">請嘗試其他搜尋關鍵字或分類</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-200/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Coffee className="w-5 h-5 text-amber-300" />
                <span className="text-amber-100 font-bold">焙香咖啡</span>
              </div>
              <p className="text-sm leading-relaxed">
                致力於為您帶來世界各地最優質的精品咖啡體驗。每一顆豆子都經過嚴格篩選與精心烘焙。
              </p>
            </div>
            <div>
              <h4 className="text-amber-100 font-semibold mb-3 text-sm">聯絡我們</h4>
              <div className="space-y-2 text-sm">
                <p>📧 hello@artisancoffee.tw</p>
                <p>📞 (02) 2345-6789</p>
                <p>📍 台北市大安區咖啡街 88 號</p>
              </div>
            </div>
            <div>
              <h4 className="text-amber-100 font-semibold mb-3 text-sm">服務資訊</h4>
              <div className="space-y-2 text-sm">
                <p>🚚 滿 $800 免運費</p>
                <p>🔄 7 天鑑賞期</p>
                <p>🕐 工作日 24hr 出貨</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-amber-800/50 text-center text-xs text-amber-400/50">
            © 2026 焙香咖啡 Artisan Coffee Roasters. All rights reserved.
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
            className="fixed bottom-6 left-1/2 z-[60] px-5 py-3 bg-amber-900 text-amber-50 rounded-full shadow-xl text-sm font-medium flex items-center gap-2"
          >
            <span className="text-lg">✓</span>
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
