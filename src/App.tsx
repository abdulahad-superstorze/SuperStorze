import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { ThemeLanguageProvider, useThemeLanguage } from './context/ThemeLanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSecurityGate } from './components/AdminSecurityGate';

const AppContent: React.FC = () => {
  const { currentPage } = useStore();
  const { isAdmin } = useAuth();
  const { language } = useThemeLanguage();

  // Route to Admin Panel
  if (currentPage === 'admin') {
    if (!isAdmin) {
      return (
        <div className={language === 'bn' ? 'font-bengali' : 'font-sans'}>
          <AdminSecurityGate />
          <ToastContainer />
        </div>
      );
    }

    return (
      <div className={language === 'bn' ? 'font-bengali' : 'font-sans'}>
        <AdminDashboard />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#060b15] text-slate-100 flex flex-col transition-colors duration-200 ${
        language === 'bn' ? 'font-bengali' : 'font-sans'
      }`}
    >
      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Main Pages */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'catalog' && <CatalogPage />}
        {currentPage === 'product-details' && <ProductDetailsPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'order-confirmation' && <OrderConfirmationPage />}
        {currentPage === 'track-order' && <TrackOrderPage />}
        {currentPage === 'account' && <AccountPage />}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />

      {/* Toast System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeLanguageProvider>
  );
}
