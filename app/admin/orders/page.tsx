import React from 'react';
import OrderLog from '@/components/admin/OrderLog';
import { getOrders } from '@/lib/services/orders';
import { getSettings } from '@/lib/services/settings';

export const revalidate = 0; // Dynamic server rendering

export default async function AdminOrdersPage() {
  const [orders, settings] = await Promise.all([
    getOrders(),
    getSettings()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">WhatsApp Order Log</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Track and update orders clicked by customers on WhatsApp</p>
      </div>
      <OrderLog initialOrders={orders} settings={settings} />
    </div>
  );
}
