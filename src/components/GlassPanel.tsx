import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassPanelProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}

export default function GlassPanel({ title, icon, children, className, headerRight }: GlassPanelProps) {
  return (
    <div className={cn('glass-card overflow-hidden', className)}>
      {(title || headerRight) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-midnight-600/30">
          <div className="flex items-center gap-2">
            {icon && <span className="text-neon-green/80">{icon}</span>}
            {title && (
              <h3 className="text-sm font-semibold tracking-wider uppercase text-midnight-200">
                {title}
              </h3>
            )}
          </div>
          {headerRight}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
