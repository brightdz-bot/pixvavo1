import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/shopLogic';
import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, products, customers, language, currency, setAdminTab, updateOrderStatus } =
    useShop();

  const isAr = language === 'ar';

  // Metrics
  const totalSalesSAR = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + o.total, 0);

  const totalOrdersCount = orders.length;
  const unfulfilledOrders = orders.filter((o) => o.status === 'unfulfilled');
  const averageOrderValueSAR = totalOrdersCount > 0 ? totalSalesSAR / totalOrdersCount : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const kpis = [
    {
      titleAr: 'إجمالي المبيعات',
      titleEn: 'Total Sales',
      value: formatPrice(totalSalesSAR, currency, language),
      change: '+18.4%',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      titleAr: 'إجمالي الطلبات',
      titleEn: 'Total Orders',
      value: totalOrdersCount.toString(),
      change: '+12.1%',
      icon: <Package className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      titleAr: 'متوسط قيمة الطلب (AOV)',
      titleEn: 'Avg. Order Value',
      value: formatPrice(averageOrderValueSAR, currency, language),
      change: '+6.2%',
      icon: <ShoppingCart className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50',
    },
    {
      titleAr: 'العملاء المسجلين',
      titleEn: 'Total Customers',
      value: customers.length.toString(),
      change: '+24.5%',
      icon: <Users className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
            {isAr ? 'مرحباً بك في لوحة تحكم شوبيفاي 👋' : 'Welcome to Shopify Admin 👋'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr
              ? 'إليك ملخص أداء متجرك ومبيعاتك والطلبات التي تحتاج إلى تجهيز وشحن اليوم.'
              : "Here is your store summary, revenue metrics, and today's fulfillment tasks."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('orders')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            {isAr ? 'إدارة الطلبات' : 'Manage Orders'}
          </button>
          <button
            onClick={() => setAdminTab('products')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
          >
            {isAr ? '+ إضافة منتج' : '+ Add Product'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">
                {isAr ? kpi.titleAr : kpi.titleEn}
              </span>
              <div className={`p-2.5 rounded-xl ${kpi.bg}`}>{kpi.icon}</div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {kpi.value}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 me-0.5" />
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Actionable Alerts (Unfulfilled Orders & Low Stock) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Unfulfilled Orders Notification */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'طلبات بانتظار الشحن والتجهيز' : 'Orders to Fulfill'}</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              {unfulfilledOrders.length}
            </span>
          </div>

          {unfulfilledOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{isAr ? 'رائع! لا توجد طلبات معلقة حالياً' : 'All orders are fulfilled!'}</span>
            </p>
          ) : (
            <div className="space-y-2">
              {unfulfilledOrders.slice(0, 3).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 font-mono block">
                      {o.orderNumber}
                    </span>
                    <span className="text-slate-500">{o.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {formatPrice(o.total, o.currency, language)}
                    </span>
                    <button
                      onClick={() => updateOrderStatus(o.id, 'fulfilled')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                    >
                      {isAr ? 'تأكيد الشحن' : 'Fulfill'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{isAr ? 'تنبيهات انخفاض المخزون' : 'Low Stock Inventory Alerts'}</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
              {lowStockProducts.length}
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">
              {isAr ? 'جميع المنتجات متوفرة بكميات كافية' : 'All products have healthy inventory.'}
            </p>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover bg-slate-200 shrink-0"
                    />
                    <span className="font-bold text-slate-900 truncate">
                      {isAr ? p.titleAr : p.title}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[11px] shrink-0">
                    {p.stock} {isAr ? 'قطع متبقية' : 'left'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base">
            {isAr ? 'أحدث الطلبات المستلمة' : 'Recent Customer Orders'}
          </h3>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{isAr ? 'عرض كافة الطلبات' : 'View all orders'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 text-start font-semibold">{isAr ? 'رقم الطلب' : 'Order'}</th>
                <th className="py-3 px-3 text-start font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="py-3 px-3 text-start font-semibold">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="py-3 px-3 text-start font-semibold">{isAr ? 'الإجمالي' : 'Total'}</th>
                <th className="py-3 px-3 text-start font-semibold">{isAr ? 'حالة الدفع' : 'Payment'}</th>
                <th className="py-3 px-3 text-start font-semibold">{isAr ? 'حالة الطلب' : 'Fulfillment'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold font-mono text-slate-900">{o.orderNumber}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{o.customer.name}</td>
                  <td className="py-3 px-3 text-slate-500">{o.date}</td>
                  <td className="py-3 px-3 font-bold text-slate-950">
                    {formatPrice(o.total, o.currency, language)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {o.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        o.status === 'fulfilled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {o.status === 'fulfilled'
                        ? isAr
                          ? 'تم الشحن'
                          : 'Fulfilled'
                        : isAr
                        ? 'قيد التجهيز'
                        : 'Unfulfilled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
