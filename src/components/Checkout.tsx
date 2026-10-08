import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Check, Truck, MapPin, User, Mail, Phone } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onComplete: () => void;
}

export default function Checkout({ isOpen, onClose, cartItems, onComplete }: CheckoutProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment: 'credit',
  });

  const [orderNumber, setOrderNumber] = useState('');
  const [completedOrder, setCompletedOrder] = useState({ orderNumber: '', itemCount: 0, total: 0 });

  useEffect(() => {
    if (!isOpen || step !== 'form') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, step, onClose]);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const snapshotTotal = total;
    setStep('processing');
    setTimeout(() => {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(1000 + Math.random() * 9000);
      const number = `EB-${date}-${random}`;
      setOrderNumber(number);
      setCompletedOrder({ orderNumber: number, itemCount, total: snapshotTotal });
      setStep('success');
    }, 2000);
  };

  const handleComplete = () => {
    onComplete();
    setStep('form');
    setOrderNumber('');
    setFormData({ name: '', email: '', phone: '', address: '', payment: 'credit' });
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={step === 'form' ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="結帳"
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl z-50"
          >
            {/* Close Button */}
            {step === 'form' && (
              <button
                onClick={onClose}
                aria-label="關閉結帳"
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-amber-50 hover:bg-amber-100 rounded-full flex items-center justify-center text-amber-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {step === 'form' && (
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-amber-950">結帳</h2>
                    <p className="text-xs text-amber-500">填寫資料完成訂單</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input
                      type="text"
                      placeholder="姓名"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input
                      type="email"
                      placeholder="電子郵件"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input
                      type="tel"
                      placeholder="聯絡電話"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all"
                    />
                  </div>

                  {/* Address */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
                    <textarea
                      placeholder="配送地址"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all resize-none"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-xs font-medium text-amber-700 mb-2 uppercase tracking-wide">付款方式</p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.payment === 'credit' ? 'bg-amber-50 border-amber-300' : 'bg-white border-amber-100 hover:border-amber-200'}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="credit"
                          checked={formData.payment === 'credit'}
                          onChange={() => setFormData({ ...formData, payment: 'credit' })}
                          className="sr-only"
                        />
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-800">信用卡</span>
                      </label>
                      <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.payment === 'cod' ? 'bg-amber-50 border-amber-300' : 'bg-white border-amber-100 hover:border-amber-200'}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={formData.payment === 'cod'}
                          onChange={() => setFormData({ ...formData, payment: 'cod' })}
                          className="sr-only"
                        />
                        <Truck className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-800">貨到付款</span>
                      </label>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-100">
                    <p className="text-xs font-medium text-amber-600 mb-2 uppercase tracking-wide">訂單摘要</p>
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm text-amber-700 py-1">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-base font-bold text-amber-900 pt-2 mt-2 border-t border-amber-200/50">
                      <span>總計</span>
                      <span>${total.toLocaleString()} TWD</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    確認下單
                  </motion.button>
                </form>
              </div>
            )}

            {step === 'processing' && (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full mb-6"
                />
                <h3 className="text-lg font-bold text-amber-900 mb-2">處理中...</h3>
                <p className="text-sm text-amber-600">正在確認您的訂單</p>
              </div>
            )}

            {step === 'success' && (
              <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                  <Check className="w-10 h-10 text-green-600" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-amber-900 mb-2"
                >
                  訂單已確認！
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-amber-600 mb-2"
                >
                  感謝您的購買，我們將盡快為您出貨
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-amber-400 mb-6"
                >
                  訂單編號：{orderNumber}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="w-full bg-amber-50/80 rounded-xl p-4 border border-amber-100 mb-6 space-y-1 text-sm text-amber-700"
                >
                  <div className="flex justify-between">
                    <span>商品數量</span>
                    <span>{completedOrder.itemCount} 件</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-900">
                    <span>訂單總額</span>
                    <span>${completedOrder.total.toLocaleString()} TWD</span>
                  </div>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleComplete}
                  className="px-8 py-3 bg-amber-800 hover:bg-amber-700 text-white font-medium rounded-full transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  繼續購物
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
