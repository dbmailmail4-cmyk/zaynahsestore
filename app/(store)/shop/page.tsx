import React from 'react';
import ShopPage from '@/components/store/ShopPage';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering on request

export default async function StoreShopPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings()
  ]);

  return (
    <ShopPage
      initialProducts={products}
      categories={categories}
      settings={settings}
    />
  );
}
