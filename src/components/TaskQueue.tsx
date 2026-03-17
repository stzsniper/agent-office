import { useState } from 'react';
import { useTasks, useUpdateTask } from '@/hooks/useInsForge';
import { cn, formatTimeAgo, formatDuration } from '@/lib/utils';
import { AgentTask } from '@/lib/insforge';
import { ListTodo, RefreshCw, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-neon-yellow', bg: 'bg-neon-yellow/10' },
  in_progress: { icon: Loader2, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
  completed: { icon: CheckCircle, color: 'text-neon-green', bg: 'bg-neon-green/10' },
  failed: { icon: XCircle, color: 'text-neon-red', bg: 'bg-neon-red/10' },
};

export function TaskQueue() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: tasks, isLoading, isFetching } = useTasks(50, statusFilter || undefined);
  const updateTask = useUpdateTask();

  const handleStatusChange = (task: AgentTask, newStatus: string) => {
    if (!task.id) return;
    const updates: Partial<AgentTask> = { status: newStatus as AgentTask['status'] };
    if (newStatus === 'completed' || newStatus === 'failed') {
      updates.completed_at = new Date().toISOString();
      if (task.started_at) {
        updates.duration_ms = Date.now() - new Date(task.started_at).getTime();
      }
    }
    updateTask.mutate({ id: task.id, updates });
  };

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-neon-purple" />
          <h2 className="font-semibold text-white">Task Queue</h2>
          {isFetching && <RefreshCw className="w-3 h-3 text-neon-purple animate-spin" />}
          {tasks && (
            <span className="text-xs text-midnight-400 ml-1">({tasks.length})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {['', 'pending', 'in_progress', 'completed', 'failed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'text-[10px] px-2 py-1 rounded-md font-medium transition-all uppercase tracking-wider',
                statusFilter === s
                  ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                  : 'text-midnight-400 hover:text-midnight-200 hover:bg-midnight-800'
              )}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-midnight-400 text-xs uppercase tracking-wider border-b border-midnight-700/50">
              <th className="pb-3 font-medium">Agent</th>
              <th className="pb-3 font-medium">Task</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Started</th>
              <th className="pb-3 font-medium">Duration</th>
              <th className="pb-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center">
                  <RefreshCw className="w-5 h-5 text-neon-purple animate-spin mx-auto" />
                </td>
              </tr>
            ) : tasks && tasks.length > 0 ? (
              tasks.map((task, i) => {
                const config = statusConfig[task.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const isExpanded = expandedId === task.id;

                return (
                  <>
                    <tr
                      key={task.id || i}
                      className="border-b border-midnight-800/50 hover:bg-midnight-800/30 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : task.id || null)}
                    >
                      <td className="py-3 text-white font-medium">{task.agent}</td>
                      <td className="py-3 text-midnight-200 max-w-[300px] truncate">{task.task}</td>
                      <td className="py-3">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border',
                          config.bg, config.color,
                          'border-current/20'
                        )}>
                          <StatusIcon className={cn('w-3 h-3', task.status === 'in_progress' && 'animate-spin')} />
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-midnight-300 text-xs">
                        {task.started_at ? formatTimeAgo(task.started_at) : '—'}
                      </td>
                      <td className="py-3 text-midnight-300 text-xs">
                        {task.duration_ms ? formatDuration(task.duration_ms) : '—'}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-midnight-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-midnight-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${task.id}-detail`}>
                        <td colSpan={6} className="py-3 px-4 bg-midnight-900/50">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-midnight-400">Session:</span>
                              <span className="text-midnight-200 ml-2">{task.session_key || '—'}</span>
                            </div>
                            <div>
                              <span className="text-midnight-400">Completed:</span>
                              <span className="text-midnight-200 ml-2">
                                {task.completed_at ? formatTimeAgo(task.completed_at) : '—'}
                              </span>
                            </div>
                            {task.result && (
                              <div className="col-span-2">
                                <span className="text-midnight-400">Result:</span>
                                <p className="text-midnight-200 mt-1 bg-midnight-800 rounded p-2">{task.result}</p>
                              </div>
                            )}
                            {task.status === 'in_progress' && (
                              <div className="col-span-2 flex gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleStatusChange(task, 'completed'); }}
                                  className="btn-primary text-xs py-1 px-3"
                                >
                                  Mark Complete
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleStatusChange(task, 'failed'); }}
                                  className="btn-action text-xs py-1 px-3"
                                >
                                  Mark Failed
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-midnight-400">
                  <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
