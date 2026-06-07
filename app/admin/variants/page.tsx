'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Save, Tag, Palette, Ruler, Package, Check, ChevronDown } from 'lucide-react';
import { VariantPreset, VariantPresetValue } from '@/lib/types';
import { getVariantPresets, createVariantPreset, deleteVariantPreset } from '@/lib/services/variantPresets';
import { toast } from 'sonner';

const BUILT_IN_PRESETS: Omit<VariantPreset, 'id' | 'createdAt'>[] = [
  { name: 'Kids Sizes (Years)', attribute: 'size', values: ['1-2y','2-3y','3-4y','4-5y','5-6y','6-7y','7-8y','8-9y','9-10y','10-11y','11-12y'].map(l => ({ label: l })) },
  { name: 'Kids Sizes (Number)', attribute: 'size', values: ['22','24','26','28','30','32','34','36','38','40'].map(l => ({ label: l })) },
  { name: 'Adult Clothing Sizes', attribute: 'size', values: ['XS','S','M','L','XL','XXL','3XL'].map(l => ({ label: l })) },
  { name: 'Shoe Sizes (UK)', attribute: 'size', values: ['4','5','6','7','8','9','10','11','12'].map(l => ({ label: l })) },
  { name: 'Standard Colors', attribute: 'color', values: [
    { label: 'Black', hex: '#000000' }, { label: 'White', hex: '#ffffff' }, { label: 'Red', hex: '#e94560' },
    { label: 'Navy Blue', hex: '#1a1a2e' }, { label: 'Grey', hex: '#9ca3af' }, { label: 'Green', hex: '#10b981' }
  ]},
  { name: 'Denim Colors', attribute: 'color', values: [
    { label: 'Light Blue', hex: '#93c5fd' }, { label: 'Dark Blue', hex: '#1e3a8a' }, { label: 'Black', hex: '#000000' },
    { label: 'Grey', hex: '#6b7280' }, { label: 'White', hex: '#f9fafb' }
  ]},
  { name: 'Material Types', attribute: 'material', values: ['Cotton','Polyester','Wool','Silk','Denim','Linen'].map(l => ({ label: l })) },
];

const standardColorMap: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#e94560',
  blue: '#1a1a2e',
  navy: '#1a1a2e',
  grey: '#9ca3af',
  gray: '#9ca3af',
  green: '#10b981',
  yellow: '#f59e0b',
  orange: '#f97316',
  purple: '#a855f7',
  pink: '#ec4899',
  beige: '#f5f5dc',
  brown: '#a52a2a',
  gold: '#ffd700',
  silver: '#c0c0c0',
  cream: '#fffdd0'
};

const ATTR_ICONS = { color: Palette, size: Ruler, material: Package, custom: Tag };
const ATTR_LABELS = { color: 'Color', size: 'Size', material: 'Material', custom: 'Custom' };

