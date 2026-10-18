import React, { useState } from 'react';
import { useAuth, AUTHORIZED_ADMIN_EMAIL } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import {
  LogIn,
  ArrowLeft,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const AdminSecurityGate: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const { navigateTo } = useStore();

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleAdminLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const loggedUser = await loginWithGoogle();
      if (!loggedUser) {
        setErrorMessage('লগইন বাতিল বা ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      } else if (!loggedUser.email || loggedUser.email.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        setErrorMessage('অ্যাক্সেস ডিনাইড! শুধুমাত্র অনুমোদিত নির্দিষ্ট এডমিন আইডি দিয়ে লগইন করলেই এডমিন প্যানেল অন হবে, অন্য কোনো একাউন্টে এডমিন এক্সেস দেওয়া হবে না।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'অথেন্টিকেশন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050912] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background security grid and glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#0a1122]/95 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Shield Icon */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mx-auto shadow-xl shadow-cyan-500/20 mb-3">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>

          <h2 className="font-heading font-black text-2xl text-white">
            এডমিন কন্ট্রোল প্যানেল
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            সংরক্ষিত এলাকা: শুধুমাত্র নির্দিষ্ট এডমিন আইডি দিয়ে লগইন করলেই এডমিন অন হবে
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Method: Google Owner Login via Supabase OAuth */}
          <div className="p-5 rounded-2xl bg-[#0d1629] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">এডমিন গুগল একাউন্ট সাইন-ইন:</span>
              <span className="text-[10px] text-cyan-400 font-mono">Supabase Google Auth</span>
            </div>

            <button
              onClick={handleGoogleAdminLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-heading font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-[0.99] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'অথেন্টিকেশন ভেরিফাই হচ্ছে...' : 'Google দিয়ে সাইন ইন করুন (Admin Sign-In)'}</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              শুধুমাত্র অনুমোদিত এডমিন গুগল একাউন্ট দিয়ে সাইন ইন করলেই এডমিন কন্ট্রোল এক্সেস প্রদান করা হবে।
            </p>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigateTo('home')}
          className="w-full py-2 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>মূল ওয়েবসাইটে ফিরে যান</span>
        </button>
      </div>
    </div>
  );
};
