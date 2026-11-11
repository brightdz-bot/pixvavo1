import { CartItem, Currency, DiscountCode, Language, Product } from '../types';

export const CURRENCY_RATES: Record<Currency, number> = {
  SAR: 1,      // Base currency (Saudi Riyal)
  USD: 0.266,  // ~ 1 SAR = 0.266 USD
  AED: 0.98,   // ~ 1 SAR = 0.98 AED
  EUR: 0.245,  // ~ 1 SAR = 0.245 EUR
};

export const CURRENCY_SYMBOLS: Record<Currency, { ar: string; en: string }> = {
  SAR: { ar: 'ر.س', en: 'SAR' },
  USD: { ar: '$', en: '$' },
  AED: { ar: 'د.إ', en: 'AED' },
  EUR: { ar: '€', en: '€' },
};

/**
 * Format a price in SAR into the target currency and locale
 */
export function formatPrice(
  amountInSAR: number,
  currency: Currency = 'SAR',
  language: Language = 'ar'
): string {
  const rate = CURRENCY_RATES[currency] || 1;
  const converted = amountInSAR * rate;
  const symbol = CURRENCY_SYMBOLS[currency][language];

  // Using standard e-commerce number formatting
  const formattedNumber = converted.toLocaleString('en-US', {
    minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return language === 'ar' ? `${formattedNumber} ${symbol}` : `${symbol} ${formattedNumber}`;
}

/**
 * Validates a discount coupon against subtotal
 */
export function validateDiscount(
  code: string,
  subtotal: number,
  availableCodes: DiscountCode[]
): { valid: boolean; discount?: DiscountCode; error?: string } {
  const cleanCode = code.trim().toUpperCase();
  const found = availableCodes.find((d) => d.code.toUpperCase() === cleanCode);

  if (!found) {
    return { valid: false, error: 'كوبون الخصم غير صحيح' };
  }

  if (!found.active) {
    return { valid: false, error: 'هذا الكوبون غير مفعّل حالياً' };
  }

  if (found.maxUses && found.usedCount >= found.maxUses) {
    return { valid: false, error: 'لقد وصل هذا الكوبون للحد الأقصى للاستخدام' };
  }

  if (subtotal < found.minOrderValue) {
    return {
      valid: false,
      error: `الحد الأدنى للطلب لاستخدام هذا الكوبون هو ${found.minOrderValue} ر.س`,
    };
  }

  return { valid: true, discount: found };
}

/**
 * Calculates cart subtotal, discount, shipping, tax, and final total
 */
export function calculateCartTotals(
  items: CartItem[],
  appliedDiscount: DiscountCode | null,
  freeShippingThreshold = 250,
  standardShipping = 25,
  taxRate = 0.15
): {
  subtotal: number;
  itemCount: number;
  discountAmount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingProgress: number; // 0 to 100 percentage
  amountNeededForFreeShipping: number;
} {
  const subtotal = items.reduce((acc, item) => {
    const unitPrice =
      (item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity;
    return acc + unitPrice;
  }, 0);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  let isFreeShippingByDiscount = false;

  if (appliedDiscount && subtotal >= appliedDiscount.minOrderValue) {
    if (appliedDiscount.type === 'percent') {
      discountAmount = (subtotal * appliedDiscount.value) / 100;
    } else if (appliedDiscount.type === 'fixed') {
      discountAmount = Math.min(appliedDiscount.value, subtotal);
    } else if (appliedDiscount.type === 'free_shipping') {
      isFreeShippingByDiscount = true;
    }
  }

  // Shipping calculation
  const qualifiedForFreeShipping = subtotal >= freeShippingThreshold || isFreeShippingByDiscount;
  const shipping = items.length === 0 ? 0 : qualifiedForFreeShipping ? 0 : standardShipping;

  // Free shipping progress
  const freeShippingProgress =
    freeShippingThreshold > 0
      ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
      : 100;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Tax calculation (VAT applied on discounted subtotal + shipping)
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * taxRate * 100) / 100;

  // Final Total
  const total = Math.max(0, taxableAmount + shipping + tax);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    itemCount,
    discountAmount: Math.round(discountAmount * 100) / 100,
    shipping,
    tax,
    total: Math.round(total * 100) / 100,
    freeShippingProgress,
    amountNeededForFreeShipping: Math.round(amountNeededForFreeShipping * 100) / 100,
  };
}

/**
 * Filter & sort products
 */
export interface ProductFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let result = [...products];

  // Search query filter
  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.titleAr.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.descriptionAr.includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }

  // Price range
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= (filters.minPrice as number));
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= (filters.maxPrice as number));
  }

  // In-stock only
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }

  // Sorting
  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'featured':
    default:
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  return result;
}
