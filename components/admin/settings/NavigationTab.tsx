'use client';

import React from 'react';
import { 
  Plus, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Edit2, Trash2, X 
} from '@/components/common/Icons';
import { Category, Product, NavigationItem } from '@/lib/types';

interface NavigationTabProps {
  headerDesktopMenuAlign: 'left' | 'center' | 'right' | 'hidden';
  setHeaderDesktopMenuAlign: (val: 'left' | 'center' | 'right' | 'hidden') => void;
  navigationMenu: NavigationItem[];
  openAddMenuModal: () => void;
  moveMenuItemUp: (pIndex: number, childId: string | null, cIndex: number | null) => void;
  moveMenuItemDown: (pIndex: number, childId: string | null, cIndex: number | null) => void;
  indentMenuItem: (pIndex: number) => void;
  outdentMenuItem: (pIndex: number, cIndex: number) => void;
  openEditMenuModal: (item: NavigationItem, pIndex: number, childId: string | null, cIndex: number | null) => void;
  deleteMenuItem: (pIndex: number, childId: string | null, cIndex: number | null) => void;
  
  isMenuModalOpen: boolean;
  setIsMenuModalOpen: (val: boolean) => void;
  menuItemLabel: string;
  setMenuItemLabel: (val: string) => void;
  menuItemLinkType: 'custom' | 'category' | 'product' | 'system';
  setMenuItemLinkType: (val: 'custom' | 'category' | 'product' | 'system') => void;
  menuItemUrl: string;
  setMenuItemUrl: (val: string) => void;
  menuItemCategoryId: string;
  setMenuItemCategoryId: (val: string) => void;
  menuItemProductId: string;
  setMenuItemProductId: (val: string) => void;
  menuItemSystemPage: 'home' | 'shop' | 'cart' | 'wishlist';
  setMenuItemSystemPage: (val: 'home' | 'shop' | 'cart' | 'wishlist') => void;
  
  categoriesList: Category[];
  productsList: Product[];
  handleSaveMenuItem: () => void;
  editingMenuItemState: any;
}

