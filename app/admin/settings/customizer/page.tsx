import React from 'react';
import { getHomepageSections } from '@/lib/services/sections';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { getSettings } from '@/lib/services/settings';
import { getTopReviews } from '@/lib/services/reviews';
import CustomizerEditor from '@/components/admin/CustomizerEditor';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminCustomizerPage() {
  const [sections, products, categories, settings, reviews] = await Promise.all([
    getHomepageSections(false), // Fetch both active and inactive sections for customization
    getProducts(),
    getCategories(),
    getSettings(),
    getTopReviews(8)
  ]);

  return (
    <div className="space-y-6 min-h-screen pb-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Landing Page Section Customizer</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
          Drag-free section editor. Adjust section heights, image overlays, product grids and visibility in real-time.
        </p>
      </div>
      
      <CustomizerEditor
        initialSections={sections}
        products={products}
        categories={categories}
        settings={settings}
        reviews={reviews}
      />
    </div>
  );
}
