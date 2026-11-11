import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { filterAndSortProducts } from '../utils/shopLogic';
import {
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Laptop,
  Shirt,
  Flame,
  Home,
  Check,
} from 'lucide-react';

interface StorefrontCatalogProps {
  searchQuery: string;
}

export const StorefrontCatalog: React.FC<StorefrontCatalogProps> = ({ searchQuery }) => {
  const { products, language } = useShop();

  const isAr = language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const categories = [
    {
      id: 'all',
      nameAr: 'جميع التشكيلات',
      nameEn: 'All Collections',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'electronics',
      nameAr: 'إلكترونيات ذكية',
      nameEn: 'Smart Tech',
      icon: <Laptop className="w-4 h-4" />,
    },
    {
      id: 'fashion',
      nameAr: 'أزياء وإكسسوارات',
      nameEn: 'Fashion & Bags',
      icon: <Shirt className="w-4 h-4" />,
    },
    {
      id: 'perfumes',
      nameAr: 'عطور وعناية ملكية',
      nameEn: 'Fragrances & Care',
      icon: <Flame className="w-4 h-4" />,
    },
    {
      id: 'home',
      nameAr: 'المنزل والديكور',
      nameEn: 'Home & Living',
      icon: <Home className="w-4 h-4" />,
    },
  ];

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, {
      query: searchQuery,
      category: selectedCategory,
      inStockOnly,
      sortBy,
    });
  }, [products, searchQuery, selectedCategory, inStockOnly, sortBy]);

  return (
    <section id="catalog-section" className="space-y-6">
      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? products.length
              : products.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-emerald-600'}>{cat.icon}</span>
              <span>{isAr ? cat.nameAr : cat.nameEn}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Results Counter & Search Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-bold text-slate-900">
            {isAr ? `عرض ${filteredProducts.length} من أصل ${products.length} منتج` : `Showing ${filteredProducts.length} of ${products.length} products`}
          </span>
          {searchQuery && (
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              "{searchQuery}"
            </span>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center gap-3">
          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded-sm text-emerald-600 focus:ring-emerald-500"
            />
            <span>{isAr ? 'المتوفر بالمخزون فقط' : 'In-stock only'}</span>
          </label>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 pe-8 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-500 focus:bg-white outline-hidden cursor-pointer"
            >
              <option value="featured">{isAr ? 'المميزة أولاً (شوبيفاي)' : 'Featured'}</option>
              <option value="price-asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating">{isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              <option value="newest">{isAr ? 'الأحدث وصولاً' : 'Newest Arrivals'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {isAr ? 'لم نتمكن من العثور على أي منتج' : 'No products found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {isAr
              ? 'جرّب البحث بكلمة أخرى أو قم بإلغاء الفلاتر المحددة'
              : 'Try adjusting your search terms or filters'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
