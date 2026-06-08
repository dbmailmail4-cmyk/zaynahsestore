'use client';

import React, { useState, useEffect } from 'react';
import { HomepageSection, StoreSettings, Product, Category, Review } from '@/lib/types';
import StoreFront from '@/components/store/StoreFront';

interface PreviewClientProps {
  initialSections: HomepageSection[];
  products: Product[];
  categories: Category[];
  initialSettings: StoreSettings;
  reviews: Review[];
}

export default function PreviewClient({
  initialSections,
  products,
  categories,
  initialSettings,
  reviews
}: PreviewClientProps) {
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'sync') {
        if (event.data.sections) {
          setSections(event.data.sections);
        }
        if (event.data.settings) {
          setSettings(event.data.settings);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    // Notify parent window that preview is loaded and ready
    window.parent.postMessage({ type: 'ready' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <StoreFront
      initialProducts={products}
      categories={categories}
      settings={settings}
      reviews={reviews}
      sections={sections}
    />
  );
}
