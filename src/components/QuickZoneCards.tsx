import React from 'react';
import { useStore } from '../context/StoreContext';
import { Zap, Shield, Clock } from 'lucide-react';

export const QuickZoneCards: React.FC = () => {
  const { navigateTo } = useStore();

  const zones = [
    {
      tag: 'TOP-UP ZONE',
      title: 'গেম টপআপ',
      subtitle: 'Free Fire, PUBG, MLBB, Valorant',
      icon: Zap,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-950/60 border-cyan-800/60',
      onClick: () => navigateTo('catalog', { categorySlug: 'game-top-up' }),
    },
    {
      tag: 'DIGITAL CARDS',
      title: 'গিফট কার্ড ও কি',
      subtitle: 'Steam, Google Play, Apple, Win 11',
      icon: Shield,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-950/60 border-purple-800/60',
      onClick: () => navigateTo('catalog', { categorySlug: 'digital-cards' }),
    },
    {
      tag: 'LIVE FEATURE',
      tagDot: true,
      title: 'অর্ডার ট্র্যাকার',
      subtitle: 'অর্ডার নম্বর দিয়ে লাইভ স্ট্যাটাস দেখুন',
      icon: Clock,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-950/60 border-cyan-800/60',
      onClick: () => navigateTo('track-order'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zones.map((zone, idx) => {
          const Icon = zone.icon;
          return (
            <div
              key={idx}
              onClick={zone.onClick}
              className="cursor-pointer group relative rounded-2xl bg-gradient-to-b from-[#0d1629] to-[#09101e] border border-slate-800/90 hover:border-cyan-500/50 p-5 transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {zone.tagDot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    {zone.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {zone.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{zone.subtitle}</p>
              </div>

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border ${zone.iconBg} ${zone.iconColor} group-hover:scale-110 transition-transform flex-shrink-0 ml-3`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
