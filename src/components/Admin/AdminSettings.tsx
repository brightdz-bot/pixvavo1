import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Palette, Store, Truck, Percent, Sparkles, Check, RefreshCw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { themeConfig, updateThemeConfig, language } = useShop();

  const isAr = language === 'ar';

  const [form, setForm] = useState({ ...themeConfig });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateThemeConfig(form);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isAr ? 'تخصيص المظهر وإعدادات المتجر' : 'Store Theme & Configuration'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr
              ? 'تعديل هوية المتجر، شريط الإعلانات الترويجي، البانر الرئيسي وسياسات الشحن والضريبة.'
              : 'Customize store branding, announcements, hero banner, shipping, and tax rules.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store Branding */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isAr ? 'هوية واسم المتجر' : 'Store Identity'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'اسم المتجر بالعربية' : 'Store Name (Arabic)'}
              </label>
              <input
                type="text"
                value={form.storeNameAr}
                onChange={(e) => setForm({ ...form, storeNameAr: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'اسم المتجر بالإنجليزية' : 'Store Name (English)'}
              </label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Announcement Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {isAr ? 'شريط الإعلانات العلوي' : 'Announcement Bar'}
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.announcementEnabled}
                onChange={(e) => setForm({ ...form, announcementEnabled: e.target.checked })}
                className="rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <span>{isAr ? 'تفعيل الشريط' : 'Enable Bar'}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'نص الإعلان بالعربية' : 'Announcement Text (Arabic)'}
              </label>
              <input
                type="text"
                value={form.announcementTextAr}
                onChange={(e) => setForm({ ...form, announcementTextAr: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'نص الإعلان بالإنجليزية' : 'Announcement Text (English)'}
              </label>
              <input
                type="text"
                value={form.announcementText}
                onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Hero Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Palette className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isAr ? 'البانر الترويجي الرئيسي (Hero Banner)' : 'Main Hero Banner'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'عنوان البانر الرئيسي' : 'Hero Title'}
              </label>
              <input
                type="text"
                value={form.heroTitleAr}
                onChange={(e) => setForm({ ...form, heroTitleAr: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'شارة العرض (Badge)' : 'Badge Label'}
              </label>
              <input
                type="text"
                value={form.heroBadgeAr}
                onChange={(e) => setForm({ ...form, heroBadgeAr: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'النص التعريفي للبانر' : 'Hero Subtitle'}
              </label>
              <textarea
                rows={2}
                value={form.heroSubtitleAr}
                onChange={(e) => setForm({ ...form, heroSubtitleAr: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'رابط صورة خلفية البانر' : 'Hero Background Image URL'}
              </label>
              <input
                type="url"
                value={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Shipping & Taxes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isAr ? 'سياسات الشحن والضرائب' : 'Shipping & Taxes'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'حد الشحن المجاني (ر.س)' : 'Free Shipping Threshold'}
              </label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) =>
                  setForm({ ...form, freeShippingThreshold: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'تكلفة الشحن القياسي (ر.س)' : 'Standard Shipping Cost'}
              </label>
              <input
                type="number"
                value={form.standardShippingCost}
                onChange={(e) =>
                  setForm({ ...form, standardShippingCost: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'نسبة الضريبة (VAT)' : 'Tax Rate (VAT)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={form.taxRate}
                onChange={(e) =>
                  setForm({ ...form, taxRate: parseFloat(e.target.value) || 0.15 })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:translate-y-[-1px] active:translate-y-0"
          >
            <Check className="w-4 h-4" />
            <span>{isAr ? 'حفظ وتحديث المتجر الآن' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
