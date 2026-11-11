import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/shopLogic';
import { Order, OrderStatus } from '../../types';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Truck,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus, language, currency } = useShop();

  const isAr = language === 'ar';

  const [activeFilter, setActiveFilter] = useState<'all' | 'unfulfilled' | 'fulfilled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (activeFilter !== 'all' && o.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isAr ? 'إدارة الطلبات والشحن' : 'Orders & Shipments'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr
              ? 'متابعة وتحديث حالات الطلبات، إصدار بوالص الشحن، وإدارة فواتير العملاء.'
              : 'Track fulfillment, customer shipments, and update payment statuses.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({orders.length})
          </button>
          <button
            onClick={() => setActiveFilter('unfulfilled')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'unfulfilled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'قيد التجهيز' : 'Unfulfilled'} (
            {orders.filter((o) => o.status === 'unfulfilled').length})
          </button>
          <button
            onClick={() => setActiveFilter('fulfilled')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'fulfilled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'تم الشحن' : 'Fulfilled'} (
            {orders.filter((o) => o.status === 'fulfilled').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث برقم الطلب، العميل...' : 'Search order, customer...'}
            className="w-full ps-8 pe-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 outline-hidden"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'الطلب' : 'Order'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'الإجمالي' : 'Total'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'طريقة الدفع' : 'Payment'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'حالة الشحن' : 'Fulfillment'}</th>
                <th className="py-3.5 px-4 text-end font-semibold">{isAr ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    {isAr ? 'لا توجد طلبات تطابق معايير البحث' : 'No orders found.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold font-mono text-emerald-800">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{o.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{o.customer.name}</span>
                      <span className="text-[11px] text-slate-400">{o.customer.city}</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-950">
                      {formatPrice(o.total, o.currency, language)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {o.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                          o.status === 'fulfilled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {o.status === 'fulfilled' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{isAr ? 'تم الشحن' : 'Fulfilled'}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{isAr ? 'قيد التجهيز' : 'Unfulfilled'}</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(o);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        {isAr ? 'تفاصيل' : 'Details'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isAr ? 'تفاصيل الطلب' : 'Order Details'}{' '}
                  <span className="font-mono text-emerald-700">{selectedOrder.orderNumber}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Status Update Banner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-700 block">
                    {isAr ? 'حالة الشحن الحالية:' : 'Current Fulfillment:'}{' '}
                    <span
                      className={
                        selectedOrder.status === 'fulfilled'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }
                    >
                      {selectedOrder.status === 'fulfilled'
                        ? isAr
                          ? 'تم الشحن والتسليم'
                          : 'Fulfilled'
                        : isAr
                        ? 'قيد التجهيز بمستودعنا'
                        : 'Unfulfilled'}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {isAr ? 'رقم التتبع:' : 'Tracking #:'} {selectedOrder.trackingNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedOrder.status === 'unfulfilled' ? (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'fulfilled');
                        setSelectedOrder({ ...selectedOrder, status: 'fulfilled' });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs transition-colors"
                    >
                      {isAr ? 'تأكيد وشحن الطلب الآن' : 'Mark as Fulfilled'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'unfulfilled');
                        setSelectedOrder({ ...selectedOrder, status: 'unfulfilled' });
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-xs transition-colors"
                    >
                      {isAr ? 'إعادة إلى قيد التجهيز' : 'Mark as Unfulfilled'}
                    </button>
                  )}
                </div>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">
                    {isAr ? 'بيانات العميل' : 'Customer'}
                  </h4>
                  <p className="font-semibold text-slate-800">{selectedOrder.customer.name}</p>
                  <p className="text-slate-500">{selectedOrder.customer.email}</p>
                  <p className="text-slate-500">{selectedOrder.customer.phone}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">
                    {isAr ? 'عنوان التوصيل' : 'Shipping Address'}
                  </h4>
                  <p className="text-slate-700">{selectedOrder.customer.address}</p>
                  <p className="text-slate-700">
                    {selectedOrder.customer.city}, {selectedOrder.customer.country}
                  </p>
                  <p className="text-slate-400 font-mono">
                    {selectedOrder.customer.postalCode || ''}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3">
                  {isAr ? 'المنتجات المطلوبة' : 'Items'} ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2 border border-slate-200 rounded-2xl p-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-2 bg-slate-50/60 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {isAr ? item.product.titleAr : item.product.title}
                          </p>
                          {item.selectedVariant && (
                            <span className="text-[10px] text-slate-400 block truncate">
                              {isAr ? item.selectedVariant.nameAr : item.selectedVariant.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-end shrink-0">
                        <span className="text-slate-500">x{item.quantity}</span>
                        <span className="font-bold text-slate-900 ms-3">
                          {formatPrice(
                            (item.product.price + (item.selectedVariant?.priceModifier || 0)) *
                              item.quantity,
                            selectedOrder.currency,
                            language
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5 border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(selectedOrder.subtotal, selectedOrder.currency, language)}
                  </span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>
                      {isAr ? 'خصم الكوبون' : 'Discount'} ({selectedOrder.discountCode}):
                    </span>
                    <span>
                      -{formatPrice(selectedOrder.discount, selectedOrder.currency, language)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>{isAr ? 'الشحن:' : 'Shipping:'}</span>
                  <span>
                    {selectedOrder.shipping === 0
                      ? isAr
                        ? 'مجاني'
                        : 'FREE'
                      : formatPrice(selectedOrder.shipping, selectedOrder.currency, language)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{isAr ? 'ضريبة القيمة المضافة:' : 'VAT:'}</span>
                  <span>{formatPrice(selectedOrder.tax, selectedOrder.currency, language)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-950">
                  <span>{isAr ? 'الإجمالي المدفوع:' : 'Total:'}</span>
                  <span className="text-emerald-700">
                    {formatPrice(selectedOrder.total, selectedOrder.currency, language)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
