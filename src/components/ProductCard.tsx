import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/shopLogic';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    currency,
    addToCart,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    setSelectedProductId,
    setCurrentView,
  } = useShop();

  const isAr = language === 'ar';
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  // Calculate discount percentage if compareAtPrice is higher
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleOpenDetail = () => {
    setSelectedProductId(product.id);
    setQuickViewProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (product.variants && product.variants.length > 0) {
      // Open modal so user can choose their variant
      handleOpenDetail();
    } else {
      addToCart(product, undefined, 1);
    }
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.images[0]}
          alt={isAr ? product.titleAr : product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges on Top */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-[11px] font-black shadow-sm tracking-wide">
              {isAr ? `خصم ${discountPercent}%` : `-${discountPercent}%`}
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
              {isAr ? 'جديد' : 'NEW'}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 end-3 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600 shadow-sm'
          }`}
          aria-label={isAr ? 'إضافة إلى المفضلة' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 backdrop-blur-sm transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isAr ? 'نظرة سريعة' : 'Quick View'}</span>
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-500 uppercase text-[11px]">
              {isAr ? product.categoryAr : product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2">
            {isAr ? product.titleAr : product.title}
          </h3>

          {/* Variant swatches preview if color options exist */}
          {product.variants && product.variants.some((v) => v.options.color) && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.variants.map((v) => (
                <span
                  key={v.id}
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: v.options.color }}
                  title={isAr ? v.nameAr : v.name}
                />
              ))}
              <span className="text-[10px] text-slate-400 ms-1">
                {product.variants.length} {isAr ? 'خيارات' : 'options'}
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-950">
                {formatPrice(product.price, currency, language)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.compareAtPrice, currency, language)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] font-semibold text-amber-600">
                {isAr ? `متبقي ${product.stock} قطع فقط!` : `Only ${product.stock} left!`}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-2xs active:scale-95'
            }`}
            aria-label={isAr ? `إضافة ${product.titleAr} للسلة` : `Add ${product.title} to Cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
