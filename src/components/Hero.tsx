import React from 'react';
import { useStore } from '../context/StoreContext';
import { Zap, ArrowRight, CheckCircle2, ShieldCheck, Headphones, Clock } from 'lucide-react';

export const Hero: React.FC = () => {
  const { siteSettings, navigateTo } = useStore();

  return (
    <div className="relative pt-6 pb-8 md:pt-10 md:pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Hero Card Container matching reference screenshot */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-[#0e172a]/95 via-[#0b1222]/95 to-[#080d1a]/95 p-6 sm:p-10 md:p-14 shadow-2xl">
          
          {/* Subtle Gaming Background Imagery with overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center mix-blend-luminosity"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09101e] via-[#09101e]/85 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-3xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{siteSettings.heroBadge || 'বাংলাদেশি বিশ্বস্ত ডিজিটাল স্টোর ও ইনস্ট্যান্ট টপআপ'}</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[1.15] mb-5">
              <span>{siteSettings.heroTitle || 'ইনস্ট্যান্ট গেম টপআপ ও'}</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {siteSettings.heroTitleHighlight || 'ডিজিটাল গিফট কার্ড'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              {siteSettings.heroSubtitle ||
                'Free Fire, PUBG, Steam Wallet, Netflix, Discord Nitro সহ ১০০+ ডিজিটাল পণ্য ও সাবস্ক্রিপশন কিনুন বিকাশ, নগদ বা রকেট দিয়ে। স্বয়ংক্রিয় দ্রুত ডেলিভারি।'}
            </p>

            {/* Main Action Buttons matching screenshot */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              {/* Cyan Primary CTA */}
              <button
                onClick={() => navigateTo('catalog', { categorySlug: 'game-top-up' })}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-sm sm:text-base transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>গেম টপআপ করুন</span>
              </button>

              {/* Secondary Dark CTA */}
              <button
                onClick={() => navigateTo('catalog', { categorySlug: 'digital-cards' })}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#131d33] hover:bg-[#192744] text-white border border-slate-700/80 hover:border-cyan-500/50 font-medium text-sm sm:text-base transition-all hover:scale-[1.02]"
              >
                <span>গিফট কার্ড ব্রাউজ করুন</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>

              {/* Order Track Button */}
              <button
                onClick={() => navigateTo('track-order')}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-950/40 hover:bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-medium text-sm transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>অর্ডার ট্র্যাক করুন</span>
              </button>
            </div>

            {/* Trust Badges matching screenshot */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>১-৩ মিনিট ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>১০০% ভেরিফাইড গেটওয়ে</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-cyan-400" />
                <span>২৪/৭ কাস্টমার সাপোর্ট</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
