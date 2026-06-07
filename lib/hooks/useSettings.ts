import { useState, useEffect } from 'react';
import { StoreSettings } from '@/lib/types';
import { getSettings } from '@/lib/services/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getSettings();
        if (active) {
          setSettings(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSettings();
    return () => { active = false; };
  }, []);

  return { settings, loading, error };
};
