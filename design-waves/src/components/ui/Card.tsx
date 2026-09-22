import type { ReactNode } from 'react';

export default function Card({ children, className = '', hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`dw-glass dw-glow-border p-5 ${hover ? 'dw-card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
}
