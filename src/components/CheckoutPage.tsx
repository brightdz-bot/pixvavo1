import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/shopLogic';
import { PaymentMethod } from '../types';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  ShieldCheck,
  Tag,
  AlertCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotals,
    language,
    currency,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
    createOrder,
    setCurrentView,
  } = useShop();

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  // Form Fields
  const [formData, setFormData] = useState({
    name: 'سلطان القحطاني',
    email: 'sultan.qahtani@example.com',
    phone: '+966 50 889 9123',
    address: 'حي الملقا، طريق أنس بن مالك',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    postalCode: '13521',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isAr ? 'السلة فارغة' : 'Your Cart is Empty'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isAr ? 'لا يمكنك المتابعة للدفع وسلتك فارغة' : 'Cannot proceed to checkout with an empty cart.'}
        </p>
        <button
          onClick={() => setCurrentView('storefront')}
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-500"
        >
          {isAr ? 'العودة للتسوق' : 'Return to Shop'}
        </button>
      </div>
    );
  }

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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.address.trim()) {
      setFormError(isAr ? 'يرجى إكمال جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        customer: formData,
        paymentMethod,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Shopify Checkout Top Navigation */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
          <button
            onClick={() => setCurrentView('storefront')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ChevronIcon className="w-4 h-4 rotate-180" />
            <span>{isAr ? 'العودة لمتجر شوبيفاي' : 'Return to Storefront'}</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-700">{isAr ? 'دفع آمن ومشفر 256-bit' : '256-bit Secure Checkout'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              {/* Step 1: Customer Contact */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>{isAr ? 'معلومات التواصل' : 'Contact Information'}</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isAr ? 'لديك حساب؟ تسجيل دخول سريع' : 'Already have an account? Sign in'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isAr ? 'الاسم الكامل' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isAr ? 'رقم الجوال' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>{isAr ? 'عنوان الشحن والتوصيل' : 'Shipping Address'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isAr ? 'العنوان / اسم الحي والشارع' : 'Street Address'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isAr ? 'المدينة' : 'City'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isAr ? 'الدولة' : 'Country'} *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden bg-white"
                    >
                      <option value="المملكة العربية السعودية">المملكة العربية السعودية (KSA)</option>
                      <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة (UAE)</option>
                      <option value="الكويت">الكويت (Kuwait)</option>
                      <option value="قطر">قطر (Qatar)</option>
                      <option value="سلطنة عمان">سلطنة عمان (Oman)</option>
                      <option value="البحرين">البحرين (Bahrain)</option>
                    </select>
                  </div>
                </div>

                {/* Shipping Method Options */}
                <div className="mt-4 space-y-2">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingOption"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                          {isAr ? 'شحن قياسي سريع (2-3 أيام عمل)' : 'Standard Express (2-3 Days)'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {isAr ? 'توصيل عبر شركة الشحن المعتمدة' : 'Tracked doorstep delivery'}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      {cartTotals.shipping === 0 ? (
                        <span className="text-emerald-600 font-bold">{isAr ? 'مجاني' : 'FREE'}</span>
                      ) : (
                        formatPrice(cartTotals.shipping, currency, language)
                      )}
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  <span>{isAr ? 'طريقة الدفع' : 'Payment Method'}</span>
                </h3>

                <div className="space-y-3">
                  {/* Apple Pay / Mada Option */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'apple_pay'}
                        onChange={() => setPaymentMethod('apple_pay')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          Apple Pay & Mada
                        </span>
                        <span className="text-xs text-slate-500">
                          {isAr ? 'الدفع الآمن بلمسة واحدة عبر بطاقات مدى وآبل باي' : 'One-touch secure payment'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-black text-white text-[11px] font-bold">
                        Pay
                      </span>
                      <span className="px-2 py-1 rounded bg-emerald-700 text-white text-[10px] font-bold">
                        مدى
                      </span>
                    </div>
                  </label>

                  {/* Credit Card Option */}
                  <div
                    className={`rounded-xl border transition-all overflow-hidden ${
                      paymentMethod === 'credit_card'
                        ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <label className="flex items-center justify-between p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'credit_card'}
                          onChange={() => setPaymentMethod('credit_card')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <span className="font-bold text-sm text-slate-900 block">
                            {isAr ? 'البطاقة الائتمانية (Visa / Mastercard)' : 'Credit Card'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {isAr ? 'معالجة مشفرة وآمنة بنسبة 100%' : 'Encrypted & PCI-compliant'}
                          </span>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-slate-500" />
                    </label>

                    {paymentMethod === 'credit_card' && (
                      <div className="p-4 pt-0 border-t border-slate-200/60 bg-white grid grid-cols-2 gap-3 mt-2">
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            {isAr ? 'رقم البطاقة' : 'Card Number'}
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            {isAr ? 'تاريخ الانتهاء' : 'Expiry'}
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tamara 3-Split Payments */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'tamara'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'tamara'}
                        onChange={() => setPaymentMethod('tamara')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          {isAr ? 'تمارا - قسّمها على 3 دفعات بدون فوائد' : 'Tamara - Split in 3 payments'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {isAr
                            ? `ادفع ${formatPrice(cartTotals.total / 3, currency, language)} اليوم والباقي لاحقاً`
                            : `Pay ${formatPrice(cartTotals.total / 3, currency, language)} today`}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-xs font-black">
                      Tamara
                    </span>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          {isAr ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {isAr ? 'ادفع نقداً أو بالبطاقة لمندوب التوصيل' : 'Pay when you receive package'}
                        </span>
                      </div>
                    </div>
                    <Truck className="w-5 h-5 text-slate-500" />
                  </label>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isAr ? 'جاري معالجة الطلب...' : 'Processing Order...'}</span>
                ) : (
                  <>
                    <span>
                      {isAr
                        ? `تأكيد ودفع الطلب (${formatPrice(cartTotals.total, currency, language)})`
                        : `Pay & Place Order (${formatPrice(cartTotals.total, currency, language)})`}
                    </span>
                    <ArrowIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between pb-3 border-b border-slate-100">
              <span>{isAr ? 'ملخص الطلب' : 'Order Summary'}</span>
              <span className="text-xs text-slate-500">
                {cartTotals.itemCount} {isAr ? 'منتجات' : 'items'}
              </span>
            </h3>

            {/* Cart Items List */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pe-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    />
                    <span className="absolute -top-2 -end-2 w-5 h-5 bg-slate-800 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {isAr ? item.product.titleAr : item.product.title}
                    </h5>
                    {item.selectedVariant && (
                      <span className="text-[10px] text-slate-500 block truncate">
                        {isAr ? item.selectedVariant.nameAr : item.selectedVariant.name}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-950">
                    {formatPrice(
                      (item.product.price + (item.selectedVariant?.priceModifier || 0)) *
                        item.quantity,
                      currency,
                      language
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input in Checkout */}
            <div className="pt-3 border-t border-slate-100">
              {appliedDiscount ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{appliedDiscount.code}</span>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className="text-slate-400 hover:text-rose-600 text-xs font-bold"
                  >
                    {isAr ? 'إزالة' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={isAr ? 'كوبون الخصم (SHOPIFY20)' : 'Discount coupon'}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full ps-8 pe-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs uppercase focus:border-emerald-500 focus:bg-white outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    {isAr ? 'تطبيق' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(cartTotals.subtotal, currency, language)}
                </span>
              </div>

              {cartTotals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{isAr ? 'الخصم المطبق' : 'Discount'}</span>
                  <span>-{formatPrice(cartTotals.discountAmount, currency, language)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'الشحن والتسليم' : 'Shipping'}</span>
                <span className="font-semibold">
                  {cartTotals.shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">{isAr ? 'شحن مجاني' : 'FREE'}</span>
                  ) : (
                    formatPrice(cartTotals.shipping, currency, language)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'ضريبة القيمة المضافة (15%)' : 'Estimated Taxes'}</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(cartTotals.tax, currency, language)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-950">
                <span>{isAr ? 'الإجمالي المطلوب' : 'Total Due'}</span>
                <span className="text-emerald-700">
                  {formatPrice(cartTotals.total, currency, language)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isAr
                  ? 'جميع المعاملات تتم وفق أعلى معايير الأمان العالمية لشوبيفاي'
                  : 'Shopify PCI-DSS certified checkout security guaranteed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
