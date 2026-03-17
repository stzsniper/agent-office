import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
  noPadding?: boolean;
}

export function Card({ title, icon, children, className, headerRight, noPadding }: CardProps) {
  return (
    <div className={cn('bg-midnight-800/60 border border-midnight-700/40 rounded-xl overflow-hidden', className)}>
      {(title || headerRight) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-midnight-700/30">
          <div className="flex items-center gap-2">
            {icon && <span className="text-neon-green/70">{icon}</span>}
            {title && <h3 className="text-sm font-semibold text-midnight-200 uppercase tracking-wider">{title}</h3>}
          </div>
          {headerRight}
        </div>
      )}
      <div className={cn(!noPadding && 'p-4')}>{children}</div>
    </div>
  );
}