export default function NavigationTab({
  headerDesktopMenuAlign,
  setHeaderDesktopMenuAlign,
  navigationMenu,
  openAddMenuModal,
  moveMenuItemUp,
  moveMenuItemDown,
  indentMenuItem,
  outdentMenuItem,
  openEditMenuModal,
  deleteMenuItem,
  isMenuModalOpen,
  setIsMenuModalOpen,
  menuItemLabel,
  setMenuItemLabel,
  menuItemLinkType,
  setMenuItemLinkType,
  menuItemUrl,
  setMenuItemUrl,
  menuItemCategoryId,
  setMenuItemCategoryId,
  menuItemProductId,
  setMenuItemProductId,
  menuItemSystemPage,
  setMenuItemSystemPage,
  categoriesList,
  productsList,
  handleSaveMenuItem,
  editingMenuItemState,
}: NavigationTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Store Navigation Menu Customizer</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Build nested menus, sort items up/down, and link directly to categories, products, or custom URLs.</p>
          </div>
          <button
            type="button"
            onClick={openAddMenuModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e94560] text-white hover:bg-[#d83a52] transition-colors text-xs font-bold shrink-0 self-start sm:self-center cursor-pointer active:scale-95 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Menu Item</span>
          </button>
        </div>

        <div className="max-w-xs">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Desktop Menu Alignment</label>
          <select
            value={headerDesktopMenuAlign}
            onChange={(e) => setHeaderDesktopMenuAlign(e.target.value as any)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
          >
            <option value="left">Left Aligned</option>
            <option value="center">Center Aligned (Default)</option>
            <option value="right">Right Aligned</option>
            <option value="hidden">Hidden / No Desktop Menu</option>
          </select>
        </div>

        <div className="space-y-3">
          {navigationMenu.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-[#0f0f1b]/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              No custom menu items. Add items to build your menu.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/5 dark:bg-white/1">
              {navigationMenu.map((parent, pIndex) => {
                const hasChildren = parent.children && parent.children.length > 0;
                
                return (
                  <React.Fragment key={parent.id}>
                    {/* Parent Row */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#16162a] hover:bg-gray-50 dark:hover:bg-white/1 transition-colors gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{parent.label}</span>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate max-w-md">{parent.url}</div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={pIndex === 0}
                          onClick={() => moveMenuItemUp(pIndex, null, null)}
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={pIndex === navigationMenu.length - 1}
                          onClick={() => moveMenuItemDown(pIndex, null, null)}
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={pIndex === 0 || hasChildren}
                          onClick={() => indentMenuItem(pIndex)}
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-555 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                          title="Indent (Make Submenu)"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditMenuModal(parent, pIndex, null, null)}
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-amber-500 hover:border-amber-500 dark:hover:bg-amber-500 dark:hover:border-amber-500 text-amber-500 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMenuItem(pIndex, null, null)}
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-red-500 hover:border-red-500 dark:hover:bg-red-500 dark:hover:bg-red-500 text-red-500 hover:text-white transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Children Rows */}
                    {parent.children?.map((child, cIndex) => (
                      <div key={child.id} className="flex items-center justify-between p-4 pl-12 bg-gray-50/50 dark:bg-white/1 hover:bg-gray-50 dark:hover:bg-white/2 border-t border-gray-100 dark:border-gray-800/50 transition-colors gap-4">
                        <div className="flex-1 min-w-0 relative">
                          {/* Indent Guide Line */}
                          <div className="absolute left-[-20px] top-[-16px] bottom-1/2 w-[12px] border-l-2 border-b-2 border-gray-200 dark:border-gray-850 rounded-bl-lg" />
                          <div className="text-xs font-bold text-gray-800 dark:text-gray-300 flex items-center gap-1.5">
                            <span className="bg-gray-200/50 dark:bg-white/5 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider text-gray-550 font-semibold">Submenu</span>
                            <span>{child.label}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate max-w-md">{child.url}</div>
                        </div>

                        {/* Action Buttons for Child */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={cIndex === 0}
                            onClick={() => moveMenuItemUp(pIndex, child.id, cIndex)}
                            className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={cIndex === parent.children!.length - 1}
                            onClick={() => moveMenuItemDown(pIndex, child.id, cIndex)}
                            className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => outdentMenuItem(pIndex, cIndex)}
                            className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-550 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors cursor-pointer"
                            title="Outdent (Make Parent)"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditMenuModal(child, pIndex, child.id, cIndex)}
                            className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-amber-500 hover:border-amber-500 dark:hover:bg-amber-500 dark:hover:border-amber-500 text-amber-500 hover:text-white transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMenuItem(pIndex, child.id, cIndex)}
                            className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-red-500 hover:border-red-500 dark:hover:bg-red-500 dark:hover:bg-red-500 text-red-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Menu Item Form Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16162a] w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 relative scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-gray-150 dark:border-gray-800 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                {editingMenuItemState ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="text-gray-400 hover:text-gray-550 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Menu Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Track Suits"
                  value={menuItemLabel}
                  onChange={(e) => setMenuItemLabel(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Link Destination Type</label>
                <select
                  value={menuItemLinkType}
                  onChange={(e) => setMenuItemLinkType(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                >
                  <option value="custom">Custom URL Address</option>
                  <option value="category">Link to a Category</option>
                  <option value="product">Link to a Product</option>
                  <option value="system">Standard System Page</option>
                </select>
              </div>

              {menuItemLinkType === 'custom' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">URL / Link Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /custom-page or https://..."
                    value={menuItemUrl}
                    onChange={(e) => setMenuItemUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-950 dark:text-white"
                  />
                </div>
              )}

              {menuItemLinkType === 'category' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Select Category *</label>
                  <select
                    value={menuItemCategoryId}
                    onChange={(e) => setMenuItemCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                  >
                    <option value="">-- Choose Category --</option>
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {menuItemLinkType === 'product' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Select Product *</label>
                  <select
                    value={menuItemProductId}
                    onChange={(e) => setMenuItemProductId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                  >
                    <option value="">-- Choose Product --</option>
                    {productsList.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {menuItemLinkType === 'system' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Select Page *</label>
                  <select
                    value={menuItemSystemPage}
                    onChange={(e) => setMenuItemSystemPage(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560] text-gray-900 dark:text-white"
                  >
                    <option value="home">Home Page (Catalog Storefront)</option>
                    <option value="shop">Shop Page (All Products & Filters)</option>
                    <option value="cart">Cart Page</option>
                    <option value="wishlist">Wishlist Page</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMenuItem}
                  className="px-4 py-2 rounded-xl bg-[#e94560] text-white text-xs font-bold hover:bg-[#d83a52] transition-all cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
