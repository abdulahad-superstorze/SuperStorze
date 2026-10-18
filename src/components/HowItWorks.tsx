import React from 'react';
import { useLanguage } from '../context/ThemeLanguageContext';

export const HowItWorks: React.FC = () => {
  const { isBangla, t } = useLanguage();

  const steps = [
    {
      num: isBangla ? '১' : '1',
      title: t('step_1_title'),
      desc: t('step_1_desc'),
    },
    {
      num: isBangla ? '২' : '2',
      title: t('step_2_title'),
      desc: t('step_2_desc'),
    },
    {
      num: isBangla ? '৩' : '3',
      title: t('step_3_title'),
      desc: t('step_3_desc'),
    },
  ];

  return (
    <section className="py-14 border-t border-slate-800/80 bg-gradient-to-b from-transparent via-[#0a1122]/60 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-[#0a1120]/80 p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle gradient glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 blur-[100px] pointer-events-none" />

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              {t('how_it_works_title')}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              {t('how_it_works_subtitle')}
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#0e172a]/90 border border-slate-800 p-6 relative hover:border-cyan-500/40 transition-colors"
              >
                {/* Number Badge */}
                <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400 font-heading font-bold text-base flex items-center justify-center mb-4">
                  {s.num}
                </div>

                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
