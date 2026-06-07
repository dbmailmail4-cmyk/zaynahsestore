'use client';

import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { Order, StoreSettings } from '@/lib/types';
import { updateOrderStatus } from '@/lib/services/orders';
import { formatPrice } from '@/lib/utils/whatsapp';
import { toast } from 'sonner';

interface OrderLogProps {
  initialOrders: Order[];
  settings: StoreSettings;
}

export default function OrderLog({ initialOrders, settings }: OrderLogProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleStatusChange = async (id: string, status: Order['status']) => {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      toast.success(`Order ${updated.orderNumber} status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = 
      (o.orderNumber && o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by order no, customer or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1a1a2e]"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#1a1a2e] cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No orders logged in database matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="text-xs font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-850">
                <tr>
                  <th className="py-4 px-6">Order No.</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Items Purchased</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Notes</th>
                  <th className="py-4 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/20 dark:hover:bg-white/3 transition-all align-top">
                    <td className="py-4 px-6 font-bold text-[#1a1a2e] dark:text-white">{order.orderNumber}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-[#1a1a2e] dark:text-white">{order.customerName || 'N/A'}</p>
                      <a 
                        href={`https://wa.me/${order.customerPhone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#10b981] hover:underline font-semibold flex items-center gap-1 mt-0.5"
                      >
                        <span>{order.customerPhone || 'N/A'}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => {
                          const variantParts = [];
                          if (item.selectedVariant?.color) variantParts.push(item.selectedVariant.color);
                          if (item.selectedVariant?.size) variantParts.push(item.selectedVariant.size);
                          const variantStr = variantParts.length ? ` (${variantParts.join(', ')})` : '';
                          return (
                            <div key={idx} className="text-xs font-semibold text-gray-600 line-clamp-1">
                              • {item.product.name}{variantStr} x{item.quantity}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-[#1a1a2e] dark:text-white">{formatPrice(order.total, settings.currencySymbol)}</td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className={`rounded-lg border px-2 py-1 text-xs font-bold uppercase focus:outline-none cursor-pointer ${
                          order.status === 'delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                          order.status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-600' :
                          order.status === 'cancelled' ? 'border-red-200 bg-red-50 text-red-600' :
                          'border-blue-200 bg-blue-50 text-blue-600'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 max-w-xs text-xs font-semibold text-gray-500 dark:text-gray-400 line-clamp-2">{order.notes || '—'}</td>
                    <td className="py-4 px-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}<br />
                      <span className="text-gray-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
