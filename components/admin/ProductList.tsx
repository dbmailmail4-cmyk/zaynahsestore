'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Product, StoreSettings } from '@/lib/types';
import { deleteProduct, updateProduct } from '@/lib/services/products';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils/whatsapp';

interface ProductListProps {
  initialProducts: Product[];
  settings: StoreSettings;
}

export default function ProductList({ initialProducts, settings }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disable/delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active: false } : p));
      toast.success('Product disabled successfully');
    } catch (err) {
      toast.error('Failed to disable product');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const nextActive = !product.active;
      // updateProduct core
      await updateProduct(product.id, { active: nextActive }, product.images, product.variants, product.modifiers);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: nextActive } : p));
      toast.success(`Product ${nextActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error('Failed to update product state');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search & Actions header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1a1a2e]"
          />
        </div>
        <Link
          href="/admin/products/new"
          className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-[#1a1a2e] hover:bg-[#e94560] text-white px-5 py-2.5 text-sm font-bold shadow-sm transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Table listing */}
      <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="text-xs font-bold text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">SKU</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => {
                  const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&auto=format&fit=crop&q=60';
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/20 transition-all">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-850 flex-shrink-0 bg-gray-50 dark:bg-[#0f0f1b]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={primaryImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1a2e] line-clamp-1">{product.name}</p>
                          {product.category && (
                            <span className="text-[10px] font-semibold text-gray-500">{product.category.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-xs text-gray-500">{product.sku || '—'}</td>
                      <td className="py-4 px-6 font-bold">{formatPrice(product.price, settings.currencySymbol)}</td>
                      <td className="py-4 px-6 font-semibold text-xs">
                        {product.hasVariants ? (
                          <span className="text-indigo-600 font-bold">Variants ({product.variants.reduce((sum, v) => sum + v.stock, 0)})</span>
                        ) : (
                          product.stock
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className="flex items-center text-gray-500 hover:text-indigo-650 cursor-pointer"
                        >
                          {product.active ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-105 px-2 py-0.5 rounded-full">
                              Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#1a1a2e] dark:hover:text-white transition-all"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-red-500 hover:bg-red-50/10 transition-all cursor-pointer"
                            title="Disable/Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
