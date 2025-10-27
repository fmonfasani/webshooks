import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={[ 'rounded-lg border border-gray-200 bg-white shadow-sm', className ].join(' ')}>{children}</div>;
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={[ 'px-4 py-3 border-b border-gray-200', className ].join(' ')}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={[ 'text-base font-semibold', className ].join(' ')}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={[ 'px-4 py-3', className ].join(' ')}>{children}</div>;
}

