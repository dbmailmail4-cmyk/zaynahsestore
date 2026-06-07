import React from 'react';
import StoreFront from '@/components/store/StoreFront';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { getSettings } from '@/lib/services/settings';
import { getTopReviews } from '@/lib/services/reviews';

export const revalidate = 0; // Dynamic server rendering

export default async function CatalogPage() {
  const [products, categories, settings, reviews] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
    getTopReviews(8)
  ]);

  return (
    <StoreFront
      initialProducts={products}
      categories={categories}
      settings={settings}
      reviews={reviews}
    />
  );
}
