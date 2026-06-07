import React from 'react';

export function CardSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#16162a] p-3 shadow-sm">
      <div className="aspect-square w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-10 w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="w-full animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Left side: Images */}
      <div className="space-y-4">
        <div className="aspect-square w-full rounded-3xl bg-gray-100 dark:bg-gray-800" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
      {/* Right side: Details */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-10 w-11/12 rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-6 w-32 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <hr className="border-gray-100 dark:border-gray-850" />
        <div className="space-y-4">
          <div className="h-4 w-28 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="flex gap-2">
            <div className="h-9 w-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
            <div className="h-9 w-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
            <div className="h-9 w-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-28 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="flex gap-2">
            <div className="h-9 w-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
            <div className="h-9 w-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
        <div className="h-12 w-full rounded-2xl bg-gray-100 dark:bg-gray-800" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-4 w-4/5 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
