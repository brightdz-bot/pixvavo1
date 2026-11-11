import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ThemeTemplate } from '../../types';
import { Palette, Check, Store, Globe, Sparkles, LayoutTemplate, Eye } from 'lucide-react';

export const AdminStoreBuilder: React.FC = () => {
  const { themeConfig, updateThemeConfig, language, setCurrentView } = useShop();
  const isAr = language === 'ar';

  const [selectedTemplate, setSelectedTemplate] = useState<ThemeTemplate>(
    themeConfig.template || 'dawn'
  );
  const [storeNameAr, setStoreNameAr] = useState(themeConfig.storeNameAr);
  const [storeNameEn, setStoreNameEn] = useState(themeConfig.storeName);
  const [primaryColor, setPrimaryColor] = useState(themeConfig.primaryColor);

  const templates: {
    id: ThemeTemplate;
    name: string;
    nameAr: string;
    descriptionAr: string;
    descriptionEn: string;
    badge: string;
    image: string;
  }[] = [
    {
      id: 'dawn',
      name: 'Shopify Dawn (Official Flagship)',
      nameAr: 'قالب شوبيفاي دون (Dawn - القالب الافتراضي الرسمي)',
      descriptionAr:
        'القالب الأكثر شهرة واعتماداً في شوبيفاي. يمتاز بالتصميم العصري الأنيق، التباين العالي، والسرعة الفائقة لجميع أنواع المتاجر.',
      descriptionEn:
        'Shopify flagship theme. Clean, minimalist, high-contrast, and blisteringly fast across desktop and mobile.',
      badge: 'الأكثر شعبية في شوبيفاي',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'sense',
      name: 'Shopify Sense',
      nameAr: 'قالب شوبيفاي سينس (Sense - جمال وعناية)',
      descriptionAr:
        'مثالي لمنتجات الصحة، العناية بالبشرة، العطور والمنتجات الطبيعية مع بطاقات ناعمة وتدرجات لونية دافئة.',
      descriptionEn:
        'Vibrant and clean theme curated for beauty, wellness, and self-care brands.',
      badge: 'مثالي للعطور والعناية',
      image:
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'craft',
      name: 'Shopify Craft',
      nameAr: 'قالب شوبيفاي كرافت (Craft - فخامة وحرفية)',
      descriptionAr:
        'تصميم هادئ وكلاسيكي يحتفي بالحرف اليدوية، الساعات، الإكسسوارات الفاخرة والقطع المصنوعة يدوياً.',
      descriptionEn:
        'Subtle, refined design celebrating craftsmanship and luxury lifestyle goods.',
      badge: 'للفخامة والجلديات',
      image:
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleApplyTheme = (e: React.FormEvent) => {
    e.preventDefault();
    updateThemeConfig({
      template: selectedTemplate,
      storeNameAr,
      storeName: storeNameEn,
      primaryColor,
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-emerald-600" />
            <span>{isAr ? 'منشئ ومخصص قوالب شوبيفاي (Themes Store)' : 'Shopify Theme Store & Customizer'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr
              ? 'اختر القالب المعتمد من شوبيفاي، خصص الهوية البصرية، وطبّق التغييرات فورياً على متجرك.'
              : 'Select official Shopify themes, adjust color palettes, and preview changes live.'}
          </p>
        </div>
        <button
          onClick={() => setCurrentView('storefront')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Eye className="w-4 h-4" />
          <span>{isAr ? 'معاينة الواجهة مباشرة' : 'Preview Storefront'}</span>
        </button>
      </div>

      <form onSubmit={handleApplyTheme} className="space-y-6">
        {/* Template Picker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              {isAr ? 'اختر قالب شوبيفاي المفضل لديك:' : 'Choose Shopify Theme:'}
            </h3>
            <span className="text-xs text-slate-500">
              {isAr
                ? 'جميع القوالب متوافقة 100% مع الأجهزة الذكية وبوابات الدفع ومتجاوبة مع الجوال'
                : 'All themes are responsive, mobile-first, and optimized for conversions.'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <span className="absolute top-3 start-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold">
                      {tpl.badge}
                    </span>
                    {isSelected && (
                      <div className="absolute top-3 end-3 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 mb-1.5">
                        {isAr ? tpl.nameAr : tpl.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isAr ? tpl.descriptionAr : tpl.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700">
                        {isAr ? 'مجاني ومتاح' : 'Free Included'}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isSelected ? (isAr ? 'القالب النشط ✓' : 'Active ✓') : (isAr ? 'اختيار' : 'Select')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Profile Customization */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            {isAr ? 'تخصيص الهوية والاسم' : 'Store Identity Customization'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'اسم المتجر بالعربية' : 'Store Name (Arabic)'}
              </label>
              <input
                type="text"
                value={storeNameAr}
                onChange={(e) => setStoreNameAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden font-bold text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isAr ? 'اسم المتجر بالإنجليزية' : 'Store Name (English)'}
              </label>
              <input
                type="text"
                value={storeNameEn}
                onChange={(e) => setStoreNameEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden font-bold text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {isAr
                ? 'يتم تطبيق القالب والخيارات فورياً على واجهة المتجر وسلة التسوق.'
                : 'Changes apply immediately across your entire Shopify store.'}
            </span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:translate-y-[-1px]"
            >
              <Check className="w-4 h-4" />
              <span>{isAr ? 'تطبيق القالب وحفظ الإعدادات' : 'Apply Theme & Save'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
