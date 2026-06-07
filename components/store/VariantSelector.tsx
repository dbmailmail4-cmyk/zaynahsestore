'use client';

import React from 'react';
import { ProductVariant, StoreSettings } from '@/lib/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onChangeSelectedVariant: (variant: ProductVariant) => void;
  enableSwatches?: boolean;
  settings?: StoreSettings | null;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onChangeSelectedVariant,
  enableSwatches,
  settings
}: VariantSelectorProps) {
  // Extract all unique attributes across variants
  const activeVariants = React.useMemo(() => variants.filter(v => v.active), [variants]);

  const colors = React.useMemo(() => Array.from(new Set(activeVariants.map(v => v.color).filter(Boolean))) as string[], [activeVariants]);
  const sizes = React.useMemo(() => Array.from(new Set(activeVariants.map(v => v.size).filter(Boolean))) as string[], [activeVariants]);
  const materials = React.useMemo(() => Array.from(new Set(activeVariants.map(v => v.material).filter(Boolean))) as string[], [activeVariants]);
  
  // Custom option name (e.g. Flavor) and its values
  const customOptionName = activeVariants[0]?.customOption;
  const customValues = React.useMemo(() => Array.from(new Set(activeVariants.map(v => v.customValue).filter(Boolean))) as string[], [activeVariants]);

  // Keep track of user's current selections
  const [selectedColor, setSelectedColor] = React.useState<string | undefined>(selectedVariant?.color || colors[0]);
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(selectedVariant?.size || sizes[0]);
  const [selectedMaterial, setSelectedMaterial] = React.useState<string | undefined>(selectedVariant?.material || materials[0]);
  const [selectedCustomValue, setSelectedCustomValue] = React.useState<string | undefined>(selectedVariant?.customValue || customValues[0]);

  // Sync state with selectedVariant prop changes
  React.useEffect(() => {
    if (selectedVariant) {
      setSelectedColor(selectedVariant.color || colors[0]);
      setSelectedSize(selectedVariant.size || sizes[0]);
      setSelectedMaterial(selectedVariant.material || materials[0]);
      setSelectedCustomValue(selectedVariant.customValue || customValues[0]);
    }
  }, [selectedVariant, colors, sizes, materials, customValues]);

  // Sync selections with parent on changes (only if it differs from current prop)
  React.useEffect(() => {
    // Attempt to find a variant matching all selected attributes
    const match = activeVariants.find(v => {
      const colorMatch = !colors.length || v.color === selectedColor;
      const sizeMatch = !sizes.length || v.size === selectedSize;
      const materialMatch = !materials.length || v.material === selectedMaterial;
      const customMatch = !customValues.length || v.customValue === selectedCustomValue;
      return colorMatch && sizeMatch && materialMatch && customMatch;
    });

    if (match && (!selectedVariant || match.id !== selectedVariant.id)) {
      onChangeSelectedVariant(match);
    }
  }, [selectedColor, selectedSize, selectedMaterial, selectedCustomValue, activeVariants, colors.length, sizes.length, materials.length, customValues.length, selectedVariant, onChangeSelectedVariant]);

  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Color</span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {colors.map(color => {
              const showSwatches = (enableSwatches !== false) && (settings?.enableVariantSwatches ?? true);
              const matchVar = activeVariants.find(v => v.color === color);
              
              if (showSwatches && matchVar && (matchVar.colorHex || matchVar.imageUrl)) {
                const isSelected = selectedColor === color;
                const productSwatchSize = settings?.productSwatchSize ?? settings?.swatchSize ?? 'md';
                const swatchShape = settings?.swatchShape || 'circle';
                
                const sizeClasses = {
                  sm: 'h-7 w-7',
                  md: 'h-9 w-9',
                  lg: 'h-11 w-11',
                  xl: 'h-12 w-12',
                  xxl: 'h-14 w-14'
                };
                const buttonSizeClasses = {
                  sm: 'w-11 h-11',
                  md: 'w-11 h-11',
                  lg: 'w-11 h-11',
                  xl: 'w-12 h-12',
                  xxl: 'w-14 h-14'
                };
                const shapeClasses = {
                  circle: 'rounded-full',
                  square: 'rounded-lg'
                };
                
                const sizeClass = sizeClasses[productSwatchSize] || sizeClasses.md;
                const buttonSizeClass = buttonSizeClasses[productSwatchSize] || buttonSizeClasses.md;
                const shapeClass = shapeClasses[swatchShape] || shapeClasses.circle;
                const bg = matchVar.colorHex ? matchVar.colorHex : undefined;
                
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      const match = activeVariants.find(v => {
                        const colorMatch = v.color === color;
                        const sizeMatch = !sizes.length || v.size === selectedSize;
                        const materialMatch = !materials.length || v.material === selectedMaterial;
                        const customMatch = !customValues.length || v.customValue === selectedCustomValue;
                        return colorMatch && sizeMatch && materialMatch && customMatch;
                      });
                      if (match) {
                        onChangeSelectedVariant(match);
                      } else {
                        // Fallback: find any variant with this color
                        const fallback = activeVariants.find(v => v.color === color);
                        if (fallback) {
                          if (fallback.size) setSelectedSize(fallback.size);
                          if (fallback.material) setSelectedMaterial(fallback.material);
                          if (fallback.customValue) setSelectedCustomValue(fallback.customValue);
                          onChangeSelectedVariant(fallback);
                        }
                      }
                    }}
                    title={color}
                    className={`relative flex items-center justify-center ${buttonSizeClass} transition-all duration-205 cursor-pointer`}
                  >
                    <span
                      className={`
                        ${sizeClass} ${shapeClass}
                        border-2 transition-all duration-200 overflow-hidden flex items-center justify-center
                        ${isSelected 
                          ? 'border-[#e94560] scale-110 shadow-md ring-2 ring-[#e94560]/30 dark:ring-[#e94560]/50' 
                          : 'border-gray-200 dark:border-gray-800 hover:border-[#1a1a2e] dark:hover:border-white hover:scale-105'
                        }
                      `}
                      style={{
                        backgroundColor: bg,
                        backgroundImage: matchVar.imageUrl && !matchVar.colorHex ? `url(${matchVar.imageUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* If has image, show image preview */}
                      {matchVar.imageUrl && !matchVar.colorHex && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={matchVar.imageUrl}
                          alt={color}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </span>
                  </button>
                );
              }
              
              return (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    const match = activeVariants.find(v => {
                      const colorMatch = v.color === color;
                      const sizeMatch = !sizes.length || v.size === selectedSize;
                      const materialMatch = !materials.length || v.material === selectedMaterial;
                      const customMatch = !customValues.length || v.customValue === selectedCustomValue;
                      return colorMatch && sizeMatch && materialMatch && customMatch;
                    });
                    if (match) {
                      onChangeSelectedVariant(match);
                    } else {
                      // Fallback: find any variant with this color
                      const fallback = activeVariants.find(v => v.color === color);
                      if (fallback) {
                        if (fallback.size) setSelectedSize(fallback.size);
                        if (fallback.material) setSelectedMaterial(fallback.material);
                        if (fallback.customValue) setSelectedCustomValue(fallback.customValue);
                        onChangeSelectedVariant(fallback);
                      }
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                    selectedColor === color
                      ? 'bg-[#1a1a2e] dark:bg-[#e94560] text-white border-[#1a1a2e] dark:border-[#e94560]'
                      : 'bg-white dark:bg-[#16162a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Size</span>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-w-sm sm:max-w-md">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  const match = activeVariants.find(v => {
                    const colorMatch = !colors.length || v.color === selectedColor;
                    const sizeMatch = v.size === size;
                    const materialMatch = !materials.length || v.material === selectedMaterial;
                    const customMatch = !customValues.length || v.customValue === selectedCustomValue;
                    return colorMatch && sizeMatch && materialMatch && customMatch;
                  });
                  if (match) {
                    onChangeSelectedVariant(match);
                  } else {
                    // Fallback: find any variant with this size
                    const fallback = activeVariants.find(v => v.size === size);
                    if (fallback) {
                      if (fallback.color) setSelectedColor(fallback.color);
                      if (fallback.material) setSelectedMaterial(fallback.material);
                      if (fallback.customValue) setSelectedCustomValue(fallback.customValue);
                      onChangeSelectedVariant(fallback);
                    }
                  }
                }}
                className={`py-2.5 px-1 text-center rounded-xl text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                  selectedSize === size
                    ? 'bg-[#1a1a2e] dark:bg-[#e94560] text-white border-[#1a1a2e] dark:border-[#e94560]'
                    : 'bg-white dark:bg-[#16162a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {materials.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Material</span>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-w-sm sm:max-w-md">
            {materials.map(mat => (
              <button
                key={mat}
                onClick={() => {
                  setSelectedMaterial(mat);
                  const match = activeVariants.find(v => {
                    const colorMatch = !colors.length || v.color === selectedColor;
                    const sizeMatch = !sizes.length || v.size === selectedSize;
                    const materialMatch = v.material === mat;
                    const customMatch = !customValues.length || v.customValue === selectedCustomValue;
                    return colorMatch && sizeMatch && materialMatch && customMatch;
                  });
                  if (match) {
                    onChangeSelectedVariant(match);
                  } else {
                    // Fallback: find any variant with this material
                    const fallback = activeVariants.find(v => v.material === mat);
                    if (fallback) {
                      if (fallback.color) setSelectedColor(fallback.color);
                      if (fallback.size) setSelectedSize(fallback.size);
                      if (fallback.customValue) setSelectedCustomValue(fallback.customValue);
                      onChangeSelectedVariant(fallback);
                    }
                  }
                }}
                className={`py-2.5 px-1 text-center rounded-xl text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                  selectedMaterial === mat
                    ? 'bg-[#1a1a2e] dark:bg-[#e94560] text-white border-[#1a1a2e] dark:border-[#e94560]'
                    : 'bg-white dark:bg-[#16162a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>
      )}

      {customOptionName && customValues.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{customOptionName}</span>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-w-sm sm:max-w-md">
            {customValues.map(val => (
              <button
                key={val}
                onClick={() => {
                  setSelectedCustomValue(val);
                  const match = activeVariants.find(v => {
                    const colorMatch = !colors.length || v.color === selectedColor;
                    const sizeMatch = !sizes.length || v.size === selectedSize;
                    const materialMatch = !materials.length || v.material === selectedMaterial;
                    const customMatch = v.customValue === val;
                    return colorMatch && sizeMatch && materialMatch && customMatch;
                  });
                  if (match) {
                    onChangeSelectedVariant(match);
                  } else {
                    // Fallback: find any variant with this custom value
                    const fallback = activeVariants.find(v => v.customValue === val);
                    if (fallback) {
                      if (fallback.color) setSelectedColor(fallback.color);
                      if (fallback.size) setSelectedSize(fallback.size);
                      if (fallback.material) setSelectedMaterial(fallback.material);
                      onChangeSelectedVariant(fallback);
                    }
                  }
                }}
                className={`py-2.5 px-1 text-center rounded-xl text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                  selectedCustomValue === val
                    ? 'bg-[#1a1a2e] dark:bg-[#e94560] text-white border-[#1a1a2e] dark:border-[#e94560]'
                    : 'bg-white dark:bg-[#16162a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
