'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils/whatsapp';

interface CartBarProps {
  currencySymbol?: string;
}

export default function CartBar({ currencySymbol = 'Rs.' }: CartBarProps) {
  const totalItems = useCart(state => state.totalItems());
  const totalPrice = useCart(state => state.totalPrice());

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || totalItems === 0) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 p-4 bg-white/95 dark:bg-[#16162a]/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
      <Link href="/cart" className="flex items-center justify-between rounded-xl bg-[#1a1a2e] hover:bg-[#e94560] active:scale-98 text-white px-5 py-3.5 transition-all duration-200 cursor-pointer">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e94560] text-[8px] font-bold text-white ring-1 ring-[#1a1a2e]">
              {totalItems}
            </span>
          </div>
          <span className="text-sm font-semibold">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold">
            {formatPrice(totalPrice, currencySymbol)}
          </span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </Link>
    </div>
  );
}
