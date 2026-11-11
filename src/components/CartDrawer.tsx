import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/shopLogic';
import {
  X,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Tag,
  CheckCircle2,
  Truck,
  Sparkles,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotals,
    language,
    currency,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
    setCurrentView,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyDiscount(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {isAr ? 'سلة المشتريات' : 'Your Shopping Bag'}
              </h2>
              <span className="text-xs text-slate-500">
                {cartTotals.itemCount} {isAr ? 'منتجات' : 'items'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label={isAr ? 'إغلاق السلة' : 'Close Cart'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Milestone Bar */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>
                {cartTotals.amountNeededForFreeShipping === 0
                  ? isAr
                    ? 'تهانينا! حصلت على شحن مجاني 🎉'
                    : 'Congratulations! You unlocked free shipping! 🎉'
                  : isAr
                  ? `أضف ${formatPrice(cartTotals.amountNeededForFreeShipping, currency, language)} لتحصل على شحن مجاني`
                  : `Add ${formatPrice(cartTotals.amountNeededForFreeShipping, currency, language)} for free shipping`}
              </span>
            </div>
            <span className="text-emerald-700 font-mono">{cartTotals.freeShippingProgress}%</span>
          </div>
          {/* Progress track */}
          <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${cartTotals.freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <p className="font-bold text-slate-700 text-base mb-1">
                {isAr ? 'سلة التسوق فارغة حالياً' : 'Your cart is empty'}
              </p>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                {isAr
                  ? 'تصفح منتجاتنا المميزة وأضف أفضل القطع التي تناسب ذوقك'
                  : 'Explore our curated collections and add your favorite items'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {isAr ? 'استكشف المنتجات الآن' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemUnitPrice =
                item.product.price + (item.selectedVariant?.priceModifier || 0);
              return (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={isAr ? item.product.titleAr : item.product.title}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {isAr ? item.product.titleAr : item.product.title}
                        </h4>
                        {item.selectedVariant && (
                          <span className="text-[11px] text-slate-500 block truncate">
                            {isAr ? item.selectedVariant.nameAr : item.selectedVariant.name}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        aria-label={isAr ? 'حذف المنتج' : 'Delete Item'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 rounded-s-lg transition-colors text-slate-600"
                          aria-label={isAr ? 'تقليل الكمية' : 'Decrease'}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 px-2.5">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 rounded-e-lg transition-colors text-slate-600"
                          aria-label={isAr ? 'زيادة الكمية' : 'Increase'}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="font-bold text-sm text-slate-950">
                        {formatPrice(itemUnitPrice * item.quantity, currency, language)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedDiscount ? (
                <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {appliedDiscount.code} (
                      {isAr ? appliedDiscount.descriptionAr : appliedDiscount.descriptionEn})
                    </span>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className="text-slate-400 hover:text-rose-600 font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={isAr ? 'كود الخصم (مثال: SHOPIFY20)' : 'Discount code (SHOPIFY20)'}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full ps-9 pe-3 py-2 bg-white rounded-xl border border-slate-200 text-xs uppercase font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    {isAr ? 'تطبيق' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(cartTotals.subtotal, currency, language)}
                </span>
              </div>

              {cartTotals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{isAr ? 'الخصم المطبق:' : 'Discount:'}</span>
                  <span>-{formatPrice(cartTotals.discountAmount, currency, language)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'الشحن والتوصيل:' : 'Shipping:'}</span>
                <span className="font-semibold">
                  {cartTotals.shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">{isAr ? 'مجاني' : 'FREE'}</span>
                  ) : (
                    formatPrice(cartTotals.shipping, currency, language)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'ضريبة القيمة المضافة (15%):' : 'Estimated Taxes (15%):'}</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(cartTotals.tax, currency, language)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-black text-slate-950">
                <span>{isAr ? 'الإجمالي النهائي:' : 'Total:'}</span>
                <span className="text-emerald-700">
                  {formatPrice(cartTotals.total, currency, language)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:translate-y-[-1px] active:translate-y-0"
            >
              <span>{isAr ? 'متابعة الدفع وإنهاء الطلب' : 'Proceed to Checkout'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
