import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/shopLogic';
import {
  X,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { language, currency, addToCart, setCurrentView, showToast } = useShop();

  if (!product) return null;

  const isAr = language === 'ar';

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Customer Review Form State
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState(product.reviews || []);

  const effectivePrice = product.price + (selectedVariant?.priceModifier || 0);
  const isOutOfStock = (selectedVariant ? selectedVariant.stock : product.stock) <= 0;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > effectivePrice
      ? Math.round(((product.compareAtPrice - effectivePrice) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    onClose();
    setCurrentView('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: new Date().toISOString().substring(0, 10),
      comment: newReviewComment.trim(),
    };

    setLocalReviews([newRev, ...localReviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    showToast(isAr ? 'شكراً لك! تم إضافة تقييمك' : 'Thank you! Your review was submitted');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
              {isAr ? product.categoryAr : product.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label={isAr ? 'إغلاق نافذة المنتج' : 'Close Product Modal'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={isAr ? product.titleAr : product.title}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                {discountPercent && (
                  <span className="absolute top-4 start-4 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-black shadow-md">
                    {isAr ? `وفر ${discountPercent}%` : `Save ${discountPercent}%`}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="flex flex-col">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                <span className="text-xs text-slate-400">
                  ({localReviews.length || product.reviewCount} {isAr ? 'تقييم موثق' : 'reviews'})
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-3">
                {isAr ? product.titleAr : product.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatPrice(effectivePrice, currency, language)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > effectivePrice && (
                  <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                    {formatPrice(product.compareAtPrice, currency, language)}
                  </span>
                )}
                <span className="ms-auto text-xs text-emerald-700 font-bold bg-emerald-100/80 px-2 py-1 rounded-md flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {isAr ? 'شامل ضريبة القيمة المضافة' : 'VAT Included'}
                </span>
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {isAr ? 'اختر الخيار المناسب:' : 'Select Option:'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          {v.options.color && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                              style={{ backgroundColor: v.options.color }}
                            />
                          )}
                          <span>{isAr ? v.nameAr : v.name}</span>
                          {v.priceModifier ? (
                            <span className="text-[10px] text-emerald-600">
                              (+{formatPrice(v.priceModifier, currency, language)})
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock availability */}
              <div className="mb-6 flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'
                  }`}
                />
                <span className="text-xs font-bold text-slate-700">
                  {isOutOfStock
                    ? isAr
                      ? 'نفذت الكمية من المخزون'
                      : 'Out of Stock'
                    : isAr
                    ? `متوفر بالمخزون (${selectedVariant ? selectedVariant.stock : product.stock} قطعة)`
                    : `In Stock (${selectedVariant ? selectedVariant.stock : product.stock} units)`}
                </span>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
                {/* Stepper */}
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-1 bg-white sm:w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label={isAr ? 'تقليل الكمية' : 'Decrease Quantity'}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-800 px-3">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label={isAr ? 'زيادة الكمية' : 'Increase Quantity'}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAr ? 'أضف إلى السلة' : 'Add to Cart'}</span>
                </button>

                {/* 1-Click Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/30"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isAr ? 'اشتري الآن' : 'Buy Now'}</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {isAr ? 'شحن سريع' : 'Fast Shipping'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {isAr ? 'ضمان أصلي 100%' : '100% Genuine'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {isAr ? 'إرجاع مجاني 14 يوم' : '14-Day Return'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Reviews Tabs */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-4 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'desc'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {isAr ? 'تفاصيل المنتج' : 'Product Description'}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'specs'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {isAr ? 'المواصفات والضمان' : 'Specifications'}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{isAr ? 'تقييمات المشترين' : 'Customer Reviews'}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                  {localReviews.length}
                </span>
              </button>
            </div>

            {/* Tab 1: Description */}
            {activeTab === 'desc' && (
              <div className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                <p className="mb-4">{isAr ? product.descriptionAr : product.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Specifications */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-sm">
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                  <span className="text-slate-500">{isAr ? 'الموديل / الكود' : 'SKU / Model'}</span>
                  <span className="font-bold text-slate-800">{product.sku}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                  <span className="text-slate-500">{isAr ? 'بلد المنشأ' : 'Origin'}</span>
                  <span className="font-bold text-slate-800">
                    {isAr ? 'معتمد رسمياً' : 'Official Certified'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                  <span className="text-slate-500">{isAr ? 'فترة الضمان' : 'Warranty'}</span>
                  <span className="font-bold text-slate-800">
                    {isAr ? 'سنتان ضمان الوكيل' : '2 Years Warranty'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                  <span className="text-slate-500">{isAr ? 'سياسة الاسترجاع' : 'Returns'}</span>
                  <span className="font-bold text-slate-800">
                    {isAr ? '14 يوماً مجاناً' : '14 Days Free'}
                  </span>
                </div>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Submit Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200"
                >
                  <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'أضف تقييمك ورأيك في المنتج' : 'Write a Product Review'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'اسمك الكريم' : 'Your Name'}
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    />
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500">{isAr ? 'التقييم:' : 'Rating:'}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setNewReviewRating(s)}
                            className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                s <= newReviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder={
                      isAr
                        ? 'شاركنا تجربتك مع المنتج، جودة الصنع، وسرعة التوصيل...'
                        : 'Share your experience...'
                    }
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden mb-3"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    {isAr ? 'نشر التقييم' : 'Submit Review'}
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {localReviews.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">
                      {isAr ? 'كن أول من يقيم هذا المنتج!' : 'Be the first to review this product!'}
                    </p>
                  ) : (
                    localReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-slate-900">{rev.author}</span>
                          <span className="text-xs text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
