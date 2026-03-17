import { useTasks, useTaskStats } from '@/hooks/useInsForge';
import { AgentStatus, AGENTS } from '@/lib/insforge';
import { Header } from '@/components/Header';
import { AgentCard } from '@/components/AgentCard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { TaskQueue } from '@/components/TaskQueue';
import { QuickActions } from '@/components/QuickActions';
import { StatsBar } from '@/components/StatsBar';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import SystemStatus from '@/components/SystemStatus';
import { useMemo } from 'react';

export default function Dashboard() {
  const { data: tasks } = useTasks(200);
  const { data: statsTasks } = useTaskStats();

  // Compute agent statuses from tasks
  const agentStatuses = useMemo(() => {
    return AGENTS.map((agentDef) => {
      const agentTasks = tasks?.filter(t => t.agent === agentDef.name) || [];
      const todayTasks = agentTasks.filter(t => {
        if (!t.started_at) return false;
        const start = new Date(t.started_at);
        const today = new Date();
        return start.toDateString() === today.toDateString();
      });
      
      const activeTask = agentTasks.find(t => t.status === 'in_progress');
      const lastTask = agentTasks[0];
      
      // Compute success rate from stats
      const agentStats = statsTasks?.filter(t => t.agent === agentDef.name) || [];
      const completedCount = agentStats.filter(t => t.status === 'completed').length;
      const totalCount = agentStats.filter(t => t.status === 'completed' || t.status === 'failed').length;
      const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

      let status: AgentStatus['status'] = 'idle';
      if (activeTask) {
        status = 'busy';
      } else if (lastTask?.status === 'failed') {
        status = 'error';
      }

      return {
        ...agentDef,
        status,
        currentTask: activeTask?.task,
        lastActive: lastTask?.started_at || lastTask?.created_at,
        tasksToday: todayTasks.length,
        successRate,
      } as AgentStatus;
    });
  }, [tasks, statsTasks]);

  return (
    <div className="min-h-screen bg-midnight-950 p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto">
        <Header />
        <StatsBar />
        
        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions />
        </div>

        {/* Agent Cards */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-midnight-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Agent Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {agentStatuses.map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div className="space-y-6">
            <SystemStatus />
          </div>
        </div>

        {/* Performance & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PerformanceMetrics />
          <TaskQueue />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-midnight-500">
          <p>Agent Office v1.0 — Mission Control Command Center</p>
          <p className="mt-1">All agents monitored from one place • Auto-refresh every 15-30s</p>
        </footer>
      </div>
    </div>
  );
}
