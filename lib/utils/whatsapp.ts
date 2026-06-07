import { CartItem, StoreSettings } from '@/lib/types';

export const formatPrice = (amount: number, symbol = 'Rs.'): string =>
  `${symbol} ${amount.toLocaleString('en-PK')}`;

export const generateWhatsAppMessage = (
  items: CartItem[],
  settings: StoreSettings
): string => {
  const lines = items.map(item => {
    const variantParts = [];
    if (item.selectedVariant?.color) variantParts.push(item.selectedVariant.color);
    if (item.selectedVariant?.size) variantParts.push(item.selectedVariant.size);
    if (item.selectedVariant?.material) variantParts.push(item.selectedVariant.material);
    if (item.selectedVariant?.customValue) variantParts.push(item.selectedVariant.customValue);

    const variantStr = variantParts.length ? ` (${variantParts.join(', ')})` : '';
    const modifierStr = item.selectedModifiers.length
      ? ` + ${item.selectedModifiers.map(m => m.name).join(', ')}`
      : '';

    return `• ${item.product.name}${variantStr}${modifierStr} x${item.quantity} = ${formatPrice(item.total, settings.currencySymbol)}`;
  });

  const total = items.reduce((sum, i) => sum + i.total, 0);

  return [
    `*${settings.storeName}*`,
    ``,
    settings.whatsappGreeting,
    ``,
    ...lines,
    ``,
    `*Total: ${formatPrice(total, settings.currencySymbol)}*`,
    ``,
    settings.whatsappFooter
  ].join('\n');
};

export const buildWhatsAppURL = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
