'use client';

import React from 'react';
import { Edit2, Trash2, Upload, Loader2, Plus, Check } from 'lucide-react';
import { Ruler } from '@/components/common/Icons';
import { SizeGuide } from '@/lib/types';

interface SizeGuidesTabProps {
  sizeGuides: SizeGuide[];
  selectedGuide: SizeGuide | null;
  guideName: string;
  setGuideName: (v: string) => void;
  guideImageUrl: string;
  setGuideImageUrl: (v: string) => void;
  guideColumns: string;
  setGuideColumns: (v: string) => void;
  guideRows: Array<Record<string, string>>;
  setGuideRows: React.Dispatch<React.SetStateAction<Array<Record<string, string>>>>;
  isUploadingGuideImage: boolean;
  isEditingGuide: boolean;

  startEditSizeGuide: (guide: SizeGuide) => void;
  handleDeleteSizeGuide: (id: string) => void;
  handleSaveSizeGuide: (e: React.FormEvent) => void;
  resetSizeGuideForm: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'banner' | 'exit_intent' | 'size_chart') => void;
  handleRemoveImage: (type: 'logo' | 'favicon' | 'banner' | 'exit_intent' | 'size_chart') => void;
}

export default function SizeGuidesTab({
  sizeGuides,
  selectedGuide,
  guideName,
  setGuideName,
  guideImageUrl,
  setGuideImageUrl,
  guideColumns,
  setGuideColumns,
  guideRows,
  setGuideRows,
  isUploadingGuideImage,
  isEditingGuide,
  startEditSizeGuide,
  handleDeleteSizeGuide,
  handleSaveSizeGuide,
  resetSizeGuideForm,
  handleFileUpload,
  handleRemoveImage
}: SizeGuidesTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* List of existing presets */}
      <div className="bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm col-span-1 lg:col-span-5 space-y-6">
        <div>
          <h3 className="text-sm font-extrabold text-[#e94560] uppercase tracking-wider">Size Guide Presets</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage reusable size charts linked to products.</p>
        </div>

        <div className="space-y-4">
          {sizeGuides.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-850 rounded-xl">
              <Ruler className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-700" />
              <p className="text-xs italic text-gray-400 mt-2">No size guide presets created yet.</p>
            </div>
          ) : (
            sizeGuides.map((guide) => (
              <div
                key={guide.id}
                className={`p-4 rounded-xl border transition-all ${
                  selectedGuide?.id === guide.id
                    ? 'border-[#e94560] bg-gray-50/50 dark:bg-white/5 shadow-sm'
                    : 'border-gray-105 dark:border-gray-800 bg-white dark:bg-[#0f0f1b]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{guide.name}</h4>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">
                      {guide.chart_data.length} rows • {guide.chart_data[0] ? Object.keys(guide.chart_data[0]).length : 0} columns
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEditSizeGuide(guide)}
                      className="p-1.5 text-gray-400 hover:text-gray-750 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Edit Preset"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSizeGuide(guide.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Delete Preset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {guide.imageUrl && (
                  <div className="mt-3 relative w-full h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={guide.imageUrl}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preset Form Builder */}
      <div className="bg-white dark:bg-[#16162a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm col-span-1 lg:col-span-7 space-y-6">
        <div>
          <h3 className="text-sm font-extrabold text-[#e94560] uppercase tracking-wider">
            {isEditingGuide ? 'Edit Size Guide Preset' : 'Create Size Guide Preset'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Build table columns/rows and link an optional measurement image.
          </p>
        </div>

        <div className="space-y-4">
          {/* Preset Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preset Name</label>
            <input
              type="text"
              placeholder="e.g. Women's Kurtas Sizing"
              value={guideName}
              onChange={(e) => setGuideName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-2.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] transition-colors"
            />
          </div>

          {/* Chart Image Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chart Image (Optional)</label>
            
            {guideImageUrl ? (
              <div className="relative rounded-xl border border-gray-100 dark:border-gray-800 p-2 bg-gray-50 dark:bg-[#0f0f1b] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={guideImageUrl}
                      alt="Preset guide"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Image uploaded</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage('size_chart')}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/25 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors cursor-pointer select-none">
                {isUploadingGuideImage ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-6 w-6 text-[#e94560] animate-spin" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">Uploading & Compressing...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2">Click to Upload Image</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Supports PNG, JPG, WEBP, HEIC (Auto-optimized)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'size_chart')}
                  disabled={isUploadingGuideImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Table Columns Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-between items-center">
              <span>Table Columns (Comma-separated)</span>
              <span className="text-[10px] text-gray-400 lowercase font-semibold">Press comma to add a column</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Size, Chest, Length, Sleeve"
              value={guideColumns}
              onChange={(e) => {
                const val = e.target.value;
                setGuideColumns(val);
                // Dynamically fill row objects with missing keys to avoid undefined crashes
                const cols = val.split(',').map(s => s.trim()).filter(Boolean);
                setGuideRows(prev => prev.map(row => {
                  const updated = { ...row };
                  cols.forEach(col => {
                    if (updated[col] === undefined) updated[col] = '';
                  });
                  return updated;
                }));
              }}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-3 py-2.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#e94560] transition-colors"
            />
          </div>

          {/* Interactive Sizing Table Builder */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Sizing Rows Data</label>

            {/* Sizing Table Grid */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-[#0f0f1b]">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[300px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800">
                      {guideColumns.split(',').map(s => s.trim()).filter(Boolean).map((colName, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {colName}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-16">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {guideRows.map((row, rowIndex) => {
                      const activeCols = guideColumns.split(',').map(s => s.trim()).filter(Boolean);
                      return (
                        <tr key={rowIndex} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/30">
                          {activeCols.map((colName, colIndex) => (
                            <td key={colIndex} className="px-2 py-2">
                              <input
                                type="text"
                                value={row[colName] || ''}
                                onChange={(e) => {
                                  const updatedRows = [...guideRows];
                                  updatedRows[rowIndex] = {
                                    ...updatedRows[rowIndex],
                                    [colName]: e.target.value
                                  };
                                  setGuideRows(updatedRows);
                                }}
                                placeholder="-"
                                className="w-full min-h-[38px] px-2 py-1.5 text-xs border border-transparent hover:border-gray-200 focus:border-[#e94560] dark:focus:border-[#e94560] bg-transparent rounded-lg font-semibold focus:outline-none transition-colors"
                              />
                            </td>
                          ))}
                          <td className="px-4 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setGuideRows(prev => prev.filter((_, idx) => idx !== rowIndex));
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete Row"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {guideRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={guideColumns.split(',').map(s => s.trim()).filter(Boolean).length + 1}
                          className="text-center py-6 text-xs italic text-gray-400"
                        >
                          No sizing rows added. Click below to add your first row!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Row Action */}
              <div className="p-3 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    const activeCols = guideColumns.split(',').map(s => s.trim()).filter(Boolean);
                    const newRow: Record<string, string> = {};
                    activeCols.forEach(col => {
                      newRow[col] = '';
                    });
                    setGuideRows(prev => [...prev, newRow]);
                  }}
                  className="flex items-center gap-1.5 text-[#e94560] hover:text-[#e94560]/90 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Sizing Row</span>
                </button>
              </div>
            </div>
          </div>

          {/* Save / Reset Form actions */}
          <div className="flex justify-end gap-3 pt-3">
            {isEditingGuide && (
              <button
                type="button"
                onClick={resetSizeGuideForm}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveSizeGuide}
              className="flex items-center justify-center gap-1.5 bg-[#1a1a2e] dark:bg-[#e94560] hover:bg-[#e94560] active:scale-95 text-white py-2.5 px-6 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              {isEditingGuide ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{isEditingGuide ? 'Update Preset' : 'Create Preset'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
