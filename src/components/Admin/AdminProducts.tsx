import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/shopLogic';
import { Product } from '../../types';
import {
  Boxes,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, language, currency } = useShop();

  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newPrice, setNewPrice] = useState('299');
  const [newComparePrice, setNewComparePrice] = useState('399');
  const [newCategory, setNewCategory] = useState('electronics');
  const [newStock, setNewStock] = useState('20');
  const [newSku, setNewSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
  );
  const [newDescAr, setNewDescAr] = useState('');
  const [newDescEn, setNewDescEn] = useState('');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.title.toLowerCase().includes(q) ||
        p.titleAr.includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr.trim() && !newTitle.trim()) return;

    const titleEn = newTitle.trim() || newTitleAr.trim();
    const titleAr = newTitleAr.trim() || newTitle.trim();

    const categoryMap: Record<string, string> = {
      electronics: 'إلكترونيات',
      fashion: 'أزياء وإكسسوارات',
      perfumes: 'عطور وعناية',
      home: 'المنزل والديكور',
    };

    addProduct({
      title: titleEn,
      titleAr,
      description: newDescEn || titleEn,
      descriptionAr: newDescAr || titleAr,
      price: parseFloat(newPrice) || 100,
      compareAtPrice: newComparePrice ? parseFloat(newComparePrice) : undefined,
      category: newCategory,
      categoryAr: categoryMap[newCategory] || newCategory,
      tags: ['جديد', newCategory],
      images: [newImageUrl],
      rating: 5.0,
      reviewCount: 1,
      stock: parseInt(newStock, 10) || 10,
      sku: newSku,
      isFeatured: true,
      isNew: true,
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewTitleAr('');
    setNewDescAr('');
    setNewDescEn('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isAr ? 'إدارة المنتجات والمخزون' : 'Products & Inventory'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr
              ? 'إضافة وتعديل المنتجات، ضبط الأسعار ومراقبة مستويات المخزون.'
              : 'Add, update products, modify pricing, and track live stock levels.'}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة منتج جديد' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', ar: 'جميع الأقسام', en: 'All Categories' },
            { id: 'electronics', ar: 'إلكترونيات', en: 'Electronics' },
            { id: 'fashion', ar: 'أزياء', en: 'Fashion' },
            { id: 'perfumes', ar: 'عطور', en: 'Perfumes' },
            { id: 'home', ar: 'منزل', en: 'Home' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم، الباركود...' : 'Search title, SKU...'}
            className="w-full ps-8 pe-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 outline-hidden"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'المنتج' : 'Product'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'القسم' : 'Category'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'السعر' : 'Price'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'المخزون' : 'Stock'}</th>
                <th className="py-3.5 px-4 text-start font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-4 text-end font-semibold">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 5;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {isAr ? p.titleAr : p.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {isAr ? p.categoryAr : p.category}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-950">
                      {formatPrice(p.price, currency, language)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          value={p.stock}
                          onChange={(e) =>
                            updateProduct(p.id, {
                              stock: Math.max(0, parseInt(e.target.value, 10) || 0),
                            })
                          }
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 text-center focus:bg-white focus:border-emerald-500"
                        />
                        <span className="text-slate-400 text-[11px]">{isAr ? 'قطعة' : 'units'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-800'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOutOfStock
                          ? isAr
                            ? 'نفذ المخزون'
                            : 'Out of Stock'
                          : isLowStock
                          ? isAr
                            ? 'مخزون منخفض'
                            : 'Low Stock'
                          : isAr
                          ? 'متوفر'
                          : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={isAr ? 'حذف المنتج' : 'Delete Product'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
              <h3 className="font-bold text-slate-900 text-base">
                {isAr ? 'إضافة منتج جديد لمتجر شوبيفاي' : 'Add New Shopify Product'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAr ? 'اسم المنتج بالعربية' : 'Title (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitleAr}
                    onChange={(e) => setNewTitleAr(e.target.value)}
                    placeholder="مثال: سماعة رأس لاسلكية فائقة"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAr ? 'اسم المنتج بالإنجليزية' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Ultra Wireless Headphones"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAr ? 'السعر (ر.س)' : 'Price (SAR)'} *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAr ? 'السعر قبل الخصم' : 'Compare-at Price'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newComparePrice}
                    onChange={(e) => setNewComparePrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAr ? 'الكمية بالمخزون' : 'Stock Units'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAr ? 'القسم / التصنيف' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden bg-white"
                  >
                    <option value="electronics">إلكترونيات (Electronics)</option>
                    <option value="fashion">أزياء وإكسسوارات (Fashion)</option>
                    <option value="perfumes">عطور وعناية (Perfumes)</option>
                    <option value="home">المنزل والديكور (Home)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAr ? 'رمز المنتج (SKU)' : 'SKU'}
                  </label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isAr ? 'رابط صورة المنتج' : 'Image URL'}
                </label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isAr ? 'وصف المنتج' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={newDescAr}
                  onChange={(e) => setNewDescAr(e.target.value)}
                  placeholder={
                    isAr ? 'تفاصيل ومواصفات المنتج...' : 'Product specifications and highlights...'
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
                >
                  {isAr ? 'حفظ ونشر المنتج' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
