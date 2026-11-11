import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Mail, ShieldCheck, Heart, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { themeConfig, language, showToast } = useShop();

  const isAr = language === 'ar';
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast(
      isAr
        ? 'شكراً لاشتراكك! تم إرسال كود الخصم الترحيبي 10% لبريدك الإلكتروني'
        : 'Thank you for subscribing! Your 10% coupon has been sent.'
    );
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                {isAr ? themeConfig.storeNameAr : themeConfig.storeName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isAr
                ? 'متجر إلكتروني متكامل مبني وفق أعلى معايير ومواصفات منصة شوبيفاي العالمية لتوفير تجربة تسوق استثنائية وسلسة.'
                : 'Full-featured commerce experience built according to official Shopify store specifications.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'متجر معتمد وموثق رسمياً' : 'Verified & Secure Store'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">
              {isAr ? 'أقسام المتجر' : 'Collections'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#catalog-section" className="hover:text-emerald-400 transition-colors">
                  {isAr ? 'الأجهزة والإلكترونيات' : 'Smart Electronics'}
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-emerald-400 transition-colors">
                  {isAr ? 'الأزياء والحقائب الجلدية' : 'Fashion & Accessories'}
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-emerald-400 transition-colors">
                  {isAr ? 'العطور الملكية والبخور' : 'Oriental Perfumes & Oud'}
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-emerald-400 transition-colors">
                  {isAr ? 'مستلزمات القهوة والمنزل' : 'Home Living & Coffee'}
                </a>
              </li>
            </ul>
          </div>

          {/* Policies & Help */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">
              {isAr ? 'خدمة العملاء والسياسات' : 'Customer Service'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white cursor-pointer">
                {isAr ? 'سياسة الشحن والتوصيل' : 'Shipping Policy'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {isAr ? 'سياسة الاستبدال والاسترجاع' : 'Refunds & Returns'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {isAr ? 'الأسئلة الشائعة (FAQ)' : 'FAQ'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {isAr ? 'تتبع شحنتك' : 'Track Your Shipment'}
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">
              {isAr ? 'النشرة البريدية الحصرية' : 'Newsletter'}
            </h4>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'اشترك ليصلك كود خصم 10% فورياً بالإضافة إلى أحدث العروض والمنتجات.'
                : 'Subscribe to get 10% off your first order and exclusive weekly drops.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder={isAr ? 'بريدك الإلكتروني' : 'Your email'}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar with payment badges and copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()}{' '}
            {isAr ? themeConfig.storeNameAr : themeConfig.storeName}. Powered by Shopify Engine.
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
              Pay
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-emerald-400">
              مدى
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-blue-400">
              VISA
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-amber-400">
              Mastercard
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-amber-300">
              Tamara
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
