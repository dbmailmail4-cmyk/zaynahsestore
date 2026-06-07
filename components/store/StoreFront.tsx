'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Category, StoreSettings, Review } from '@/lib/types';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';
import { useSearchStore } from '@/store/searchStore';
import { 
  Truck, Shield, RefreshCw, Phone, HelpCircle, Award, Star, Lock, Clock, Gift, Headphones 
} from '@/components/common/Icons';
import StarRating from './StarRating';
import { format, parseISO } from 'date-fns';

interface StoreFrontProps {
  initialProducts: Product[];
  categories: Category[];
  settings: StoreSettings;
  reviews?: (Review & { productName?: string; productSlug?: string })[];
}

export default function StoreFront({
  initialProducts,
  categories,
  settings,
  reviews = []
}: StoreFrontProps) {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialProducts.filter(product => {
      const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
      if (!q) return matchesCategory;

      const matchesSearch = 
        product.name.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q)) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(q)) ||
        (product.sku && product.sku.toLowerCase().includes(q)) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (product.category?.name && product.category.name.toLowerCase().includes(q)) ||
        (product.variants && product.variants.some(v => 
          v.active && (
            (v.color && v.color.toLowerCase().includes(q)) ||
            (v.size && v.size.toLowerCase().includes(q)) ||
            (v.material && v.material.toLowerCase().includes(q)) ||
            (v.sku && v.sku.toLowerCase().includes(q)) ||
            (v.customValue && v.customValue.toLowerCase().includes(q))
          )
        ));

      return matchesCategory && matchesSearch;
    });
  }, [initialProducts, selectedCategoryId, searchQuery]);

  // Dynamic Icon selector for trust badges
  const renderBadgeIcon = (iconName: string) => {
    const props = { className: "h-6 w-6 text-[#e94560]" };
    switch (iconName) {
      case 'Truck': return <Truck {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'RefreshCw': return <RefreshCw {...props} />;
      case 'Phone': return <Phone {...props} />;
      case 'HelpCircle': return <HelpCircle {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Star': return <Star {...props} />;
      case 'Lock': return <Lock {...props} />;
      case 'Clock': return <Clock {...props} />;
      case 'Gift': return <Gift {...props} />;
      case 'Headphones': return <Headphones {...props} />;
      default: return <Truck {...props} />;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarColorClass = (name: string) => {
    const colors = [
      'bg-[#FF8B3D]',
      'bg-[#10b981]',
      'bg-[#3b82f6]',
      'bg-[#8b5cf6]',
      'bg-[#e94560]',
      'bg-[#06b6d4]',
      'bg-[#f59e0b]'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6 pb-12 min-h-screen bg-gray-50 dark:bg-[#0f0f1b] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Banner / Hero */}
      {settings.bannerUrl ? (
        <div className="relative h-44 w-full bg-[#1a1a2e] sm:h-64 overflow-hidden">
          <Image
            src={settings.bannerUrl}
            alt={settings.storeName}
            fill
            sizes="100vw"
            priority
            unoptimized={true}
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-[#1a1a2e]/90 to-transparent">
            {settings.tagline && (
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                {settings.tagline}
              </p>
            )}
            <h1 className="text-white text-2xl font-bold md:text-4xl">
              {settings.storeName}
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#e94560] text-white p-8 shadow-sm text-center">
          {settings.tagline && (
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
              {settings.tagline}
            </p>
          )}
          <h1 className="text-2xl font-bold md:text-3xl">{settings.storeName}</h1>
        </div>
      )}

      {/* Filters & Search */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {settings.enableCategoryFilter && (
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        )}

        {/* Product Listing */}
        <div className="pt-2">
          <ProductGrid products={filteredProducts} currencySymbol={settings.currencySymbol} settings={settings} />
        </div>

        {/* Homepage Reviews Grid */}
        {!searchQuery && reviews && reviews.length > 0 && (
          <div className="pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                What Our Customers Say
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-sm">
                <span>★★★★★</span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Trusted by hundreds of happy customers</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16162a] shadow-sm text-gray-900 dark:text-white transition-colors duration-200"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm ${getAvatarColorClass(review.customerName)}`}>
                    {getInitials(review.customerName)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    {/* Stars & Date */}
                    <div className="flex items-center justify-between gap-4">
                      <StarRating rating={review.rating} showText={false} starSize={12} />
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Name & Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-gray-950 dark:text-white">
                        {review.customerName}
                      </span>
                      <div className="flex items-center gap-0.5 text-[9px] font-bold text-[#10b981] bg-[#10b981]/10 dark:bg-[#10b981]/15 px-1.5 py-0.5 rounded-full select-none">
                        <span className="text-[8px] font-bold">✓</span>
                        <span>Verified Buyer</span>
                      </div>
                    </div>

                    {/* Review Comment */}
                    {review.comment && (
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                        "{review.comment}"
                      </p>
                    )}

                    {/* Product Reviewed Reference */}
                    {review.productName && review.productSlug && (
                      <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                        Reviewed product: <Link href={`/product/${review.productSlug}`} className="text-[#e94560] hover:underline transition-colors">{review.productName}</Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Homepage Shopify-Style Trust Badges */}
        {settings.enableTrustBadges && (
          (() => {
            const badge1Active = settings.trustBadge1Enabled && (settings.trustBadge1Title || settings.trustBadge1Desc);
            const badge2Active = settings.trustBadge2Enabled && (settings.trustBadge2Title || settings.trustBadge2Desc);
            const badge3Active = settings.trustBadge3Enabled && (settings.trustBadge3Title || settings.trustBadge3Desc);
            const badge4Active = settings.trustBadge4Enabled && (settings.trustBadge4Title || settings.trustBadge4Desc);
            
            const activeCount = [badge1Active, badge2Active, badge3Active, badge4Active].filter(Boolean).length;
            if (activeCount === 0) return null;

            // Responsive grid columns based on number of active badges
            let gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
            let maxContainerClass = "";
            if (activeCount === 1) {
              gridColsClass = "grid-cols-1";
              maxContainerClass = "max-w-md mx-auto";
            } else if (activeCount === 2) {
              gridColsClass = "grid-cols-1 sm:grid-cols-2";
              maxContainerClass = "max-w-2xl mx-auto";
            } else if (activeCount === 3) {
              gridColsClass = "grid-cols-1 sm:grid-cols-3 lg:grid-cols-3";
              maxContainerClass = "max-w-5xl mx-auto";
            }

            return (
              <div className="pt-12 pb-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
                <div className={`grid gap-6 ${gridColsClass} ${maxContainerClass}`}>
                  {/* Card 1 */}
                  {badge1Active && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
                      <div className="flex-shrink-0 p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl">
                        {renderBadgeIcon(settings.trustBadge1Icon || 'Truck')}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {settings.trustBadge1Title || 'Free Delivery'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                          {settings.trustBadge1Desc || 'On all orders above Rs. 2,000'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card 2 */}
                  {badge2Active && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
                      <div className="flex-shrink-0 p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl">
                        {renderBadgeIcon(settings.trustBadge2Icon || 'Shield')}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {settings.trustBadge2Title || 'Secure Payments'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                          {settings.trustBadge2Desc || '100% protected checkout payments'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card 3 */}
                  {badge3Active && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
                      <div className="flex-shrink-0 p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl">
                        {renderBadgeIcon(settings.trustBadge3Icon || 'RefreshCw')}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {settings.trustBadge3Title || 'Easy Exchange'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                          {settings.trustBadge3Desc || 'No questions asked return policy'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card 4 */}
                  {badge4Active && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
                      <div className="flex-shrink-0 p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl">
                        {renderBadgeIcon(settings.trustBadge4Icon || 'Phone')}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {settings.trustBadge4Title || '24/7 Support'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                          {settings.trustBadge4Desc || 'Call/WhatsApp anytime for assistance'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
