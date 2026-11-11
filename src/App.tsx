import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { StorefrontCatalog } from './components/StorefrontCatalog';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { AdminLayout } from './components/Admin/AdminLayout';
import { Toast } from './components/Toast';

import { ShopifyCollectionList, ShopifyImageWithText } from './components/ShopifyDawnSections';

const AppContent: React.FC = () => {
  const { currentView, quickViewProduct, setQuickViewProduct } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const handleShopNowScroll = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCollection = (categoryId: string) => {
    setActiveCategoryFilter(categoryId);
    handleShopNowScroll();
  };

  // If in Shopify Merchant Center Admin mode
  if (currentView === 'admin') {
    return (
      <>
        <AdminLayout />
        <Toast />
      </>
    );
  }

  // If in Checkout flow
  if (currentView === 'checkout') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />
        <main className="flex-1">
          <CheckoutPage />
        </main>
        <CartDrawer />
        <WishlistDrawer />
        <Toast />
      </div>
    );
  }

  // If in Order Confirmation / Tracking flow
  if (currentView === 'order-success') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />
        <main className="flex-1">
          <OrderSuccessPage />
        </main>
        <CartDrawer />
        <WishlistDrawer />
        <Toast />
      </div>
    );
  }

  // Default: Storefront Catalog View
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-emerald-600 selection:text-white">
      {/* Top Header */}
      <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-12">
        {/* Hero Section */}
        <HeroBanner onShopNowClick={handleShopNowScroll} />

        {/* Shopify Dawn Collection Showcase */}
        <ShopifyCollectionList onSelectCategory={handleSelectCollection} />

        {/* Dynamic Catalog Section */}
        <StorefrontCatalog searchQuery={searchQuery} />

        {/* Shopify Dawn Image With Text Editorial */}
        <ShopifyImageWithText />
      </main>

      {/* Overlays and Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
