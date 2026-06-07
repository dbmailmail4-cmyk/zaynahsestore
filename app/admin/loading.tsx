import React from 'react';

export default function AdminLoading() {
  return (
    <div className="space-y-6 p-6 min-h-[80vh] animate-pulse">
      {/* Admin header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-gray-150 dark:bg-gray-800" />
          <div className="h-4 w-64 rounded bg-gray-150 dark:bg-gray-800" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-gray-150 dark:bg-gray-800" />
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#16162a] p-5">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-150 dark:bg-gray-800" />
              <div className="h-7 w-16 rounded bg-gray-150 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Loading Skeleton */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#16162a] overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f1b] p-4 flex gap-4">
          <div className="h-4 w-12 rounded bg-gray-150 dark:bg-gray-800" />
          <div className="h-4 w-1/3 rounded bg-gray-150 dark:bg-gray-800" />
          <div className="h-4 w-1/6 rounded bg-gray-150 dark:bg-gray-800" />
          <div className="h-4 w-1/6 rounded bg-gray-150 dark:bg-gray-800" />
          <div className="h-4 w-12 rounded bg-gray-150 dark:bg-gray-800 ml-auto" />
        </div>
        {/* Table Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gray-150 dark:bg-gray-800 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-2/3 rounded bg-gray-150 dark:bg-gray-800" />
                <div className="h-3.5 w-1/3 rounded bg-gray-150 dark:bg-gray-800" />
              </div>
              <div className="h-4 w-16 rounded bg-gray-150 dark:bg-gray-800 shrink-0" />
              <div className="h-6 w-16 rounded-full bg-gray-150 dark:bg-gray-800 shrink-0" />
              <div className="h-8 w-8 rounded-lg bg-gray-150 dark:bg-gray-800 shrink-0 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
