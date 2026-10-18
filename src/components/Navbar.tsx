import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  Zap,
  Clock,
  Sparkles,
  LogOut,
  Wallet,
  PlusCircle,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { siteSettings, currentPage, navigateTo, searchTerm, setSearchTerm } = useStore();
  const { user, profile, isAdmin, loginWithGoogle, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme, language, toggleLanguage, t } = useThemeLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigateTo('catalog');
    }
  };

  const navLinks = [
    { label: t('nav_home'), page: 'home' as const, isTrack: false },
    { label: t('nav_game_topup'), page: 'catalog' as const, categorySlug: 'game-top-up', isTrack: false },
    { label: t('nav_digital_cards'), page: 'catalog' as const, categorySlug: 'digital-cards', isTrack: false },
    { label: t('nav_track_order'), page: 'track-order' as const, isTrack: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080d1a]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          {/* Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-cyan-400 flex items-center justify-center font-heading font-black text-black text-xl shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              SS
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                {siteSettings.storeName || 'SuperStorez.com'}
              </span>
              <span className="text-[10px] text-cyan-400/80 -mt-1 font-medium tracking-wider uppercase">
                Gaming & Top-up Store
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                currentPage === link.page ||
                (link.categorySlug && currentPage === 'catalog');

              if (link.isTrack) {
                return (
                  <button
                    key={link.label}
                    onClick={() => navigateTo(link.page)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                      currentPage === 'track-order'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/30'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.label}
                  onClick={() =>
                    navigateTo(link.page, link.categorySlug ? { categorySlug: link.categorySlug } : undefined)
                  }
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-xs xl:max-w-sm mx-2"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('nav_search_placeholder')}
              className="w-full bg-[#0d1527] text-sm text-slate-200 placeholder:text-slate-400 pl-10 pr-4 py-2 rounded-full border border-slate-700/80 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </form>

          {/* Right Action Area */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Bangla / English Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0d1629] border border-slate-700/80 hover:border-cyan-500/60 text-xs font-semibold text-slate-200 hover:text-cyan-400 transition-all cursor-pointer shadow-sm group"
              title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-180 transition-transform duration-300" />
              <span className="font-heading font-bold text-[11px] tracking-wide">
                {language === 'bn' ? 'বাং' : 'EN'}
              </span>
            </button>

            {/* Day / Night Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#0d1629] border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-400 transition-all cursor-pointer shadow-sm flex items-center justify-center group"
              title={theme === 'dark' ? t('mode_day') : t('mode_night')}
              aria-label="Toggle Day / Night Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-500 group-hover:-rotate-12 transition-transform duration-200" />
              )}
            </button>

            {/* Wallet Balance / User button */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1629] border border-cyan-900/60 hover:border-cyan-500/50 transition-all text-xs sm:text-sm text-slate-200 shadow-sm cursor-pointer"
                >
                  <span className="text-slate-400 hidden sm:inline">{t('nav_balance')}:</span>
                  <span className="font-heading font-bold text-cyan-400">
                    ৳ {(profile?.walletBalance ?? 0).toFixed(2)}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-700/50 overflow-hidden">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 hover:border-cyan-400 transition-all text-xs sm:text-sm text-cyan-300 font-semibold cursor-pointer shadow-sm shadow-cyan-500/10 active:scale-95"
                >
                  <span>{t('nav_login')}</span>
                  <div className="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-700/40">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0c1426] border border-slate-700/80 shadow-2xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white truncate">{profile?.displayName || t('nav_user_greeting')}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    <div className="mt-2 flex items-center justify-between text-xs bg-cyan-950/40 p-2 rounded-lg border border-cyan-900/40">
                      <span className="text-slate-300">{t('nav_balance')}</span>
                      <span className="font-heading font-bold text-cyan-400">
                        ৳ {(profile?.walletBalance ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => navigateTo('account')}
                      className="mt-2 w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{t('nav_deposit_btn')}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => navigateTo('account')}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span>{t('nav_my_account')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('track-order')}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>{t('nav_live_tracker')}</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => navigateTo('admin')}
                      className="w-full text-left px-4 py-2 text-cyan-300 hover:bg-cyan-950/40 flex items-center gap-2.5 transition-colors font-medium border-t border-slate-800 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>{t('nav_admin_panel')}</span>
                    </button>
                  )}

                  <div className="border-t border-slate-800 mt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-950/20 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav_logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#0d1629] border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-400 transition-all cursor-pointer shadow-sm"
              title={t('nav_cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-black font-extrabold text-xs flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('nav_search_placeholder')}
              className="w-full bg-[#0d1527] text-sm text-slate-200 placeholder:text-slate-400 pl-10 pr-4 py-2 rounded-full border border-slate-700/80 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </form>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800/80 space-y-3 animate-in slide-in-from-top duration-200">
            {/* Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo(link.page, link.categorySlug ? { categorySlug: link.categorySlug } : undefined);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between cursor-pointer ${
                    currentPage === link.page
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isTrack && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Day / Night and Bangla / English Quick Controls for Mobile */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0d1629] border border-slate-700/80 text-xs font-medium text-slate-200 hover:border-cyan-500/60 transition-all cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>{t('mode_day')}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-cyan-500" />
                    <span>{t('mode_night')}</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0d1629] border border-slate-700/80 text-xs font-medium text-slate-200 hover:border-cyan-500/60 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{language === 'bn' ? 'English (EN)' : 'বাংলা (BN)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
