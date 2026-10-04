import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { createDepositRequest } from '../services/storeService';
import {
  X,
  Wallet,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, profile } = useAuth();
  const { siteSettings, showToast } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Cellfin' | 'Upay'>('bKash');
  const [amount, setAmount] = useState<string>('500');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [userNote, setUserNote] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Get active target number based on payment method
  const getTargetNumber = () => {
    switch (paymentMethod) {
      case 'bKash':
        return {
          number: siteSettings.bkashNumber || '01859665565',
          type: siteSettings.bkashType || 'Personal / Send Money',
          color: 'from-pink-600 to-rose-600',
          textColor: 'text-pink-400',
          borderColor: 'border-pink-500/40',
          bgActive: 'bg-pink-600/20 text-pink-300 border-pink-500',
        };
      case 'Nagad':
        return {
          number: siteSettings.nagadNumber || '01859665565',
          type: siteSettings.nagadType || 'Personal / Send Money',
          color: 'from-orange-600 to-amber-600',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/40',
          bgActive: 'bg-orange-600/20 text-orange-300 border-orange-500',
        };
      case 'Rocket':
        return {
          number: siteSettings.rocketNumber || '01859665565',
          type: siteSettings.rocketType || 'Personal / Send Money',
          color: 'from-purple-600 to-indigo-600',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/40',
          bgActive: 'bg-purple-600/20 text-purple-300 border-purple-500',
        };
      case 'Cellfin':
      case 'Upay':
        return {
          number: siteSettings.bkashNumber || '01859665565',
          type: 'Bank Transfer / Personal',
          color: 'from-cyan-600 to-blue-600',
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/40',
          bgActive: 'bg-cyan-600/20 text-cyan-300 border-cyan-500',
        };
      default:
        return {
          number: siteSettings.bkashNumber || '01859665565',
          type: 'Personal / Send Money',
          color: 'from-cyan-600 to-blue-600',
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/40',
          bgActive: 'bg-cyan-600/20 text-cyan-300 border-cyan-500',
        };
    }
  };

  const target = getTargetNumber();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    showToast('নাম্বার কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) আপলোড করা যাবে।');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('ছবির সাইজ ৫MB এর বেশি হতে পারবে না।');
      return;
    }

    setErrorMsg('');
    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setScreenshotUrl(base64);
      setIsUploadingImage(false);
      showToast('স্ক্রিনশট সফলভাবে সিলেক্ট করা হয়েছে!', 'success');
    };
    reader.onerror = () => {
      setErrorMsg('ছবি পড়তে সমস্যা হয়েছে। দয়া করে অন্য ছবি চেষ্টা করুন।');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('ডিপোজিট রিকোয়েস্ট পাঠানোর জন্য অনুগ্রহ করে প্রথমে সাইন ইন করুন।');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 20) {
      setErrorMsg('সর্বনিম্ন ডিপোজিট পরিমাণ ৳ ২০ টাকা।');
      return;
    }

    if (!senderNumber.trim() || senderNumber.trim().length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের প্রেরক মোবাইল নাম্বার লিখুন।');
      return;
    }

    if (!transactionId.trim() || transactionId.trim().length < 4) {
      setErrorMsg('সঠিক লেনদেন আইডি (Transaction ID / TrxID) লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDepositRequest({
        userId: user.uid,
        userName: profile?.displayName || user.displayName || 'Customer',
        userEmail: user.email || '',
        amount: numAmount,
        paymentMethod,
        targetNumber: target.number,
        senderNumber: senderNumber.trim(),
        transactionId: transactionId.trim().toUpperCase(),
        screenshotUrl: screenshotUrl || '',
        userNote: userNote.trim() || '',
      });

      showToast(
        `ডিপোজিট রিকোয়েস্ট সফলভাবে জমা হয়েছে! এডমিন ভেরিফাই করে কিছুক্ষণের মধ্যে ৳${numAmount} যুক্ত করবেন।`,
        'success'
      );

      // Reset form
      setSenderNumber('');
      setTransactionId('');
      setUserNote('');
      setScreenshotUrl('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Deposit submission error:', err);
      setErrorMsg(err.message || 'ডিপোজিট রিকোয়েস্ট জমা দেওয়া সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0a1122] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
              ওয়ালেট ডিপোজিট (ম্যানুয়াল)
            </h2>
            <p className="text-xs text-slate-400">
              বিকাশ, নগদ বা রকেটে টাকা পাঠিয়ে TrxID ও স্ক্রিনশট সাবমিট করুন
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              ১. পেমেন্ট মাধ্যম নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'bKash', label: 'বিকাশ (bKash)', bg: 'hover:border-pink-500' },
                { id: 'Nagad', label: 'নগদ (Nagad)', bg: 'hover:border-orange-500' },
                { id: 'Rocket', label: 'রকেট (Rocket)', bg: 'hover:border-purple-500' },
                { id: 'Cellfin', label: 'সেলফিন/উপায়', bg: 'hover:border-cyan-500' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    paymentMethod === m.id
                      ? `${target.bgActive} shadow-md`
                      : 'bg-[#060c18] border-slate-800 text-slate-300 ' + m.bg
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Official Number Copy Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1629] to-[#080e1c] border border-slate-800 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${target.textColor}`}>
                    {paymentMethod} একাউন্ট নাম্বার:
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {target.type}
                  </span>
                </div>
                <div className="font-heading font-black text-xl sm:text-2xl text-white tracking-wider font-mono">
                  {target.number}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  অ্যাপ থেকে এই নাম্বারে <strong className="text-slate-200">Send Money</strong> করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(target.number)}
                className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                {copiedNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedNumber ? 'কপি হয়েছে' : 'নাম্বার কপি'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Amount & Quick Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                ২. জমার পরিমাণ (টাকা):
              </label>
              <span className="text-[11px] text-slate-400 font-mono">সর্বনিম্ন: ৳২০</span>
            </div>

            <div className="relative mb-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                ৳
              </span>
              <input
                type="number"
                min="20"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full bg-[#060c18] border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 pl-8 pr-4 text-white text-base font-bold font-mono focus:outline-none"
                required
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="flex flex-wrap gap-2">
              {['100', '200', '500', '1000', '2000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    amount === amt
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  +৳{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Sender Phone & Transaction ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ৩. যে নাম্বার থেকে পাঠিয়েছেন (Sender No):
              </label>
              <input
                type="tel"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full bg-[#060c18] border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-3.5 text-white text-xs font-mono focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ৪. ট্রানজেকশন আইডি (TrxID):
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                placeholder="9JA82K19B"
                className="w-full bg-[#060c18] border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-3.5 text-white text-xs font-mono tracking-wider focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Step 4: Screenshot Upload (Payment Proof) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>৫. পেমেন্ট কনফার্মেশন স্ক্রিনশট (প্রুফ):</span>
              </label>
              <span className="text-[11px] text-cyan-400">খুব দ্রুত ভেরিফিকেশনের জন্য জরুরি</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            {screenshotUrl ? (
              <div className="relative p-3 rounded-2xl bg-[#060c18] border border-cyan-800/80 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/60 border border-slate-700 flex-shrink-0">
                  <img
                    src={screenshotUrl}
                    alt="Payment Screenshot"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>স্ক্রিনশট যোগ করা হয়েছে</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    এডমিন এই স্ক্রিনশট দেখে সাথে সাথে ভেরিফাই করবেন।
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshotUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 mt-2 font-semibold underline"
                  >
                    ছবিটি মুছে অন্য ছবি দিন
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-[#060c18]/80 hover:bg-[#091224] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-center"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 group-hover:bg-cyan-950 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 border border-slate-800 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="text-cyan-400 font-bold">এখানে ক্লিক করে স্ক্রিনশট আপলোড করুন</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    (বিকাশ/নগদ অ্যাপের কনফার্মেশন স্ক্রিন বা SMS স্ক্রিনশট, সর্বোচ্চ ৫MB)
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              অতিরিক্ত কোনো মন্তব্য (ঐচ্ছিক):
            </label>
            <input
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="যেমন: দ্রুত ভেরিফাই করে দিন..."
              className="w-full bg-[#060c18] border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-white text-xs focus:outline-none"
            />
          </div>

          {/* Submit & Back Buttons */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3.5 px-5 rounded-2xl bg-[#0e172a] hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition-all cursor-pointer"
              >
                ← পেছনে যান
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-heading font-black text-sm transition-all shadow-xl shadow-cyan-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>রিকোয়েস্ট পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>ডিপোজিট নিশ্চিত করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              🔒 আপনার লেনদেন সম্পূর্ণ নিরাপদ। এডমিন ভেরিফাই করামাত্র স্বয়ংক্রিয়ভাবে ওয়ালেট ব্যালেন্স বাড়বে।
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
