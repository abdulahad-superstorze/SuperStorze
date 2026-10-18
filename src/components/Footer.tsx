import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/ThemeLanguageContext';

export const Footer: React.FC = () => {
  const { siteSettings, navigateTo } = useStore();
  const { isAdmin } = useAuth();
  const { isBangla, t } = useLanguage();

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
              {isBangla
                ? siteSettings.footerText ||
                  'বাংলাদেশের সবচেয়ে নির্ভরযোগ্য ডিজিটাল পণ্য ও ইনস্ট্যান্ট গেম টপআপ মার্কেটপ্লেস। ১০০% অফিশিয়াল ও নিরাপদ গেটওয়ে।'
                : 'Bangladesh’s most trusted marketplace for digital game top-ups and gift cards. 100% official and automated.'}
            </p>
            <div className="text-xs text-slate-500">
              {isBangla
                ? 'সার্বক্ষণিক ডিজিটাল অটোমেশন ও সিকিউর গেটওয়ে সংযুক্ত।'
                : '24/7 automated delivery & secure payment gateway.'}
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">
              {isBangla ? 'ক্যাটাগরি সমূহ' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('catalog', { categorySlug: 'game-top-up' })}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {isBangla ? 'ফ্রি ফায়ার ডায়মন্ড টপআপ' : 'Free Fire Diamond Top-Up'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { categorySlug: 'game-top-up' })}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {isBangla ? 'পাবজি মোবাইল ইউসি (UC)' : 'PUBG Mobile UC'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { categorySlug: 'digital-cards' })}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {isBangla ? 'স্টিম ওয়ালেট গিফট কার্ড' : 'Steam Wallet Gift Cards'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { categorySlug: 'digital-cards' })}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {isBangla ? 'গুগল প্লে স্টোর কার্ড' : 'Google Play Gift Cards'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">
              {isBangla ? 'কাস্টমার সার্ভিস' : 'Customer Service'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                >
                  {isBangla ? 'অর্ডার লাইভ ট্র্যাক করুন' : 'Live Order Tracker'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {isBangla ? 'ওয়ালেট ব্যালেন্স ও হিস্ট্রি' : 'Wallet Balance & History'}
                </button>
              </li>
              <li className="text-slate-400">
                <span>{isBangla ? 'হোয়াটসঅ্যাপ সাপোর্ট: ' : 'WhatsApp Support: '}</span>
                <span className="text-slate-300 font-mono">
                  {siteSettings.supportWhatsapp || '+880 1788-992211'}
                </span>
              </li>
              <li className="text-slate-400">
                <span>{isBangla ? 'ইমেইল: ' : 'Email: '}</span>
                <span className="text-slate-300 font-mono">
                  {siteSettings.supportEmail || 'support@superstorez.com'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Safe Payments */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">
              {isBangla ? 'নিরাপদ পেমেন্ট মেথড' : 'Payment Methods'}
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
              {isBangla
                ? 'সমস্ত লেনদেন এনক্রিপ্ট করা ও রিয়েল-টাইম MFS লেজার দ্বারা সুরক্ষিত।'
                : 'All transactions are encrypted and tracked via real-time ledger.'}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 {siteSettings.storeName || 'SuperStorez.com'}. {isBangla ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="hover:text-slate-400 cursor-pointer">{isBangla ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">{isBangla ? 'টার্মস অ্যান্ড কন্ডিশনস' : 'Terms & Conditions'}</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">{isBangla ? 'রিফান্ড গ্যারান্টি' : 'Refund Policy'}</span>

            {/* Admin Portal Access */}
            {isAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={() => navigateTo('admin')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-800/60 text-[11px] transition-all cursor-pointer"
                  title="SuperStorez Admin Dashboard"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{isBangla ? 'এডমিন প্যানেল' : 'Admin Panel'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
