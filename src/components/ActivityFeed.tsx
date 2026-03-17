import { useState } from 'react';
import { useActivityFeed } from '@/hooks/useInsForge';
import { cn, formatTimeAgo } from '@/lib/utils';
import { AGENTS } from '@/lib/insforge';
import { Activity, Filter, RefreshCw } from 'lucide-react';

const statusColors: Record<string, string> = {
  success: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  completed: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  error: 'bg-neon-red/20 text-neon-red border-neon-red/30',
  failed: 'bg-neon-red/20 text-neon-red border-neon-red/30',
  pending: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
  in_progress: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
  warning: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30',
};

const agentEmojis: Record<string, string> = {
  Jarvis: '🤖',
  SNIPER: '🎯',
  LEO: '🛠️',
  Mark: '📊',
  Bryan: '📱',
};

export function ActivityFeed() {
  const [filterAgent, setFilterAgent] = useState<string>('');
  const { data: activities, isLoading, refetch, isFetching } = useActivityFeed(50, filterAgent || undefined);

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-neon-blue" />
          <h2 className="font-semibold text-white">Activity Feed</h2>
          {isFetching && <RefreshCw className="w-3 h-3 text-neon-blue animate-spin" />}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-midnight-400" />
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="bg-midnight-800 border border-midnight-600/50 text-midnight-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-neon-green/30"
          >
            <option value="">All Agents</option>
            {AGENTS.map((a) => (
              <option key={a.name} value={a.name}>{a.emoji} {a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-5 h-5 text-neon-blue animate-spin" />
          </div>
        ) : activities && activities.length > 0 ? (
          activities.map((item, i) => (
            <div
              key={item.id || i}
              className="flex items-start gap-3 p-3 rounded-lg bg-midnight-900/50 hover:bg-midnight-800/50 transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <span className="text-lg mt-0.5">{agentEmojis[item.agent] || '⚙️'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{item.agent}</span>
                  {item.status && (
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full border font-medium uppercase tracking-wider',
                      statusColors[item.status] || 'bg-midnight-700 text-midnight-300 border-midnight-600'
                    )}>
                      {item.status}
                    </span>
                  )}
                  <span className="text-[10px] text-midnight-400 ml-auto">
                    {item.created_at ? formatTimeAgo(item.created_at) : ''}
                  </span>
                </div>
                <p className="text-sm text-midnight-200">{item.action}</p>
                {item.details && (
                  <p className="text-xs text-midnight-400 mt-1 truncate">{item.details}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-midnight-400">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs mt-1">Agent actions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
