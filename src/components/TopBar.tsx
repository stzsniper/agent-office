import { cn } from '@/lib/utils';
import { Wifi, WifiOff, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Manila' });

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Manila' });

  return (
    <header className="h-16 border-b border-midnight-700/50 bg-midnight-900/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-midnight-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-neon-green" />
          <span className="text-xs text-neon-green font-medium">LIVE</span>
          <Radio className="w-2.5 h-2.5 text-neon-green animate-pulse" />
        </div>
        <div className="text-right">
          <div className="text-sm font-mono font-bold text-white tabular-nums">{formatTime(time)}</div>
          <div className="text-[10px] text-midnight-400">{formatDate(time)} PHT</div>
        </div>
      </div>
    </header>
  );
}
