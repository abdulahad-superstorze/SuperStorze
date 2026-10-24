import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/ThemeLanguageContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, X, ArrowLeft } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const { products, categories, selectedCategorySlug, searchTerm, setSearchTerm, navigateTo } =
    useStore();
  const { isBangla, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategorySlug || 'all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'name'>('popular');

  useEffect(() => {
    if (selectedCategorySlug) {
      setActiveCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isActive) return false;
        const matchesCategory =
          activeCategory === 'all' || p.categoryId === activeCategory;
        const matchesSearch =
          searchTerm.trim() === '' ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        if (sortBy === 'price-low') return a.basePrice - b.basePrice;
        if (sortBy === 'price-high') return b.basePrice - a.basePrice;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, activeCategory, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Home Button */}
      <div className="mb-4">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0a1122] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>{isBangla ? '← হোমে ফিরে যান' : '← Back to Home'}</span>
        </button>
      </div>

      {/* Header and Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              {isBangla ? 'প্রোডাক্ট ক্যাটালগ ও গেম স্টোর' : 'Product Catalog & Store'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isBangla
                ? 'আপনার পছন্দের গেম টপআপ ও ডিজিটাল কার্ড বেছে নিন'
                : 'Browse all game top-ups, gift cards and subscriptions'}
            </p>
          </div>

          {/* Search Bar in Catalog */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBangla ? 'গেম বা কার্ড খুঁজুন...' : 'Search games or cards...'}
              className="w-full bg-[#0d1629] text-sm text-slate-200 placeholder:text-slate-400 pl-10 pr-9 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-cyan-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0a1122] border border-slate-800">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              {isBangla
                ? `সকল পণ্য (${products.filter((p) => p.isActive).length})`
                : `All Items (${products.filter((p) => p.isActive).length})`}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                {isBangla ? (cat.nameBn || cat.name) : cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 text-xs sm:text-sm text-slate-300 border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="popular">{isBangla ? 'জনপ্রিয়তা অনুসারে' : 'Most Popular'}</option>
              <option value="price-low">{isBangla ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price-high">{isBangla ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
              <option value="name">{isBangla ? 'নাম অনুসারে (A-Z)' : 'Name (A-Z)'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#0a1120] border border-slate-800 max-w-lg mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white mb-2">
            {isBangla ? 'কোনো প্রোডাক্ট পাওয়া যায়নি' : 'No products found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            {isBangla
              ? 'আপনার সার্চ ফিল্টার পরিবর্তন করুন বা অন্য কোনো গেমের নাম অনুসন্ধান করুন।'
              : 'Try adjusting your search terms or choose a different category.'}
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchTerm('');
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs sm:text-sm shadow-md cursor-pointer"
          >
            {isBangla ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
