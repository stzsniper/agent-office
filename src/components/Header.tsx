import { cn } from '@/lib/utils';
import { Building2, Radio, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [time, setTime] = useState(new Date());
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Manila',
    });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Manila',
    });
  };

  return (
    <header className="glass-card px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/30">
            <Building2 className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Agent Office
            </h1>
            <p className="text-xs text-midnight-300">Mission Control Command Center</p>
          </div>
        </div>

        {/* Status & Time */}
        <div className="flex items-center gap-6">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <Wifi className="w-4 h-4 text-neon-green" />
                <span className="text-xs text-neon-green font-medium">LIVE</span>
                <Radio className="w-3 h-3 text-neon-green animate-pulse" />
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-neon-red" />
                <span className="text-xs text-neon-red font-medium">OFFLINE</span>
              </>
            )}
          </div>

          {/* Clock */}
          <div className="text-right">
            <div className="text-lg font-mono font-bold text-white tabular-nums">
              {formatTime(time)}
            </div>
            <div className="text-[10px] text-midnight-400 uppercase tracking-wider">
              {formatDate(time)} PHT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
