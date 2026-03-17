import { cn } from '@/lib/utils';
import GlassPanel from './GlassPanel';
import { Server, Cpu, HardDrive, MemoryStick } from 'lucide-react';

interface SystemMetric {
  label: string;
  value: number;
  max: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

const METRICS: SystemMetric[] = [
  { label: 'CPU', value: 23, max: 100, unit: '%', icon: <Cpu className="w-3.5 h-3.5" />, color: 'neon-green' },
  { label: 'Memory', value: 4.2, max: 8, unit: 'GB', icon: <MemoryStick className="w-3.5 h-3.5" />, color: 'neon-blue' },
  { label: 'Disk', value: 45, max: 100, unit: '%', icon: <HardDrive className="w-3.5 h-3.5" />, color: 'neon-purple' },
];

export default function SystemStatus() {
  return (
    <GlassPanel title="System" icon={<Server className="w-4 h-4" />}>
      <div className="space-y-4">
        {METRICS.map((metric) => {
          const pct = Math.round((metric.value / metric.max) * 100);
          const isHigh = pct > 80;

          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={cn('text-midnight-400')}>{metric.icon}</span>
                  <span className="text-xs text-midnight-300">{metric.label}</span>
                </div>
                <span className={cn('text-xs font-mono', isHigh ? 'text-neon-red' : 'text-midnight-200')}>
                  {metric.value}{metric.unit} / {metric.max}{metric.unit}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-midnight-800 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isHigh ? 'bg-neon-red' : `bg-${metric.color}`
                  )}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isHigh ? '#ff3366' : undefined,
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Uptime */}
        <div className="pt-3 border-t border-midnight-700/30 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-midnight-500">Uptime</span>
          <span className="text-xs font-mono text-neon-green">72h 34m</span>
        </div>
      </div>
    </GlassPanel>
  );
}
