import { useTaskStats, useTasks } from '@/hooks/useInsForge';
import { cn } from '@/lib/utils';
import { TrendingUp, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';

export function StatsBar() {
  const { data: allTasks } = useTasks(200);
  const { data: statsTasks } = useTaskStats();

  // Calculate stats
  const pending = allTasks?.filter(t => t.status === 'pending').length || 0;
  const inProgress = allTasks?.filter(t => t.status === 'in_progress').length || 0;
  const completed = statsTasks?.filter(t => t.status === 'completed').length || 0;
  const failed = statsTasks?.filter(t => t.status === 'failed').length || 0;
  const total = completed + failed;
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: 'Pending', value: pending, icon: Clock, color: 'text-neon-yellow', bg: 'bg-neon-yellow/10' },
    { label: 'In Progress', value: inProgress, icon: Activity, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
    { label: 'Completed (7d)', value: completed, icon: CheckCircle, color: 'text-neon-green', bg: 'bg-neon-green/10' },
    { label: 'Failed (7d)', value: failed, icon: XCircle, color: 'text-neon-red', bg: 'bg-neon-red/10' },
    { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: successRate >= 80 ? 'text-neon-green' : 'text-neon-yellow', bg: successRate >= 80 ? 'bg-neon-green/10' : 'bg-neon-yellow/10' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', stat.bg)}>
              <Icon className={cn('w-4 h-4', stat.color)} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-midnight-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
