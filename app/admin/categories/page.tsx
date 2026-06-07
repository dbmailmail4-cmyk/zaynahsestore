import React from 'react';
import CategoryManager from '@/components/admin/CategoryManager';
import { getAllCategories } from '@/lib/services/categories';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manage Categories</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Organize products into categories for easy filtering</p>
      </div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
