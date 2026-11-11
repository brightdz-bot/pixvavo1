import React from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/shopLogic';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    language,
    currency,
  } = useShop();

  if (!isWishlistOpen) return null;

  const isAr = language === 'ar';
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer */}
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-bold text-slate-900 text-base">
              {isAr ? 'قائمة الرغبات والمفضلة' : 'My Wishlist'}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
              {wishlistedProducts.length}
            </span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label={isAr ? 'إغلاق المفضلة' : 'Close Wishlist'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Heart className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-bold text-slate-700 text-base mb-1">
                {isAr ? 'لا توجد منتجات بالمفضلة' : 'Your wishlist is empty'}
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                {isAr
                  ? 'اضغط على رمز القلب عند أي منتج لحفظه في قائمتك المفضلة'
                  : 'Click the heart icon on any product to save it here'}
              </p>
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div
                key={p.id}
                className="flex gap-3.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs items-center"
              >
                <img
                  src={p.images[0]}
                  alt={isAr ? p.titleAr : p.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {isAr ? p.titleAr : p.title}
                  </h4>
                  <span className="text-xs font-bold text-emerald-700">
                    {formatPrice(p.price, currency, language)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      addToCart(p, undefined, 1);
                      toggleWishlist(p.id);
                    }}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                    title={isAr ? 'نقل للسلة' : 'Move to Cart'}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
                    title={isAr ? 'إزالة' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
