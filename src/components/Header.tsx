import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Globe,
  LayoutDashboard,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/shopLogic';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery = '' }) => {
  const {
    themeConfig,
    language,
    setLanguage,
    currency,
    setCurrency,
    cartTotals,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    currentView,
    setCurrentView,
    orders,
  } = useShop();

  const [announcementClosed, setAnnouncementClosed] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === 'unfulfilled').length;

  const currencies: Currency[] = ['SAR', 'USD', 'AED', 'EUR'];

  const storeTitle =
    language === 'ar' ? themeConfig.storeNameAr : themeConfig.storeName;
  const announcementText =
    language === 'ar' ? themeConfig.announcementTextAr : themeConfig.announcementText;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      {themeConfig.announcementEnabled && !announcementClosed && (
        <div className="bg-emerald-900 text-emerald-50 px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between relative transition-all">
          <div className="flex-1 flex items-center justify-center gap-2 text-center">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:inline" />
            <span>{announcementText}</span>
          </div>
          <button
            onClick={() => setAnnouncementClosed(true)}
            className="p-1 hover:bg-emerald-800 rounded-md transition-colors text-emerald-300 hover:text-white"
            aria-label={language === 'ar' ? 'إغلاق الإعلان' : 'Close announcement'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
              aria-label={language === 'ar' ? 'الصفحة الرئيسية للمتجر' : 'Store Home'}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  {storeTitle}
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                    Shopify
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:block">
                  {language === 'ar' ? 'المتجر الرسمي المعتمد' : 'Official Verified Store'}
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'ابحث عن منتج، ماركة، أو تصنيف...'
                    : 'Search products, brands, collections...'
                }
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 text-sm ps-10 pe-4 py-2 rounded-xl border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                aria-label={language === 'ar' ? 'تغيير العملة' : 'Change Currency'}
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {currencyMenuOpen && (
                <div className="absolute end-0 mt-1.5 w-28 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 text-xs font-medium hover:bg-slate-100 transition-colors flex items-center justify-between ${
                        currency === c ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{c}</span>
                      {currency === c && <span className="text-emerald-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label={language === 'ar' ? 'تغيير اللغة إلى الإنجليزية' : 'Change language to Arabic'}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={language === 'ar' ? 'قائمة الرغبات والمفضلة' : 'Wishlist'}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -end-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
              aria-label={language === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col text-start">
                <span className="text-xs font-bold leading-tight">
                  {cartTotals.itemCount} {language === 'ar' ? 'عناصر' : 'items'}
                </span>
                <span className="text-[10px] text-slate-300 font-medium">
                  {formatPrice(cartTotals.subtotal, currency, language)}
                </span>
              </div>
            </button>

            {/* Shopify Admin Toggle Button */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'storefront' : 'admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                currentView === 'admin'
                  ? 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/25'
              }`}
              aria-label={
                currentView === 'admin'
                  ? language === 'ar'
                    ? 'العودة لواجهة المتجر'
                    : 'View Storefront'
                  : language === 'ar'
                  ? 'لوحة تحكم شوبيفاي'
                  : 'Shopify Admin'
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden lg:inline">
                {currentView === 'admin'
                  ? language === 'ar'
                    ? 'معاينة المتجر'
                    : 'View Storefront'
                  : language === 'ar'
                  ? 'لوحة تحكم شوبيفاي'
                  : 'Shopify Admin'}
              </span>
              {pendingOrdersCount > 0 && currentView !== 'admin' && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث في المنتجات...' : 'Search products...'}
              className="w-full bg-slate-100 text-slate-800 text-xs ps-9 pe-3 py-2 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
