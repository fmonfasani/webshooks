import React from 'react';

export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center bg-white/60 dark:bg-gray-900/40 backdrop-blur motion-safe:animate-fadeInUp">
      <div className="mx-auto mb-4 h-20 w-20 text-gray-400">{/* Simple illustration */}
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.1" />
          <rect x="50" y="70" width="100" height="60" rx="8" fill="currentColor" opacity="0.15" />
          <path d="M60 80h40M60 95h80M60 110h70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>
      <h3 className="text-sm md:text-base text-gray-600 dark:text-gray-300">{title}</h3>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
