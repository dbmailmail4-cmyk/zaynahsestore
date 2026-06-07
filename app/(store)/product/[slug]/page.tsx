import React from 'react';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/store/ProductDetail';
import ProductReviews from '@/components/store/ProductReviews';
import ProductCard from '@/components/store/ProductCard';
import { getProductBySlug, getProducts } from '@/lib/services/products';
import { getSettings } from '@/lib/services/settings';
import { getProductReviews, getAverageRating } from '@/lib/services/reviews';
import { Product } from '@/lib/types';

export const revalidate = 0; // Dynamic server rendering

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [settings, reviews, averageRating] = await Promise.all([
    getSettings(),
    getProductReviews(product.id),
    getAverageRating(product.id)
  ]);

  // Fetch related products
  let relatedProducts: Product[] = [];
  if (product.categoryId) {
    const categoryProducts = await getProducts(product.categoryId);
    relatedProducts = categoryProducts.filter(p => p.id !== product.id);
  }
  
  // Fallback to latest products if under 4
  if (relatedProducts.length < 4) {
    const allProducts = await getProducts();
    const extraProducts = allProducts.filter(
      p => p.id !== product.id && !relatedProducts.some(rp => rp.id === p.id)
    );
    relatedProducts = [...relatedProducts, ...extraProducts].slice(0, 4);
  } else {
    relatedProducts = relatedProducts.slice(0, 4);
  }

  return (
    <div className="space-y-10 pb-16">
      <ProductDetail product={product} settings={settings} averageRating={averageRating} />
      
      {settings.enableTicker && settings.tickerText && (
        <div className="w-full overflow-hidden bg-gray-50 dark:bg-white/5 border-y border-gray-200 dark:border-gray-800 py-3.5 select-none relative">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-infinite {
              display: flex;
              width: max-content;
              animation: marquee 30s linear infinite;
            }
            .animate-marquee-infinite:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="animate-marquee-infinite flex items-center whitespace-nowrap gap-8">
            {[...Array(4)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center gap-8">
                {settings.tickerText.split('\n').filter(Boolean).map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-8 text-sm font-bold text-gray-850 dark:text-gray-200 uppercase tracking-wider">
                    <span>{item}</span>
                    <span className="text-gray-400 dark:text-gray-600 font-normal">✦</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductReviews product={product} reviews={reviews} averageRating={averageRating} />
      </div>

      {relatedProducts.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 pt-10">
          <div className="text-center md:text-left mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Related Products</h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
              You might also like these handpicked recommendations
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} currencySymbol={settings.currencySymbol} settings={settings} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
