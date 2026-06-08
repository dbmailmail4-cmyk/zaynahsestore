'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Order, CartItem } from '@/lib/types';
import { getCustomerSession } from '@/lib/utils/customer-auth';

interface OrderRow {
  id: string;
  order_number: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  items?: unknown;
  subtotal?: string | number | null;
  total?: string | number | null;
  status: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

const mapOrder = (row: OrderRow): Order => ({
  id: row.id,
  orderNumber: row.order_number,
  customerName: row.customer_name || undefined,
  customerPhone: row.customer_phone || undefined,
  items: (row.items || []) as CartItem[],
  subtotal: row.subtotal ? parseFloat(row.subtotal.toString()) : 0,
  total: row.total ? parseFloat(row.total.toString()) : 0,
  status: row.status as Order['status'],
  notes: row.notes || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const createOrder = async (order: {
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  notes?: string;
}): Promise<Order> => {
  try {
    const supabase = await createClient();
    const session = await getCustomerSession();
    let customerId = session ? session.id : null;

    // Auto-create/lookup guest customer record if phone is provided and they aren't logged in
    if (!customerId && order.customerPhone) {
      try {
        const cleanPhone = order.customerPhone.replace(/\D/g, '');
        if (cleanPhone.length >= 7) {
          // Query customers to see if a customer with this phone exists
          const { data: existingCustomer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('phone', order.customerPhone)
            .maybeSingle();

          if (existingCustomer) {
            customerId = existingCustomer.id;
          } else {
            // Auto-create guest account record
            const { data: newCustomer } = await supabaseAdmin
              .from('customers')
              .insert({
                name: order.customerName || 'Guest Customer',
                phone: order.customerPhone,
                email: null,
                password_hash: null
              })
              .select('id')
              .single();

            if (newCustomer) {
              customerId = newCustomer.id;
            }
          }
        }
      } catch (err) {
        console.error('Failed to auto-create guest customer:', err);
      }
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_id: customerId,
        items: order.items,
        subtotal: order.subtotal,
        total: order.total,
        notes: order.notes,
        status: 'pending'
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapOrder(data);
  } catch (error) {
    console.error('[orders] createOrder failed:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapOrder);
  } catch (error) {
    console.error('[orders] getOrders failed:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return mapOrder(data);
  } catch (error) {
    console.error('[orders] updateOrderStatus failed:', error);
    throw error;
  }
};
