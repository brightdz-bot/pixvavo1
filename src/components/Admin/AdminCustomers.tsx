import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/shopLogic';
import { Users, Search, Mail, Phone, ShoppingBag } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers, language, currency } = useShop();

  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isAr ? 'قاعدة بيانات العملاء' : 'Customer Directory'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr
              ? 'سجل العملاء، عدد الطلبات المكتملة، وإجمالي قيمة المشتريات لكل عميل.'
              : 'Customer profiles, order histories, and lifetime value tracking.'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم، البريد أو الهاتف...' : 'Search name, email, phone...'}
            className="w-full ps-8 pe-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 outline-hidden"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          {filtered.length} {isAr ? 'عملاء مسجلين' : 'registered customers'}
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'عدد الطلبات' : 'Orders'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'إجمالي الإنفاق' : 'Total Spent'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'آخر طلب' : 'Last Order'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{c.email}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{c.phone}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">
                      {c.totalOrders} {isAr ? 'طلبات' : 'orders'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-700">
                    {formatPrice(c.totalSpent, currency, language)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{c.lastOrderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
