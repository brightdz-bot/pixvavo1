import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Award, Truck, Check } from 'lucide-react';

interface ShopifySectionsProps {
  onSelectCategory: (categoryId: string) => void;
}

export const ShopifyCollectionList: React.FC<ShopifySectionsProps> = ({ onSelectCategory }) => {
  const { language } = useShop();
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const collections = [
    {
      id: 'electronics',
      titleAr: 'الإلكترونيات الذكية',
      titleEn: 'Smart Electronics',
      count: '3 منتجات',
      countEn: '3 items',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'fashion',
      titleAr: 'الأزياء والإكسسوارات',
      titleEn: 'Fashion & Leather',
      count: '2 منتجات',
      countEn: '2 items',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'perfumes',
      titleAr: 'العطور الملكية والبخور',
      titleEn: 'Royal Oud & Perfumes',
      count: '1 منتج',
      countEn: '1 item',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'home',
      titleAr: 'المنزل ومستلزمات القهوة',
      titleEn: 'Home & Coffee Culture',
      count: '2 منتجات',
      countEn: '2 items',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="my-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            {isAr ? 'تصفح حسب التشكيلة' : 'Shopify Collections'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? 'تشكيلات شوبيفاي المختارة' : 'Curated Collection Showcase'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((col) => (
          <div
            key={col.id}
            onClick={() => onSelectCategory(col.id)}
            className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-slate-900 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <img
              src={col.image}
              alt={isAr ? col.titleAr : col.titleEn}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

            <div className="absolute inset-x-4 bottom-4 text-white">
              <span className="text-[11px] font-medium text-emerald-300 block mb-1">
                {isAr ? col.count : col.countEn}
              </span>
              <h3 className="font-black text-sm sm:text-base leading-tight mb-2 flex items-center justify-between">
                <span>{isAr ? col.titleAr : col.titleEn}</span>
                <ArrowIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all text-emerald-400" />
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ShopifyImageWithText: React.FC = () => {
  const { language } = useShop();
  const isAr = language === 'ar';

  return (
    <section className="my-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Visual Image */}
        <div className="relative aspect-4/3 lg:aspect-auto lg:h-full bg-slate-100 min-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&auto=format&fit=crop&q=80"
            alt="Shopify Quality"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 start-4 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black shadow-md flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'معايير جودة شوبيفاي' : 'Shopify Verified Quality'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-3">
            {isAr ? 'حرفية وتصميم لا مثيل له' : 'Crafted to Perfection'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-4 leading-tight">
            {isAr
              ? 'متجر مبني بتجربة مستخدم مدروسة بعناية لزيادة المبيعات'
              : 'Designed with High-Conversion Shopify Architecture'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {isAr
              ? 'نحرص على انتقاء كل منتج بعناية فائقة، مع توفير تجربة تسوق سلسة من المعاينة السريعة وحتى إنهاء الدفع بثوانٍ معدودة وبأعلى معايير الأمان العالمية.'
              : 'From ultra-fast page speeds to frictionless 1-click checkout, every touchpoint is engineered to deliver a seamless shopping experience.'}
          </p>

          <div className="space-y-3 mb-8 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{isAr ? 'منتجات أصلية 100% مع ضمان الوكيل المعتمد' : '100% Authentic verified products'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{isAr ? 'شحن سريع ومجاني للطلبات فوق 250 ر.س' : 'Free express shipping on eligible orders'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{isAr ? 'دعم بوابات مدى، آبل باي، تمارا، والدفع عند الاستلام' : 'Mada, Apple Pay, Tamara & COD supported'}</span>
            </div>
          </div>

          <a
            href="#catalog-section"
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl w-fit transition-all shadow-md"
          >
            {isAr ? 'استكشف التشكيلة الكاملة' : 'Explore Full Collection'}
          </a>
        </div>
      </div>
    </section>
  );
};
