export type Language = 'ar' | 'en';
export type Currency = 'SAR' | 'USD' | 'AED' | 'EUR';

export interface ProductVariant {
  id: string;
  name: string;
  nameAr: string;
  options: {
    color?: string;
    size?: string;
  };
  priceModifier?: number;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  categoryAr: string;
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  variants?: ProductVariant[];
  reviews?: Review[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string; // unique item id (product id + variant id)
  productId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export type OrderStatus = 'unfulfilled' | 'fulfilled' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type PaymentMethod = 'credit_card' | 'apple_pay' | 'mada' | 'cod' | 'tamara';

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  tax: number;
  total: number;
  currency: Currency;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  trackingNumber: string;
  estimatedDelivery: string;
}

export type DiscountType = 'percent' | 'fixed' | 'free_shipping';

export interface DiscountCode {
  code: string;
  type: DiscountType;
  value: number; // percentage or fixed amount
  minOrderValue: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  descriptionAr: string;
  descriptionEn: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export type ThemeTemplate = 'dawn' | 'sense' | 'craft';

export interface ThemeConfig {
  storeName: string;
  storeNameAr: string;
  template: ThemeTemplate;
  announcementText: string;
  announcementTextAr: string;
  announcementEnabled: boolean;
  heroTitle: string;
  heroTitleAr: string;
  heroSubtitle: string;
  heroSubtitleAr: string;
  heroBadge: string;
  heroBadgeAr: string;
  heroImage: string;
  primaryColor: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  taxRate: number; // e.g. 0.15 for 15% VAT
}

export interface StoreProfile {
  id: string;
  name: string;
  nameAr: string;
  domain: string;
  template: ThemeTemplate;
  currency: Currency;
  category: string;
}

export type AdminTab = 'dashboard' | 'orders' | 'products' | 'customers' | 'analytics' | 'discounts' | 'settings' | 'builder';

