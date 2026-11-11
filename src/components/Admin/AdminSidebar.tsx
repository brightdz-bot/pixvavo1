import React from 'react';
import { useShop } from '../../context/ShopContext';
import { AdminTab } from '../../types';
import {
  Home,
  Package,
  Boxes,
  Users,
  BarChart3,
  Percent,
  Palette,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { adminTab, setAdminTab, language, orders, products } = useShop();

  const isAr = language === 'ar';
  const unfulfilledOrdersCount = orders.filter((o) => o.status === 'unfulfilled').length;

  const menuItems: {
    id: AdminTab;
    labelAr: string;
    labelEn: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'orders',
      labelAr: 'الطلبات والمبيعات',
      labelEn: 'Orders',
      icon: <Package className="w-4 h-4" />,
      badge: unfulfilledOrdersCount,
    },
    {
      id: 'products',
      labelAr: 'المنتجات والمخزون',
      labelEn: 'Products',
      icon: <Boxes className="w-4 h-4" />,
      badge: products.length,
    },
    {
      id: 'customers',
      labelAr: 'قاعدة العملاء',
      labelEn: 'Customers',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      labelAr: 'التقارير والتحليلات',
      labelEn: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'discounts',
      labelAr: 'كوبونات الخصم',
      labelEn: 'Discounts',
      icon: <Percent className="w-4 h-4" />,
    },
    {
      id: 'builder',
      labelAr: 'قوالب شوبيفاي (Themes)',
      labelEn: 'Shopify Themes',
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: 'settings',
      labelAr: 'مخصص المظهر والإعدادات',
      labelEn: 'Theme & Settings',
      icon: <Boxes className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-e border-slate-800 text-slate-300 p-3 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-x-visible">
      {/* Menu items */}
      <nav className="flex md:flex-col gap-1 w-full">
        {menuItems.map((item) => {
          const isActive = adminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap md:whitespace-normal ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{isAr ? item.labelAr : item.labelEn}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Quick Tips Card */}
      <div className="hidden md:block p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 mt-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
          {isAr ? 'نصيحة شوبيفاي' : 'Shopify Tip'}
        </span>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isAr
            ? 'تحديث حالة الطلب إلى "تم الشحن" يرسل إشعاراً فورياً للعميل برقم التتبع.'
            : 'Fulfilling orders promptly improves customer retention and conversion.'}
        </p>
      </div>
    </aside>
  );
};
