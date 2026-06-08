'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { StoreSettings } from '@/lib/types';
import { formatPrice } from '@/lib/utils/whatsapp';
import { X, Trash2, Plus, Minus, ShoppingBag, Clock, Truck, Tag, Lock, ArrowRight } from '@/components/common/Icons';
import { toast } from 'sonner';
import { validateCouponCode } from '@/lib/services/coupons';

interface CartDrawerProps {
  settings: StoreSettings;
}

export default function CartDrawer({ settings }: CartDrawerProps) {
  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const totalPrice = useCartStore(state => state.totalPrice());
  const totalItems = useCartStore(state => state.totalItems());
  const cartCreatedAt = useCartStore(state => state.cartCreatedAt);
  const isDrawerOpen = useCartStore(state => state.isDrawerOpen);
  const setDrawerOpen = useCartStore(state => state.setDrawerOpen);
  const appliedCoupon = useCartStore(state => state.appliedCoupon);
  const applyCoupon = useCartStore(state => state.applyCoupon);

  const [mounted, setMounted] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Auto-invalidate coupon if subtotal falls below minimum amount
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.minCartAmount && totalPrice < appliedCoupon.minCartAmount) {
      applyCoupon(null);
      toast.error(`Coupon ${appliedCoupon.code} removed (Subtotal fell below Rs. ${appliedCoupon.minCartAmount})`);
    }
  }, [totalPrice, appliedCoupon, applyCoupon]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const coupon = await validateCouponCode(couponCodeInput, totalPrice);
      if (coupon) {
        applyCoupon(coupon);
        setCouponCodeInput('');
        toast.success(`Coupon "${coupon.code}" applied successfully!`);
      } else {
        toast.error('Invalid or expired coupon code');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to validate coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
    toast.success('Coupon removed');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cart Expiration countdown
  useEffect(() => {
    if (!mounted || settings.cart_timer_enabled === false || !cartCreatedAt || items.length === 0) return;

    const timerLimitMinutes = settings.cart_timer_minutes ?? 10;
    const limitMs = timerLimitMinutes * 60 * 1000;

    const updateCountdown = () => {
      const createdTime = new Date(cartCreatedAt).getTime();
      const now = new Date().getTime();
      const elapsed = now - createdTime;
      const remaining = limitMs - elapsed;

      if (remaining <= 0) {
        setIsTimerExpired(true);
        setTimeLeftStr('00:00');
      } else {
        setIsTimerExpired(false);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeLeftStr(
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [mounted, cartCreatedAt, items.length, settings.cart_timer_minutes]);

  // Lock scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!mounted) return null;

  // Free shipping math
  const freeShippingThreshold = settings.free_shipping_threshold ?? 2000;
  const isFreeShipping = settings.free_shipping_bar_enabled !== false && totalPrice >= freeShippingThreshold;
  const amountToFreeShipping = freeShippingThreshold - totalPrice;
  const shippingPercent = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

  // Volume discount math
  const volumeThreshold = settings.volume_discount_threshold ?? 3;
  const volumeDiscountPercent = settings.volume_discount_percentage ?? 10;
  const isVolumeDiscountEligible = settings.volume_discounts_enabled !== false && totalItems >= volumeThreshold;
  const volumeDiscountAmount = isVolumeDiscountEligible 
    ? Math.round((totalPrice * volumeDiscountPercent) / 100)
    : 0;

  // Coupon discount math
  const couponDiscountAmount = (() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((totalPrice * appliedCoupon.value) / 100);
    } else {
      return Math.min(appliedCoupon.value, totalPrice);
    }
  })();

  const grandTotal = Math.max(0, totalPrice - volumeDiscountAmount - couponDiscountAmount);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Sliding Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white dark:bg-[#16162a] border-l border-gray-100 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-in-out overscroll-contain ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#e94560]" />
            <h3 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
              Your Cart ({totalItems})
            </h3>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto overscroll-contain touch-pan-y px-5 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full text-gray-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-gray-700 dark:text-gray-300">Your Cart is Empty</h4>
              <p className="text-xs text-gray-500 max-w-[200px]">Add products to get started and unlock special discounts.</p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="mt-2 px-6 py-2 bg-[#1a1a2e] dark:bg-amber-600 hover:bg-[#e94560] text-white text-xs font-bold rounded-xl transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Expiry & Shipping Progress Group */}
              {(settings.cart_timer_enabled !== false || settings.free_shipping_bar_enabled !== false) && (
                <div className="border-b border-gray-100 dark:border-gray-800 pb-3 space-y-2.5">
                  {/* Cart Expiry Timer Indicator */}
                  {settings.cart_timer_enabled !== false && cartCreatedAt && timeLeftStr && (
                    <div className={`flex items-center gap-1.5 px-1 py-0.5 text-[10px] font-bold ${
                      isTimerExpired
                        ? 'text-rose-500 dark:text-rose-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      <Clock className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
                      <span>
                        {isTimerExpired ? (
                          "Reservation expired! Items may sell out."
                        ) : (
                          settings.cart_timer_message
                            ? settings.cart_timer_message.replace('{timer}', timeLeftStr)
                            : `Items are reserved for ${timeLeftStr} mins.`
                        )}
                      </span>
                    </div>
                  )}

                  {/* Free Shipping Tracker */}
                  {settings.free_shipping_bar_enabled !== false && (
                    <div className="space-y-1 py-0.5 px-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-[#e94560] shrink-0" />
                          {isFreeShipping ? (
                            <span className="text-emerald-500">🎉 FREE SHIPPING!</span>
                          ) : (
                            <span>Add <strong className="text-[#e94560]">{formatPrice(amountToFreeShipping, settings.currencySymbol)}</strong> more for free delivery</span>
                          )}
                        </span>
                        {!isFreeShipping && <span className="text-gray-400 font-bold text-[9px]">{Math.round(shippingPercent)}%</span>}
                      </div>
                      {/* Progress bar line */}
                      <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-[#e94560] rounded-full transition-all duration-500"
                          style={{ width: `${shippingPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800 space-y-4">
                {items.map((item) => {
                  const variantParts = [];
                  if (item.selectedVariant?.color) variantParts.push(item.selectedVariant.color);
                  if (item.selectedVariant?.size) variantParts.push(item.selectedVariant.size);
                  if (item.selectedVariant?.material) variantParts.push(item.selectedVariant.material);
                  if (item.selectedVariant?.customValue) variantParts.push(item.selectedVariant.customValue);
                  const variantStr = variantParts.join(' / ');

                  return (
                    <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 dark:border-gray-800 flex-shrink-0">
                        <Image
                          src={item.selectedVariant?.imageUrl || item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=60'}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized={true}
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-grow min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {item.product.name}
                        </h4>
                        {variantStr && (
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                            {variantStr}
                          </p>
                        )}
                        {item.selectedModifiers.length > 0 && (
                          <p className="text-[9px] text-gray-400 font-semibold italic">
                            + {item.selectedModifiers.map((m) => m.name).join(', ')}
                          </p>
                        )}
                        <p className="text-xs font-black text-gray-900 dark:text-white">
                          {formatPrice(item.unitPrice, settings.currencySymbol)}
                        </p>
                      </div>

                      {/* Quantity & Delete Actions */}
                      <div className="flex flex-col items-end justify-between flex-shrink-0">
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success('Item removed from cart');
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-[#16162a] mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-900 dark:text-white min-w-[20px] text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Billing Details & CTA */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-white/5 space-y-2">
            
            {/* Promo coupon code input */}
            {settings.coupon_codes_enabled !== false && (
              <div className="border-b border-gray-200 dark:border-gray-800 pb-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50/70 dark:bg-emerald-950/10 border border-emerald-100/70 dark:border-emerald-900/20 px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-450 animate-fade-in">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 shrink-0 animate-pulse" />
                      Promo Applied: <strong className="font-extrabold">{appliedCoupon.code}</strong> ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.value}%` : `${formatPrice(appliedCoupon.value, settings.currencySymbol)} Off`})
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="PROMO CODE"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16162a] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#e94560]"
                    />
                    <button
                      type="submit"
                      disabled={validatingCoupon || !couponCodeInput.trim()}
                      className="px-3 py-1 bg-[#1a1a2e] dark:bg-gray-800 hover:bg-[#e94560] dark:hover:bg-[#e94560] text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-400 text-[10px] font-bold rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                    >
                      {validatingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-0.5 text-[11px] text-gray-600 dark:text-gray-300 font-bold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-950 dark:text-white font-extrabold">
                  {formatPrice(totalPrice, settings.currencySymbol)}
                </span>
              </div>

              {/* Volume Discount Alert */}
              {isVolumeDiscountEligible && (
                <div className="flex justify-between text-emerald-500 font-extrabold text-[10px]">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3 animate-pulse" />
                    Volume Discount ({volumeDiscountPercent}%)
                  </span>
                  <span>
                    -{formatPrice(volumeDiscountAmount, settings.currencySymbol)}
                  </span>
                </div>
              )}

              {/* Coupon Discount Item */}
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-500 font-extrabold text-[10px]">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3 animate-pulse" />
                    Promo Discount ({appliedCoupon.code})
                  </span>
                  <span>
                    -{formatPrice(couponDiscountAmount, settings.currencySymbol)}
                  </span>
                </div>
              )}

              {!isVolumeDiscountEligible && settings.volume_discounts_enabled !== false && (
                <div className="text-[8.5px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/5 dark:bg-amber-500/10 px-2 py-0.5 rounded-lg w-full text-center flex items-center justify-center gap-1 mt-0.5 border border-amber-500/10 select-none">
                  <span>💡 Buy {volumeThreshold} items to get {volumeDiscountPercent}% off!</span>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-200 dark:border-gray-800/80 pt-1 text-xs font-black text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-[#e94560] text-sm font-black">
                  {formatPrice(grandTotal, settings.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/cart?step=checkout"
              onClick={() => setDrawerOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] hover:bg-[#e94560] active:scale-98 text-white py-3.5 text-sm font-black transition-all shadow-lg cursor-pointer"
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Secure Checkout</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>

            <p className="text-[8.5px] text-gray-400 dark:text-gray-500 text-center whitespace-nowrap overflow-hidden text-ellipsis block select-none">
              Discounts & free shipping carry over to checkout page
            </p>
          </div>
        )}
      </div>
    </>
  );
}
