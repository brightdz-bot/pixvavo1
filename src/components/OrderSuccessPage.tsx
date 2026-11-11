import React from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/shopLogic';
import {
  CheckCircle2,
  Package,
  Truck,
  Clock,
  Printer,
  ShoppingBag,
  ExternalLink,
  MapPin,
  CreditCard,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastPlacedOrder, language, setCurrentView, setAdminTab } = useShop();

  const isAr = language === 'ar';

  if (!lastPlacedOrder) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 mb-4">{isAr ? 'لا يوجد طلب حديث' : 'No recent order found.'}</p>
        <button
          onClick={() => setCurrentView('storefront')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm"
        >
          {isAr ? 'العودة للمتجر' : 'Return to Shop'}
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleGoToAdmin = () => {
    setAdminTab('orders');
    setCurrentView('admin');
  };

  const steps = [
    {
      titleAr: 'تم تأكيد الطلب',
      titleEn: 'Order Confirmed',
      descAr: 'تم استلام وتوثيق الدفع',
      descEn: 'Payment received',
      completed: true,
      current: false,
    },
    {
      titleAr: 'قيد التجهيز بمستودعنا',
      titleEn: 'Processing & Packing',
      descAr: 'تغليف المنتج وتجهيز بوليصة الشحن',
      descEn: 'Items being carefully packed',
      completed: lastPlacedOrder.status === 'fulfilled',
      current: lastPlacedOrder.status === 'unfulfilled',
    },
    {
      titleAr: 'تم التسليم لشركة الشحن',
      titleEn: 'Dispatched to Carrier',
      descAr: `رقم التتبع: ${lastPlacedOrder.trackingNumber}`,
      descEn: `Tracking: ${lastPlacedOrder.trackingNumber}`,
      completed: lastPlacedOrder.status === 'fulfilled',
      current: false,
    },
    {
      titleAr: 'تم التوصيل للعميل',
      titleEn: 'Delivered',
      descAr: `تاريخ التوصيل المتوقع: ${lastPlacedOrder.estimatedDelivery}`,
      descEn: `Est. Delivery: ${lastPlacedOrder.estimatedDelivery}`,
      completed: false,
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-block mb-3">
            {isAr ? 'تم تأكيد طلبك بنجاح' : 'Order Confirmed'}
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 mb-2">
            {isAr ? 'شكراً لتسوقك معنا، طلبك في الطريق!' : 'Thank you for your order!'}
          </h1>

          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {isAr
              ? `تم إرسال تفاصيل الفاتورة وبوليصة التتبع إلى ${lastPlacedOrder.customer.email}`
              : `Invoice & tracking details sent to ${lastPlacedOrder.customer.email}`}
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700">
            <span>
              {isAr ? 'رقم الطلب:' : 'Order Number:'}{' '}
              <strong className="text-emerald-700 font-mono text-sm sm:text-base">
                {lastPlacedOrder.orderNumber}
              </strong>
            </span>
            <span>•</span>
            <span>
              {isAr ? 'التاريخ:' : 'Date:'} {lastPlacedOrder.date}
            </span>
            <span>•</span>
            <span>
              {isAr ? 'طريقة الدفع:' : 'Payment:'} {lastPlacedOrder.paymentMethod.toUpperCase()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setCurrentView('storefront')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAr ? 'متابعة التسوق في المتجر' : 'Continue Shopping'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? 'طباعة الفاتورة الضريبية' : 'Print Invoice'}</span>
            </button>

            <button
              onClick={handleGoToAdmin}
              className="px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isAr ? 'معاينة في لوحة شوبيفاي' : 'View in Shopify Admin'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Order Tracking Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h3 className="font-black text-slate-900 text-base sm:text-lg mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>{isAr ? 'مراحل تتبع الشحنة' : 'Shipment Tracking Timeline'}</span>
          </h3>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-start relative">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm mb-3 ${
                      step.completed
                        ? 'bg-emerald-600 text-white'
                        : step.current
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                    {isAr ? step.titleAr : step.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {isAr ? step.descAr : step.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Shipping info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'بيانات المستلم وعنوان التوصيل' : 'Delivery Address'}</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p className="font-bold text-slate-900 text-sm">{lastPlacedOrder.customer.name}</p>
              <p>{lastPlacedOrder.customer.phone}</p>
              <p>{lastPlacedOrder.customer.email}</p>
              <p>{lastPlacedOrder.customer.address}</p>
              <p>
                {lastPlacedOrder.customer.city}, {lastPlacedOrder.customer.country}
              </p>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'ملخص الحساب والفاتورة' : 'Invoice Details'}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(lastPlacedOrder.subtotal, lastPlacedOrder.currency, language)}
                </span>
              </div>
              {lastPlacedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>
                    {isAr ? 'الخصم' : 'Discount'} ({lastPlacedOrder.discountCode}):
                  </span>
                  <span>
                    -{formatPrice(lastPlacedOrder.discount, lastPlacedOrder.currency, language)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'الشحن والتوصيل:' : 'Shipping:'}</span>
                <span className="font-bold text-slate-900">
                  {lastPlacedOrder.shipping === 0
                    ? isAr
                      ? 'شحن مجاني'
                      : 'FREE'
                    : formatPrice(lastPlacedOrder.shipping, lastPlacedOrder.currency, language)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'ضريبة القيمة المضافة:' : 'VAT (15%):'}</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(lastPlacedOrder.tax, lastPlacedOrder.currency, language)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm sm:text-base text-slate-950">
                <span>{isAr ? 'المبلغ الإجمالي المدفوع:' : 'Total Paid:'}</span>
                <span className="text-emerald-700">
                  {formatPrice(lastPlacedOrder.total, lastPlacedOrder.currency, language)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
