import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/shopLogic';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign,
  ShoppingCart,
  Users,
  CreditCard,
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { orders, products, language, currency } = useShop();

  const isAr = language === 'ar';

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + o.total, 0);

  const paymentBreakdown = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weeklySales = [
    { dayAr: 'السبت', dayEn: 'Sat', amount: 3420, orders: 4 },
    { dayAr: 'الأحد', dayEn: 'Sun', amount: 4890, orders: 6 },
    { dayAr: 'الاثنين', dayEn: 'Mon', amount: 6200, orders: 8 },
    { dayAr: 'الثلاثاء', dayEn: 'Tue', amount: 5100, orders: 5 },
    { dayAr: 'الأربعاء', dayEn: 'Wed', amount: 7850, orders: 11 },
    { dayAr: 'الخميس', dayEn: 'Thu', amount: 9400, orders: 14 },
    { dayAr: 'الجمعة', dayEn: 'Fri', amount: 11200, orders: 18 },
  ];

  const maxWeeklyAmount = Math.max(...weeklySales.map((w) => w.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          {isAr ? 'التقارير وتحليلات المبيعات' : 'Store Analytics & Revenue'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          {isAr
            ? 'مؤشرات الأداء الرئيسية، معدل التحويل، ومصادر الدفع الأكثر استخداماً.'
            : 'Key performance indicators, conversion funnel, and revenue trends.'}
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">
            {isAr ? 'معدل التحويل (Conversion Rate)' : 'Online Conversion Rate'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-950">3.82%</span>
            <span className="text-xs font-bold text-emerald-600">+0.8%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            {isAr ? 'أعلى من متوسط متاجر شوبيفاي بنسبة 1.2%' : '1.2% higher than industry average'}
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">
            {isAr ? 'معدل عودة العملاء (Returning Rate)' : 'Returning Customer Rate'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-950">41.5%</span>
            <span className="text-xs font-bold text-emerald-600">+4.2%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            {isAr ? 'ولاء عالي وتكرار شراء مستمر' : 'High customer retention'}
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">
            {isAr ? 'جلسات المتجر الإجمالية' : 'Total Store Sessions'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-950">14,280</span>
            <span className="text-xs font-bold text-emerald-600">+19.4%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            {isAr ? 'نمو ممتاز في الزيارات اليومية' : 'Strong visitor trajectory'}
          </span>
        </div>
      </div>

      {/* Weekly Revenue Bar Chart */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isAr ? 'تقرير المبيعات الأسبوعية' : 'Weekly Sales Velocity'}
            </h3>
            <span className="text-xs text-slate-400">
              {isAr ? 'نمو مستمر بفضل عروض نهاية الأسبوع' : 'Higher peaks during weekend promotions'}
            </span>
          </div>
          <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            {formatPrice(
              weeklySales.reduce((acc, w) => acc + w.amount, 0),
              currency,
              language
            )}
          </span>
        </div>

        {/* Visual Bar representation */}
        <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-52 pt-8">
          {weeklySales.map((day, idx) => {
            const heightPercent = Math.round((day.amount / maxWeeklyAmount) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatPrice(day.amount, currency, language)}
                </span>
                <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    className="w-full bg-emerald-600 group-hover:bg-emerald-500 transition-all rounded-t-xl"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {isAr ? day.dayAr : day.dayEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment methods & Category distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Methods */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'توزيع بوابات وطرق الدفع' : 'Payment Methods Distribution'}</span>
          </h4>
          <div className="space-y-3 text-xs">
            {[
              {
                name: 'Apple Pay & Mada',
                percentage: '68%',
                color: 'bg-emerald-600',
              },
              {
                name: 'Credit Card (Visa / MC)',
                percentage: '18%',
                color: 'bg-blue-600',
              },
              {
                name: 'Tamara (Split Payments)',
                percentage: '10%',
                color: 'bg-amber-500',
              },
              {
                name: 'Cash on Delivery',
                percentage: '4%',
                color: 'bg-slate-400',
              },
            ].map((method, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>{method.name}</span>
                  <span>{method.percentage}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${method.color}`} style={{ width: method.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Product Categories */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'الأقسام الأكثر طلباً ومبيعاً' : 'Top Selling Categories'}</span>
          </h4>
          <div className="space-y-3 text-xs">
            {[
              {
                nameAr: 'إلكترونيات وسماعات ذكية',
                nameEn: 'Electronics',
                share: '45%',
                color: 'bg-emerald-600',
              },
              {
                nameAr: 'أزياء وإكسسوارات جلدية',
                nameEn: 'Fashion & Leather',
                share: '25%',
                color: 'bg-blue-600',
              },
              {
                nameAr: 'عطور شرقية وملكية',
                nameEn: 'Perfumes & Oud',
                share: '20%',
                color: 'bg-amber-600',
              },
              {
                nameAr: 'المنزل والديكور والقهوة',
                nameEn: 'Home & Coffee',
                share: '10%',
                color: 'bg-purple-600',
              },
            ].map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                  <span>{cat.share}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: cat.share }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
