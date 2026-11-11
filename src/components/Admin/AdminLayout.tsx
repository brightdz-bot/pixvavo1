import React from 'react';
import { useShop } from '../../context/ShopContext';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCustomers } from './AdminCustomers';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminDiscounts } from './AdminDiscounts';
import { AdminSettings } from './AdminSettings';
import { AdminStoreBuilder } from './AdminStoreBuilder';

export const AdminLayout: React.FC = () => {
  const { adminTab } = useShop();

  const renderContent = () => {
    switch (adminTab) {
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'customers':
        return <AdminCustomers />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'discounts':
        return <AdminDiscounts />;
      case 'builder':
        return <AdminStoreBuilder />;
      case 'settings':
        return <AdminSettings />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <AdminNavbar />
      <div className="flex-1 flex flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
