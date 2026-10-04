import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { DepositModal } from './DepositModal';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Wallet,
  PlusCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, isCartOpen, setIsCartOpen } =
    useCart();
  const { navigateTo } = useStore();
  const { profile } = useAuth();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const currentWallet = profile?.walletBalance ?? 0;
  const isBalanceShort = subtotal > currentWallet;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0a1122] border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header with Back & Close */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#080d1a]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer mr-1"
                title="পেছনে ফিরে যান"
              >
                <ArrowLeft className="w-5 h-5 text-cyan-400" />
              </button>
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                আপনার কার্ট ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Wallet Balance & Deposit Box */}
          <div className="p-3.5 mx-4 sm:mx-5 mt-4 rounded-2xl bg-gradient-to-r from-[#0d1629] via-[#091122] to-[#060b17] border border-cyan-800/60 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-800/80">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ওয়ালেট ব্যালেন্স</span>
                <span className="font-heading font-black text-sm text-cyan-400">
                  ৳ {currentWallet.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>ডিপোজিট করুন</span>
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-medium text-white mb-1">কার্ট বর্তমানে খালি রয়েছে</p>
                <p className="text-xs text-slate-400 mb-6">
                  আপনার পছন্দের গেম টপআপ বা ডিজিটাল কার্ড যোগ করতে ব্রাউজ করুন।
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('catalog');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  প্রোডাক্ট ব্রাউজ করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#0e172a] border border-slate-800 p-3.5 relative group flex gap-3"
                >
                  {/* Thumbnail */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-800 flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-heading font-bold text-sm text-white truncate">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-cyan-400 font-medium mt-0.5">
                      প্যাকেজ: {item.variationName}
                    </div>

                    {/* Custom credentials summary (Player ID, etc.) */}
                    {item.customFieldValues &&
                      Object.keys(item.customFieldValues).length > 0 && (
                        <div className="mt-1 text-[11px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800/60">
                          {Object.entries(item.customFieldValues).map(([key, val]) => (
                            <div key={key} className="truncate">
                              <span className="text-slate-500">{key}: </span>
                              <span className="text-slate-300 font-mono">{val}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-heading font-bold text-cyan-400 text-sm">
                        ৳ {item.price * item.quantity}
                      </span>

                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#080d19] space-y-3">
              {/* Wallet shortage indicator */}
              {isBalanceShort ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                    <span>ওয়ালেটে ৳{(subtotal - currentWallet).toFixed(0)} ঘাটতি আছে</span>
                  </div>
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer ml-2 flex-shrink-0"
                  >
                    + ডিপোজিট
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স আছে! ১-ক্লিকে অর্ডার হবে।</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>সাবটোটাল</span>
                <span className="font-heading font-black text-xl text-cyan-400">
                  ৳ {subtotal}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                ভ্যাট বা কোনো অতিরিক্ত ফি নেই। ১০০% সুরক্ষিত লেনদেন ও ইনস্ট্যান্ট ডেলিভারি।
              </p>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('checkout');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-heading font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.99] cursor-pointer"
                >
                  <span>চেকআউট করুন (Checkout)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Back button to continue shopping */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#0e172a] hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                  <span>← কেনাকাটায় ফিরে যান (Back to Shop)</span>
                </button>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('catalog');
                    }}
                    className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    সকল ক্যাটালগ
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-rose-400/80 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    কার্ট খালি করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
    </div>
  );
};
