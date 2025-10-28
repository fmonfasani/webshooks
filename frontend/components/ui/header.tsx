import React from 'react';

export function HeroHeader({ title, subtitle, email }: { title: string; subtitle?: string; email?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6 shadow-sm motion-safe:animate-fadeInDown">
      <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />
      <div className="relative flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{(email?.[0] || 'U').toUpperCase()}</span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
