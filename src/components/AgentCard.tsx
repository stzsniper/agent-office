import { AgentStatus } from '@/lib/insforge';
import { cn, formatTimeAgo, getStatusDotClass } from '@/lib/utils';
import { Clock, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface AgentCardProps {
  agent: AgentStatus;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="glass-card p-5 hover:border-neon-green/20 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{agent.emoji}</span>
          <div>
            <h3 className="font-semibold text-white group-hover:text-neon-green transition-colors">
              {agent.name}
            </h3>
            <p className="text-xs text-midnight-300">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('status-dot', getStatusDotClass(agent.status))} />
          <span className={cn(
            'text-xs font-medium uppercase tracking-wider',
            agent.status === 'idle' && 'text-neon-green',
            agent.status === 'busy' && 'text-neon-yellow',
            agent.status === 'error' && 'text-neon-red',
            agent.status === 'offline' && 'text-midnight-400',
          )}>
            {agent.status}
          </span>
        </div>
      </div>

      {/* Current Task */}
      <div className="mb-3 min-h-[40px]">
        {agent.currentTask ? (
          <div className="flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-neon-yellow mt-0.5 flex-shrink-0" />
            <p className="text-sm text-midnight-100 line-clamp-2">{agent.currentTask}</p>
          </div>
        ) : (
          <p className="text-sm text-midnight-400 italic">
            {agent.status === 'offline' ? 'Agent offline' : 'No active task'}
          </p>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-3 border-t border-midnight-700/50">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-midnight-400" />
          <span className="text-xs text-midnight-300">
            {agent.lastActive ? formatTimeAgo(agent.lastActive) : 'Never'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-neon-green/70" />
            <span className="text-xs text-midnight-300">{agent.tasksToday} today</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium" style={{
              color: agent.successRate >= 90 ? '#00ff88' : agent.successRate >= 70 ? '#ffd700' : '#ff3366'
            }}>
              {agent.successRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
