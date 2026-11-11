import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPrice,
  validateDiscount,
  calculateCartTotals,
  filterAndSortProducts,
} from './shopLogic';
import { CartItem, DiscountCode, Product } from '../types';

const mockProduct: Product = {
  id: 'prod-1',
  title: 'Wireless Earbuds',
  titleAr: 'سماعات لاسلكية برو',
  description: 'High fidelity audio',
  descriptionAr: 'صوت عالي النقاء بتقنية إلغاء الضوضاء',
  price: 200,
  category: 'electronics',
  categoryAr: 'إلكترونيات',
  tags: ['audio', 'bluetooth'],
  images: ['https://example.com/earbuds.jpg'],
  rating: 4.8,
  reviewCount: 34,
  stock: 15,
  sku: 'EAR-001',
  isFeatured: true,
};

const mockDiscounts: DiscountCode[] = [
  {
    code: 'SAVE10',
    type: 'percent',
    value: 10,
    minOrderValue: 100,
    usedCount: 5,
    active: true,
    descriptionAr: 'خصم 10%',
    descriptionEn: '10% off',
  },
  {
    code: 'FIXED50',
    type: 'fixed',
    value: 50,
    minOrderValue: 200,
    usedCount: 0,
    active: true,
    descriptionAr: 'خصم 50 ر.س',
    descriptionEn: '50 SAR off',
  },
  {
    code: 'INACTIVE',
    type: 'percent',
    value: 20,
    minOrderValue: 50,
    usedCount: 1,
    active: false,
    descriptionAr: 'غير نشط',
    descriptionEn: 'Inactive',
  },
];

test('formatPrice correctly outputs localized currency string', () => {
  const arabicFormat = formatPrice(250, 'SAR', 'ar');
  assert.ok(arabicFormat.includes('250'));
  assert.ok(arabicFormat.includes('ر.س'));

  const usdFormat = formatPrice(100, 'USD', 'en');
  assert.ok(usdFormat.includes('$'));
});

test('validateDiscount checks validity, active state, and minimum order value', () => {
  // Valid coupon
  const res1 = validateDiscount('save10', 150, mockDiscounts);
  assert.equal(res1.valid, true);
  assert.equal(res1.discount?.code, 'SAVE10');

  // Order value below min
  const res2 = validateDiscount('SAVE10', 80, mockDiscounts);
  assert.equal(res2.valid, false);
  assert.ok(res2.error?.includes('100'));

  // Inactive coupon
  const res3 = validateDiscount('INACTIVE', 100, mockDiscounts);
  assert.equal(res3.valid, false);

  // Non-existent coupon
  const res4 = validateDiscount('UNKNOWN99', 500, mockDiscounts);
  assert.equal(res4.valid, false);
});

test('calculateCartTotals computes subtotal, discounts, free shipping and tax accurately', () => {
  const items: CartItem[] = [
    {
      id: 'cart-1',
      productId: 'prod-1',
      product: mockProduct,
      quantity: 2, // 2 * 200 = 400 SAR
    },
  ];

  // 10% discount on 400 = 40 SAR discount. Taxable = 360 SAR.
  // 400 >= free shipping threshold (250), so shipping = 0.
  // Tax (15% of 360) = 54 SAR.
  // Total = 360 + 0 + 54 = 414 SAR.
  const totals = calculateCartTotals(items, mockDiscounts[0], 250, 25, 0.15);

  assert.equal(totals.subtotal, 400);
  assert.equal(totals.itemCount, 2);
  assert.equal(totals.discountAmount, 40);
  assert.equal(totals.shipping, 0);
  assert.equal(totals.tax, 54);
  assert.equal(totals.total, 414);
  assert.equal(totals.freeShippingProgress, 100);
  assert.equal(totals.amountNeededForFreeShipping, 0);
});

test('filterAndSortProducts correctly filters by search and category', () => {
  const products: Product[] = [
    mockProduct,
    {
      ...mockProduct,
      id: 'prod-2',
      title: 'Leather Wallet',
      titleAr: 'محفظة جلد طبيعي',
      category: 'fashion',
      categoryAr: 'أزياء',
      price: 120,
      stock: 0,
      isFeatured: false,
    },
  ];

  // Category filter
  const electronicsOnly = filterAndSortProducts(products, { category: 'electronics' });
  assert.equal(electronicsOnly.length, 1);
  assert.equal(electronicsOnly[0].id, 'prod-1');

  // Search filter (in Arabic)
  const searchResult = filterAndSortProducts(products, { query: 'محفظة' });
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].id, 'prod-2');

  // In stock only filter
  const inStockResult = filterAndSortProducts(products, { inStockOnly: true });
  assert.equal(inStockResult.length, 1);
  assert.equal(inStockResult[0].id, 'prod-1');
});
