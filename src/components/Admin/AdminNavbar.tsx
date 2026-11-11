import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  ShoppingBag,
  ExternalLink,
  Bell,
  Search,
  Globe,
  CheckCircle2,
} from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const { themeConfig, language, setLanguage, setCurrentView, orders } = useShop();

  const isAr = language === 'ar';
  const unfulfilledCount = orders.filter((o) => o.status === 'unfulfilled').length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Store Identifier */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                {isAr ? themeConfig.storeNameAr : themeConfig.storeName}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Shopify Plus
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isAr ? 'المتجر مفعّل ونشط' : 'Store is live'}</span>
            </div>
          </div>
        </div>

        {/* Search in Admin */}
        <div className="flex-1 max-w-sm hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={isAr ? 'بحث في الطلبات، المنتجات، والعملاء...' : 'Search admin...'}
              className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 text-slate-200 text-xs ps-8 pe-3 py-1.5 rounded-lg border border-slate-700 focus:border-emerald-500 outline-hidden"
            />
          </div>
        </div>

        {/* Admin Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Notifications */}
          <div className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <Bell className="w-4 h-4" />
            {unfulfilledCount > 0 && (
              <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </div>

          {/* View Storefront Button */}
          <button
            onClick={() => setCurrentView('storefront')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>{isAr ? 'معاينة المتجر' : 'View Store'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
