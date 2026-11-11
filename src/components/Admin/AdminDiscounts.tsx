import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/shopLogic';
import { DiscountCode, DiscountType } from '../../types';
import { Percent, Plus, Tag, CheckCircle2, XCircle, X } from 'lucide-react';

export const AdminDiscounts: React.FC = () => {
  const { discounts, addDiscount, toggleDiscountActive, language, currency } = useShop();

  const isAr = language === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<DiscountType>('percent');
  const [value, setValue] = useState('15');
  const [minOrderValue, setMinOrderValue] = useState('100');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newDiscount: DiscountCode = {
      code: code.trim().toUpperCase(),
      type,
      value: type === 'free_shipping' ? 0 : parseFloat(value) || 10,
      minOrderValue: parseFloat(minOrderValue) || 0,
      usedCount: 0,
      active: true,
      descriptionAr:
        descAr ||
        (type === 'percent'
          ? `خصم ${value}%`
          : type === 'fixed'
          ? `خصم ${value} ر.س`
          : 'شحن مجاني'),
      descriptionEn:
        descEn ||
        (type === 'percent'
          ? `${value}% discount`
          : type === 'fixed'
          ? `${value} SAR discount`
          : 'Free Shipping'),
    };

    addDiscount(newDiscount);
    setIsModalOpen(false);
    setCode('');
    setDescAr('');
    setDescEn('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isAr ? 'إدارة الخصومات والكوبونات' : 'Discounts & Promotions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr
              ? 'إنشاء وتفعيل أكواد الخصم الترويجية والشحن المجاني لزيادة المبيعات.'
              : 'Create promotional coupon codes and free shipping incentives.'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إنشاء كود خصم جديد' : 'Create Discount'}</span>
        </button>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'الكود' : 'Code'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'نوع الخصم' : 'Type'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'القيمة' : 'Value'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">
                  {isAr ? 'الحد الأدنى للطلب' : 'Min Order'}
                </th>
                <th className="py-3.5 px-4 text-start font-semibold">
                  {isAr ? 'مرات الاستخدام' : 'Times Used'}
                </th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-4 text-end font-semibold">{isAr ? 'تفعيل / تعطيل' : 'Toggle'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {discounts.map((d) => (
                <tr key={d.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {d.code}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {d.type === 'percent'
                      ? isAr
                        ? 'نسبة مئوية (%)'
                        : 'Percentage (%)'
                      : d.type === 'fixed'
                      ? isAr
                        ? 'مبلغ ثابت'
                        : 'Fixed Amount'
                      : isAr
                      ? 'شحن مجاني'
                      : 'Free Shipping'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {d.type === 'percent'
                      ? `${d.value}%`
                      : d.type === 'fixed'
                      ? formatPrice(d.value, currency, language)
                      : isAr
                      ? 'مجاني'
                      : 'Free'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {d.minOrderValue > 0
                      ? formatPrice(d.minOrderValue, currency, language)
                      : isAr
                      ? 'بدون حد أدنى'
                      : 'No Minimum'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {d.usedCount} {isAr ? 'مرة' : 'times'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        d.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {d.active ? (isAr ? 'مفعّل' : 'Active') : isAr ? 'معطّل' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end">
                    <button
                      onClick={() => toggleDiscountActive(d.code)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        d.active
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {d.active ? (isAr ? 'تعطيل' : 'Disable') : isAr ? 'تفعيل' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
              <h3 className="font-bold text-slate-900 text-base">
                {isAr ? 'إنشاء كود خصم جديد' : 'New Discount Code'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscount} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isAr ? 'كود الكوبون (الحروف والأرقام)' : 'Coupon Code'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: MEGA30"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl uppercase font-mono font-bold focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAr ? 'نوع الخصم' : 'Discount Type'}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DiscountType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden bg-white"
                  >
                    <option value="percent">{isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                    <option value="fixed">{isAr ? 'مبلغ نقدي ثابت' : 'Fixed Amount'}</option>
                    <option value="free_shipping">{isAr ? 'شحن مجاني' : 'Free Shipping'}</option>
                  </select>
                </div>
                {type !== 'free_shipping' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {type === 'percent'
                        ? isAr
                          ? 'النسبة (%)'
                          : 'Percentage (%)'
                        : isAr
                        ? 'المبلغ (ر.س)'
                        : 'Amount (SAR)'}{' '}
                      *
                    </label>
                    <input
                      type="number"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isAr ? 'الحد الأدنى للطلب (ر.س)' : 'Minimum Order Value (SAR)'}
                </label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isAr ? 'وصف الكوبون بالعربية' : 'Description'}
                </label>
                <input
                  type="text"
                  placeholder="مثال: خصم 20% بمناسبة نهاية الأسبوع"
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
                >
                  {isAr ? 'إنشاء وحفظ الكوبون' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
