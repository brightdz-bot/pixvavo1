import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AdminTab,
  CartItem,
  Currency,
  Customer,
  DiscountCode,
  Language,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  ProductVariant,
  ThemeConfig,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_DISCOUNTS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_THEME_CONFIG,
} from '../data/seedData';
import { calculateCartTotals, validateDiscount } from '../utils/shopLogic';

interface ShopContextType {
  // Store items & Management
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart operations
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotals: ReturnType<typeof calculateCartTotals>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderInfo: {
    customer: Order['customer'];
    paymentMethod: PaymentMethod;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;

  // Customers & Discounts
  customers: Customer[];
  discounts: DiscountCode[];
  addDiscount: (discount: DiscountCode) => void;
  toggleDiscountActive: (code: string) => void;
  appliedDiscount: DiscountCode | null;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;

  // Theme & Settings
  themeConfig: ThemeConfig;
  updateThemeConfig: (updates: Partial<ThemeConfig>) => void;

  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;

  // Views & Modals
  currentView: 'storefront' | 'admin' | 'checkout' | 'order-success' | 'product-detail';
  setCurrentView: (view: 'storefront' | 'admin' | 'checkout' | 'order-success' | 'product-detail') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'shp_products_v1',
  CART: 'shp_cart_v1',
  WISHLIST: 'shp_wishlist_v1',
  ORDERS: 'shp_orders_v1',
  CUSTOMERS: 'shp_customers_v1',
  DISCOUNTS: 'shp_discounts_v1',
  THEME: 'shp_theme_v1',
  LANG: 'shp_lang_v1',
  CURR: 'shp_curr_v1',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Localization State
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'ar';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CURR) as Currency) || 'SAR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem(STORAGE_KEYS.CURR, curr);
  };

  // Sync RTL / LTR on load
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  // Discounts
  const [discounts, setDiscounts] = useState<DiscountCode[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISCOUNTS);
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(discounts));
  }, [discounts]);

  // Theme Config
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved ? JSON.parse(saved) : INITIAL_THEME_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(themeConfig));
  }, [themeConfig]);

  // Applied Discount
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);

  // Active Views & UI Modals
  const [currentView, setCurrentView] = useState<
    'storefront' | 'admin' | 'checkout' | 'order-success' | 'product-detail'
  >('storefront');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(
    null
  );

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Cart Totals calculation
  const cartTotals = calculateCartTotals(
    cart,
    appliedDiscount,
    themeConfig.freeShippingThreshold,
    themeConfig.standardShippingCost,
    themeConfig.taxRate
  );

  // Product actions
  const addProduct = (newProd: Omit<Product, 'id'>): Product => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
    showToast(language === 'ar' ? 'تم إضافة المنتج بنجاح' : 'Product created successfully');
    return product;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast(language === 'ar' ? 'تم تحديث بيانات المنتج' : 'Product updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(language === 'ar' ? 'تم حذف المنتج' : 'Product deleted', 'info');
  };

  // Cart actions
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedVariant: variant,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
    showToast(
      language === 'ar'
        ? `تمت إضافة "${product.titleAr}" إلى السلة`
        : `Added "${product.title}" to cart`
    );
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast(language === 'ar' ? 'تمت إزالة المنتج من السلة' : 'Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'ar' ? 'تمت الإضافة للمفضلة' : 'Added to wishlist');
        return [...prev, productId];
      }
    });
  };

  // Discounts
  const applyDiscount = (code: string): { success: boolean; message: string } => {
    const result = validateDiscount(code, cartTotals.subtotal, discounts);
    if (!result.valid || !result.discount) {
      const msg = result.error || (language === 'ar' ? 'الكوبون غير صالح' : 'Invalid coupon');
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    setAppliedDiscount(result.discount);
    const msg =
      language === 'ar'
        ? `تم تفعيل الكوبون "${result.discount.code}" بنجاح!`
        : `Coupon "${result.discount.code}" applied!`;
    showToast(msg, 'success');
    return { success: true, message: msg };
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    showToast(language === 'ar' ? 'تم إلغاء الكوبون' : 'Coupon removed', 'info');
  };

  const addDiscount = (discount: DiscountCode) => {
    setDiscounts((prev) => [discount, ...prev]);
    showToast(language === 'ar' ? 'تم إنشاء كود الخصم بنجاح' : 'Discount code created');
  };

  const toggleDiscountActive = (code: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.code === code ? { ...d, active: !d.active } : d))
    );
  };

  // Orders
  const createOrder = (orderInfo: {
    customer: Order['customer'];
    paymentMethod: PaymentMethod;
  }): Order => {
    const orderNumber = `#SHP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateStr,
      customer: orderInfo.customer,
      items: [...cart],
      subtotal: cartTotals.subtotal,
      discount: cartTotals.discountAmount,
      discountCode: appliedDiscount?.code,
      shipping: cartTotals.shipping,
      tax: cartTotals.tax,
      total: cartTotals.total,
      currency,
      status: 'unfulfilled',
      paymentStatus: 'paid',
      paymentMethod: orderInfo.paymentMethod,
      trackingNumber: `TRK-SA-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 10),
    };

    // Update orders
    setOrders((prev) => [newOrder, ...prev]);

    // Update customer history or add new customer
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.email.toLowerCase() === orderInfo.customer.email.toLowerCase()
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + newOrder.total,
                lastOrderDate: dateStr.substring(0, 10),
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: orderInfo.customer.name,
          email: orderInfo.customer.email,
          phone: orderInfo.customer.phone,
          totalOrders: 1,
          totalSpent: newOrder.total,
          lastOrderDate: dateStr.substring(0, 10),
        };
        return [newCust, ...prev];
      }
    });

    // Increment coupon used count if used
    if (appliedDiscount) {
      setDiscounts((prev) =>
        prev.map((d) =>
          d.code === appliedDiscount.code ? { ...d, usedCount: d.usedCount + 1 } : d
        )
      );
    }

    // Clear cart and applied discount
    clearCart();
    setAppliedDiscount(null);
    setLastPlacedOrder(newOrder);
    setCurrentView('order-success');

    showToast(
      language === 'ar' ? 'تم تأكيد طلبك بنجاح! شكراً لتسوقك معنا' : 'Order placed successfully!'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(trackingNumber ? { trackingNumber } : {}),
            }
          : o
      )
    );
    showToast(language === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated');
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o)));
    showToast(language === 'ar' ? 'تم تحديث حالة الدفع' : 'Payment status updated');
  };

  const updateThemeConfig = (updates: Partial<ThemeConfig>) => {
    setThemeConfig((prev) => ({ ...prev, ...updates }));
    showToast(language === 'ar' ? 'تم حفظ إعدادات المتجر' : 'Store settings saved');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotals,
        wishlist,
        toggleWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        customers,
        discounts,
        addDiscount,
        toggleDiscountActive,
        appliedDiscount,
        applyDiscount,
        removeDiscount,
        themeConfig,
        updateThemeConfig,
        language,
        setLanguage,
        currency,
        setCurrency,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        selectedProductId,
        setSelectedProductId,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        lastPlacedOrder,
        setLastPlacedOrder,
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
