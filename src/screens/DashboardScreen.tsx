import { Card } from '@/components/Card';
import { useActivityFeed, useTasks } from '@/hooks/useInsForge';
import { AGENTS, PROJECTS } from '@/lib/agents';
import { cn, formatTimeAgo } from '@/lib/utils';
import {
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Zap,
} from 'lucide-react';

const statusDots: Record<string, string> = {
  idle: 'bg-midnight-500',
  active: 'bg-neon-green shadow-[0_0_6px_rgba(0,255,136,0.5)]',
  busy: 'bg-neon-yellow shadow-[0_0_6px_rgba(255,215,0,0.5)] animate-pulse',
  pending: 'bg-neon-yellow',
  error: 'bg-neon-red shadow-[0_0_6px_rgba(255,51,102,0.5)]',
  completed: 'bg-neon-green',
  in_progress: 'bg-neon-blue',
  failed: 'bg-neon-red',
};

export function DashboardScreen() {
  const { data: tasks } = useTasks(200);
  const { data: activities } = useActivityFeed(20);

  const activeTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;
  const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
  const completedToday = tasks?.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    return new Date(t.completed_at).toDateString() === new Date().toDateString();
  }).length || 0;
  const errorTasks = tasks?.filter(t => t.status === 'failed').length || 0;

  const metrics = [
    { label: 'Active Tasks', value: activeTasks, icon: Loader2, color: 'text-neon-blue', bg: 'bg-neon-blue/10', desc: 'Across all agents' },
    { label: 'Pending', value: pendingTasks, icon: Clock, color: 'text-neon-yellow', bg: 'bg-neon-yellow/10', desc: 'Awaiting execution' },
    { label: 'Done Today', value: completedToday, icon: CheckCircle2, color: 'text-neon-green', bg: 'bg-neon-green/10', desc: 'Completed tasks' },
    { label: 'Errors', value: errorTasks, icon: AlertCircle, color: 'text-neon-red', bg: 'bg-neon-red/10', desc: 'Needs attention' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('p-2.5 rounded-lg', m.bg)}>
                  <Icon className={cn('w-5 h-5', m.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-mono">{m.value}</p>
                  <p className="text-xs text-midnight-400">{m.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed from InsForge */}
        <Card title="Live Activity Feed" icon={<Activity className="w-4 h-4" />} className="lg:col-span-2" headerRight={
          <span className="text-[10px] text-midnight-500">From InsForge activity_feed_v2</span>
        }>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {activities && activities.length > 0 ? activities.map((item, i) => (
              <div key={item.id || i} className="flex items-start gap-3 p-3 rounded-lg bg-midnight-900/40 hover:bg-midnight-900/70 transition-colors">
                <span className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', statusDots[item.status || 'active'])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white">{item.agent}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-midnight-800 text-midnight-400">{item.status || 'event'}</span>
                    <span className="text-[10px] text-midnight-500 ml-auto">{item.created_at ? formatTimeAgo(item.created_at) : ''}</span>
                  </div>
                  <p className="text-sm text-midnight-300 truncate">{item.action}</p>
                  {item.details && <p className="text-xs text-midnight-500 truncate mt-0.5">{item.details}</p>}
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-midnight-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No activity yet — agents will report here</p>
                <p className="text-xs text-midnight-600 mt-1">Connects to InsForge activity_feed_v2</p>
              </div>
            )}
          </div>
        </Card>

        {/* Agent Status Panel */}
        <Card title="Agent Status" icon={<Zap className="w-4 h-4" />}>
          <div className="space-y-3">
            {AGENTS.map((agent) => {
              const agentTasks = tasks?.filter(t => t.agent === agent.name) || [];
              const isActive = agentTasks.some(t => t.status === 'in_progress');
              const hasError = agentTasks.some(t => t.status === 'failed');
              const status = isActive ? 'busy' : hasError ? 'error' : agentTasks.length > 0 ? 'idle' : 'idle';

              return (
                <div key={agent.name} className="flex items-center justify-between p-3 rounded-lg bg-midnight-900/40 border border-midnight-800/50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{agent.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{agent.name}</p>
                      <p className="text-xs text-midnight-400">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('w-2.5 h-2.5 rounded-full', statusDots[status])} />
                    <span className={cn('text-[10px] font-medium uppercase', status === 'busy' ? 'text-neon-yellow' : status === 'error' ? 'text-neon-red' : 'text-neon-green')}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Projects */}
      <Card title="Active Projects" icon={<TrendingUp className="w-4 h-4" />}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PROJECTS.map(p => (
            <div key={p.name} className="p-3 rounded-lg bg-midnight-900/40 border border-midnight-800/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-sm font-medium text-white">{p.name}</span>
              </div>
              <p className="text-xs text-midnight-400">{p.url}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
