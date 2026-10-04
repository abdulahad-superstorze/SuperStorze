import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { siteSettings, navigateTo } = useStore();
  const { isAdmin } = useAuth();

  return (
    <footer className="border-t border-slate-800 bg-[#050912] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div>
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 cursor-pointer mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center font-heading font-black text-black text-sm">
                SS
              </div>
              <span className="font-heading font-bold text-xl text-white">
                {siteSettings.storeName || 'SuperStorez.com'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {siteSettings.footerText ||
                'বাংলাদেশের সবচেয়ে নির্ভরযোগ্য ডিজিটাল পণ্য ও ইনস্ট্যান্ট গেম টপআপ মার্কেটপ্লেস। ১০০% অফিশিয়াল ও নিরাপদ গেটওয়ে।'}
            </p>
            <div className="text-xs text-slate-500">
              সার্বক্ষণিক ডিজিটাল অটোমেশন ও সিকিউর গেটওয়ে সংযুক্ত।
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">
              ক্যাটাগরি সমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('catalog', { categorySlug: 'game-top-up' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  ফ্রি ফায়ার ডায়মন্ড টপআপ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { categorySlug: 'game-top-up' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  পাবজি মোবাইল ইউসি (UC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { categorySlug: 'digital-cards' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  স্টিম ওয়ালেট গিফট কার্ড
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { categorySlug: 'digital-cards' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  গুগল প্লে স্টোর কার্ড
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">
              কাস্টমার সার্ভিস
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  অর্ডার লাইভ ট্র্যাক করুন
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  ওয়ালেট ব্যালেন্স ও হিস্ট্রি
                </button>
              </li>
              <li className="text-slate-400">
                <span>হোয়াটসঅ্যাপ সাপোর্ট: </span>
                <span className="text-slate-300 font-mono">
                  {siteSettings.supportWhatsapp || '+880 1788-992211'}
                </span>
              </li>
              <li className="text-slate-400">
                <span>ইমেইল: </span>
                <span className="text-slate-300 font-mono">
                  {siteSettings.supportEmail || 'support@superstorez.com'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Safe Payments */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">
              নিরাপদ পেমেন্ট মেথড
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2.5 py-1 rounded bg-[#e2136e]/20 text-[#ff4f9e] border border-[#e2136e]/40 font-bold text-[11px]">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded bg-[#f7941d]/20 text-[#ffaa47] border border-[#f7941d]/40 font-bold text-[11px]">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded bg-[#8c3795]/20 text-[#d46fe0] border border-[#8c3795]/40 font-bold text-[11px]">
                Rocket
              </span>
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-bold text-[11px]">
                SSBD Wallet
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              সমস্ত লেনদেন এনক্রিপ্ট করা ও রিয়েল-টাইম MFS লেজার দ্বারা সুরক্ষিত।
            </p>
          </div>
        </div>

        {/* Bottom bar - Admin Access at the very bottom */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 {siteSettings.storeName || 'SuperStorez.com'}. সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="hover:text-slate-400 cursor-pointer">প্রাইভেসি পলিসি</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">টার্মস অ্যান্ড কন্ডিশনস</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">রিফান্ড গ্যারান্টি</span>

            {/* Admin Portal Access: ONLY visible to logged-in admin. Completely invisible to all normal users */}
            {isAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={() => navigateTo('admin')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-800/60 text-[11px] transition-all cursor-pointer"
                  title="SuperStorez Admin Dashboard"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>এডমিন প্যানেল</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
