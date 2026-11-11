import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, ArrowLeft, ShieldCheck, Truck, RotateCcw, Headphones, Zap } from 'lucide-react';

interface HeroBannerProps {
  onShopNowClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNowClick }) => {
  const { themeConfig, language } = useShop();

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const title = isAr ? themeConfig.heroTitleAr : themeConfig.heroTitle;
  const subtitle = isAr ? themeConfig.heroSubtitleAr : themeConfig.heroSubtitle;
  const badge = isAr ? themeConfig.heroBadgeAr : themeConfig.heroBadge;

  const trustBadges = [
    {
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      titleAr: 'توصيل سريع ومجاني',
      titleEn: 'Fast & Free Delivery',
      descAr: 'للطلبات فوق 250 ر.س',
      descEn: 'On orders over 250 SAR',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      titleAr: 'دفع آمن 100%',
      titleEn: '100% Secure Payment',
      descAr: 'مدى، فيزا، آبل باي وتمارا',
      descEn: 'Mada, Apple Pay & Tamara',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-emerald-600" />,
      titleAr: 'إرجاع واستبدال سلس',
      titleEn: 'Hassle-Free Returns',
      descAr: 'خلال 14 يوماً من الاستلام',
      descEn: 'Within 14 days of receipt',
    },
    {
      icon: <Headphones className="w-5 h-5 text-emerald-600" />,
      titleAr: 'دعم عملاء متخصص',
      titleEn: 'Dedicated Support',
      descAr: 'خدمة عملاء على مدار الساعة',
      descEn: '24/7 priority customer care',
    },
  ];

  return (
    <div className="relative mb-8">
      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 min-h-[420px] sm:min-h-[480px] flex items-center shadow-xl">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url(${themeConfig.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent" />

        {/* Hero Content */}
        <div className="relative max-w-2xl px-6 sm:px-12 py-12 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>{badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onShopNowClick}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:translate-y-[-1px] active:translate-y-0"
            >
              <span>{isAr ? 'تسوق التشكيلة الآن' : 'Shop Collection Now'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 rounded-lg backdrop-blur-sm border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isAr ? 'كوبون متاح: SHOPIFY20' : 'Code: SHOPIFY20'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
        {trustBadges.map((badge, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              {badge.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isAr ? badge.titleAr : badge.titleEn}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {isAr ? badge.descAr : badge.descEn}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
