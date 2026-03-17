import { useState } from 'react';
import { useCreateTask } from '@/hooks/useInsForge';
import { cn } from '@/lib/utils';
import { Zap, Bot, TrendingUp, GitBranch, MessageSquare, BarChart3, Play, Loader2 } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  agent: string;
  task: string;
  icon: typeof Zap;
  color: string;
  hoverColor: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'mark-scan',
    label: 'Run Macro Scan',
    agent: 'Mark',
    task: 'Run comprehensive macro market scan',
    icon: BarChart3,
    color: 'text-neon-blue',
    hoverColor: 'hover:border-neon-blue/40 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]',
  },
  {
    id: 'sniper-backtest',
    label: 'SNIPER Backtest',
    agent: 'SNIPER',
    task: 'Run trading strategy backtest',
    icon: TrendingUp,
    color: 'text-neon-green',
    hoverColor: 'hover:border-neon-green/40 hover:shadow-[0_0_15px_rgba(0,255,136,0.15)]',
  },
  {
    id: 'leo-deploy',
    label: 'LEO Deploy Fix',
    agent: 'LEO',
    task: 'Deploy pending fixes to production',
    icon: GitBranch,
    color: 'text-neon-orange',
    hoverColor: 'hover:border-neon-orange/40 hover:shadow-[0_0_15px_rgba(255,107,53,0.15)]',
  },
  {
    id: 'bryan-content',
    label: 'Bryan Post Content',
    agent: 'Bryan',
    task: 'Generate and schedule social media content',
    icon: MessageSquare,
    color: 'text-neon-purple',
    hoverColor: 'hover:border-neon-purple/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]',
  },
  {
    id: 'check-status',
    label: 'Check All Agents',
    agent: 'Jarvis',
    task: 'Run comprehensive status check on all agents',
    icon: Bot,
    color: 'text-neon-yellow',
    hoverColor: 'hover:border-neon-yellow/40 hover:shadow-[0_0_15px_rgba(255,215,0,0.15)]',
  },
];

export function QuickActions() {
  const [runningId, setRunningId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const createTask = useCreateTask();

  const handleAction = async (action: QuickAction) => {
    setRunningId(action.id);
    setSuccessId(null);

    try {
      await createTask.mutateAsync({
        agent: action.agent,
        task: action.task,
        status: 'pending',
        started_at: new Date().toISOString(),
      });
      setSuccessId(action.id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-neon-yellow" />
        <h2 className="font-semibold text-white">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isRunning = runningId === action.id;
          const isSuccess = successId === action.id;

          return (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              disabled={isRunning}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300',
                'bg-midnight-900/50 border border-midnight-600/30',
                action.hoverColor,
                'hover:scale-[1.02] active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                isSuccess && 'border-neon-green/40 shadow-[0_0_20px_rgba(0,255,136,0.2)]'
              )}
            >
              {isRunning ? (
                <Loader2 className="w-6 h-6 text-midnight-300 animate-spin" />
              ) : isSuccess ? (
                <Play className="w-6 h-6 text-neon-green" />
              ) : (
                <Icon className={cn('w-6 h-6', action.color)} />
              )}
              <span className={cn(
                'text-xs font-medium text-center',
                isSuccess ? 'text-neon-green' : 'text-midnight-200'
              )}>
                {isRunning ? 'Launching...' : isSuccess ? 'Queued!' : action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
