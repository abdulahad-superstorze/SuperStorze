import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/ThemeLanguageContext';
import { ArrowRight, Star, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo } = useStore();
  const { isBangla, t } = useLanguage();

  const minPrice =
    product.variations && product.variations.length > 0
      ? Math.min(...product.variations.map((v) => v.price))
      : product.basePrice;

  const maxPrice =
    product.variations && product.variations.length > 0
      ? Math.max(...product.variations.map((v) => v.price))
      : product.basePrice;

  const priceRange =
    minPrice === maxPrice
      ? `৳ ${minPrice}`
      : `৳ ${minPrice} - ৳ ${maxPrice}`;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      onClick={() => navigateTo('product-details', { productId: product.id })}
      className="cursor-pointer group flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#0d1629] via-[#0b1222] to-[#070d1a] border border-slate-800/90 hover:border-cyan-500/60 p-4 transition-all duration-200 hover:-translate-y-1.5 shadow-lg hover:shadow-cyan-500/15"
    >
      <div>
        {/* Image banner area */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-900 border border-slate-800">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09101e] via-transparent to-transparent opacity-80" />

          {/* Badges on image */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {product.isPopular && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-black shadow-md">
                <Flame className="w-3 h-3 fill-black" />
                <span>{isBangla ? 'জনপ্রিয়' : 'POPULAR'}</span>
              </span>
            )}
            {product.isFeatured && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/90 text-black shadow-md">
                <Star className="w-3 h-3 fill-black" />
                <span>{isBangla ? 'ফিচার্ড' : 'FEATURED'}</span>
              </span>
            )}
          </div>

          {/* Stock Tag on Image */}
          <div className="absolute top-2.5 right-2.5">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-950/80 text-rose-300 border border-rose-800/60">
                {isBangla ? 'স্টক শেষ' : 'Out of Stock'}
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60">
                {isBangla ? 'সীমিত স্টক' : 'Low Stock'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                {isBangla ? 'স্টকে আছে' : 'In Stock'}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="text-[11px] text-cyan-400 font-medium mb-1 truncate">
          {product.tags && product.tags.length > 0
            ? product.tags.join(' • ')
            : product.categoryName}
        </div>

        {/* Product Title */}
        <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Product Subtitle */}
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
          {product.subtitle || product.description}
        </p>
      </div>

      {/* Footer info & CTA */}
      <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block -mb-0.5">
            {isBangla ? 'শুরু হচ্ছে' : 'Starts from'}
          </span>
          <span className="font-heading font-bold text-base text-cyan-400">
            {priceRange}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateTo('product-details', { productId: product.id });
          }}
          disabled={isOutOfStock}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isOutOfStock
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-[#15213b] hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-800/40 hover:border-cyan-400 shadow-sm'
          }`}
        >
          <span>{isOutOfStock ? (isBangla ? 'স্টক নেই' : 'Out of Stock') : (isBangla ? 'কিনুন' : 'Buy Now')}</span>
          {!isOutOfStock && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