export default function VariantPresetsPage() {
  const [presets, setPresets] = useState<VariantPreset[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [newName, setNewName] = useState('');
  const [newAttr, setNewAttr] = useState<VariantPreset['attribute']>('size');
  const [newInput, setNewInput] = useState('');
  const [newValues, setNewValues] = useState<VariantPresetValue[]>([]);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getVariantPresets();
      setPresets(data);
    } catch {
      toast.error('Failed to load presets');
    } finally {
      setLoading(false);
    }
  };

  const addValue = () => {
    const raw = newInput.trim().replace(/,$/, '');
    if (!raw) return;
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
    parts.forEach(label => {
      if (!newValues.find(v => v.label === label)) {
        const lowerLabel = label.toLowerCase();
        const hex = newAttr === 'color' ? (standardColorMap[lowerLabel] || '#888888') : undefined;
        setNewValues(prev => [...prev, { label, hex }]);
      }
    });
    setNewInput('');
  };

  const handleSave = async () => {
    if (!newName.trim()) return toast.error('Preset name required');
    if (newValues.length === 0) return toast.error('Add at least one value');
    try {
      setSaving(true);
      const created = await createVariantPreset({ name: newName.trim(), attribute: newAttr, values: newValues });
      setPresets(prev => [...prev, created]);
      setNewName('');
      setNewValues([]);
      setNewInput('');
      toast.success('Preset saved!');
    } catch {
      toast.error('Failed to save preset');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this preset?')) return;
    try {
      await deleteVariantPreset(id);
      setPresets(prev => prev.filter(p => p.id !== id));
      toast.success('Preset deleted');
    } catch {
      toast.error('Failed to delete preset');
    }
  };

  const handleImportBuiltIn = async (preset: Omit<VariantPreset, 'id' | 'createdAt'>) => {
    const exists = presets.find(p => p.name === preset.name);
    if (exists) return toast.error('Preset already exists');
    try {
      const created = await createVariantPreset(preset);
      setPresets(prev => [...prev, created]);
      toast.success(`Imported: ${preset.name}`);
    } catch {
      toast.error('Failed to import preset');
    }
  };

  const AttrIcon = ATTR_ICONS[newAttr];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Variant Presets</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Save reusable variant sets (sizes, colors, materials) and instantly import them when creating products.
        </p>
      </div>

      {/* Built-in presets to import */}
      <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
          Built-in Presets — Click to Import
        </h2>
        <div className="flex flex-wrap gap-2">
          {BUILT_IN_PRESETS.map((preset, i) => {
            const already = presets.find(p => p.name === preset.name);
            const Icon = ATTR_ICONS[preset.attribute];
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleImportBuiltIn(preset)}
                disabled={!!already}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  already
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#e94560] hover:text-[#e94560]'
                }`}
              >
                {already ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Custom Preset */}
      <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Create Custom Preset</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preset Name</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. My Shop Sizes"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Attribute Type</label>
            <select
              value={newAttr}
              onChange={e => {
                setNewAttr(e.target.value as VariantPreset['attribute']);
                setNewValues([]);
              }}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560]"
            >
              {(['color','size','material','custom'] as const).map(a => (
                <option key={a} value={a}>{ATTR_LABELS[a]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Values</label>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
            {newValues.map((v, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm">
                {newAttr === 'color' && (
                  <input
                    type="color"
                    value={v.hex || '#888888'}
                    onChange={(e) => {
                      setNewValues(prev => prev.map((item, idx) => 
                        idx === i ? { ...item, hex: e.target.value } : item
                      ));
                    }}
                    className="h-5 w-5 rounded cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
                    title="Select color"
                  />
                )}
                <span>{v.label}</span>
                <button type="button" onClick={() => setNewValues(prev => prev.filter((_, j) => j !== i))} className="ml-1.5 text-gray-400 hover:text-red-500 font-bold cursor-pointer">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type value(s), press Enter or comma to add"
              value={newInput}
              onChange={e => setNewInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addValue();
                }
              }}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1b] px-4 py-2.5 text-sm focus:outline-none focus:border-[#e94560]"
            />
            <button
              type="button"
              onClick={addValue}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-[#1a1a2e] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e94560] text-white text-sm font-bold hover:bg-[#d8344e] transition-colors cursor-pointer disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save Preset'}
        </button>
      </div>

      {/* Saved Presets */}
      <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Saved Presets ({presets.length})
        </h2>
        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : presets.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No presets yet. Import or create one above.</p>
        ) : (
          <div className="space-y-2">
            {presets.map(preset => {
              const Icon = ATTR_ICONS[preset.attribute] || Tag;
              const isExpanded = expandedId === preset.id;
              return (
                <div key={preset.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                  <div
                    className="flex items-center gap-3 p-3.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0f0f1b] transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : preset.id)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a2e] dark:bg-[#e94560] flex-shrink-0">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{preset.name}</p>
                      <p className="text-xs text-gray-400">{ATTR_LABELS[preset.attribute]} · {preset.values.length} values</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); handleDelete(preset.id); }}
                        className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b]">
                      <div className="flex flex-wrap gap-1.5">
                        {preset.values.map((v, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16162a] text-xs font-semibold text-gray-800 dark:text-gray-200"
                          >
                            {preset.attribute === 'color' && v.hex && (
                              <span className="h-3 w-3 rounded-full border border-gray-200 flex-shrink-0" style={{ background: v.hex }} />
                            )}
                            {v.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
