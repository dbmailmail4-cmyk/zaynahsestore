'use client';

import React from 'react';

interface PoliciesTabProps {
  faqContent: string;
  setFaqContent: (val: string) => void;
  returnPolicyContent: string;
  setReturnPolicyContent: (val: string) => void;
}

export default function PoliciesTab({
  faqContent,
  setFaqContent,
  returnPolicyContent,
  setReturnPolicyContent,
}: PoliciesTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Policies & FAQ Content</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Frequently Asked Questions (FAQ) Content</label>
            <textarea
              value={faqContent}
              onChange={(e) => setFaqContent(e.target.value)}
              rows={12}
              placeholder="<h3>Q: What is the delivery time?</h3><p>A: 3-5 working days.</p>"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all font-mono"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">Supports HTML syntax. Displayed on the product detail page tabs.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Return & Exchange Policy Content</label>
            <textarea
              value={returnPolicyContent}
              onChange={(e) => setReturnPolicyContent(e.target.value)}
              rows={12}
              placeholder="<h3>Return Policy</h3><p>We offer 30 days free returns and exchanges.</p>"
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 px-4 py-2.5 text-sm font-medium text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#1a1a2e] dark:focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all font-mono"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">Supports HTML syntax. Displayed on the product detail page tabs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
