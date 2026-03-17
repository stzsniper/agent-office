import { cn } from '@/lib/utils';
import { useTaskStats } from '@/hooks/useInsForge';
import GlassPanel from './GlassPanel';
import { BarChart3, TrendingUp, TrendingDown, Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { AGENTS, type AgentTask } from '@/lib/insforge';
import { useMemo } from 'react';

const AGENT_COLORS: Record<string, string> = {
  Jarvis: '#00ff88',
  SNIPER: '#00d4ff',
  LEO: '#a855f7',
  Mark: '#ff6b35',
  Bryan: '#ffd700',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-midnight-800 border border-midnight-600/50 rounded-lg px-3 py-2 text-xs">
      <p className="text-midnight-200 font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function PerformanceMetrics() {
  const { data: stats } = useTaskStats();

  const agentStats = useMemo(() => {
    if (!stats) return [];

    return AGENTS.map((agent) => {
      const agentTasks = stats.filter((t: AgentTask) => t.agent === agent.name);
      const completed = agentTasks.filter((t: AgentTask) => t.status === 'completed').length;
      const failed = agentTasks.filter((t: AgentTask) => t.status === 'failed').length;
      const total = completed + failed;
      const successRate = total > 0 ? Math.round((completed / total) * 100) : 100;
      const avgDuration =
        agentTasks
          .filter((t: AgentTask) => t.duration_ms)
          .reduce((acc: number, t: AgentTask) => acc + (t.duration_ms || 0), 0) /
          (agentTasks.filter((t: AgentTask) => t.duration_ms).length || 1);

      return {
        name: agent.name,
        emoji: agent.emoji,
        total: agentTasks.length,
        completed,
        failed,
        successRate,
        avgDuration: Math.round(avgDuration / 1000), // in seconds
        color: AGENT_COLORS[agent.name] || '#7e8ab1',
      };
    });
  }, [stats]);

  const overallStats = useMemo(() => {
    if (!stats) return { total: 0, completed: 0, failed: 0, successRate: 0 };
    const completed = stats.filter((t: AgentTask) => t.status === 'completed').length;
    const failed = stats.filter((t: AgentTask) => t.status === 'failed').length;
    const total = completed + failed;
    return {
      total: stats.length,
      completed,
      failed,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [stats]);

  const pieData = useMemo(() => {
    return agentStats
      .filter((a) => a.total > 0)
      .map((a) => ({ name: a.name, value: a.total, fill: a.color }));
  }, [agentStats]);

  return (
    <GlassPanel
      title="Performance"
      icon={<BarChart3 className="w-4 h-4" />}
      headerRight={
        <div className="text-xs text-midnight-400">Last 7 days</div>
      }
    >
      {/* Overall stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-midnight-50">{overallStats.total}</div>
          <div className="text-[10px] uppercase tracking-wider text-midnight-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-neon-green">{overallStats.completed}</div>
          <div className="text-[10px] uppercase tracking-wider text-midnight-500">Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-neon-red">{overallStats.failed}</div>
          <div className="text-[10px] uppercase tracking-wider text-midnight-500">Failed</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-bold font-mono text-neon-blue">
              {overallStats.successRate}%
            </span>
            {overallStats.successRate >= 80 ? (
              <TrendingUp className="w-4 h-4 text-neon-green" />
            ) : (
              <TrendingDown className="w-4 h-4 text-neon-red" />
            )}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-midnight-500">Success</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Bar chart - tasks per agent */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-midnight-500 mb-2">
            Tasks per Agent
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentStats} barSize={16}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#7e8ab1' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Tasks" radius={[4, 4, 0, 0]}>
                  {agentStats.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart - task distribution */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-midnight-500 mb-2">
            Distribution
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Per-agent breakdown */}
      <div className="mt-4 space-y-2">
        {agentStats.map((agent) => (
          <div
            key={agent.name}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-midnight-900/30"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{agent.emoji}</span>
              <span className="text-xs font-semibold text-midnight-200">{agent.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-midnight-400">
                <span className="text-midnight-200 font-mono">{agent.total}</span> tasks
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" style={{ color: agent.color }} />
                <span className="font-mono" style={{ color: agent.color }}>
                  {agent.successRate}%
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SNIPER-specific metrics */}
      {agentStats.find((a) => a.name === 'SNIPER') && (
        <div className="mt-4 p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🎯</span>
            <span className="text-xs font-bold text-neon-blue">SNIPER Trading Stats</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold font-mono text-midnight-100">
                {agentStats.find((a) => a.name === 'SNIPER')?.completed || 0}
              </div>
              <div className="text-[10px] text-midnight-500">Trades</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-neon-green">
                {agentStats.find((a) => a.name === 'SNIPER')?.successRate || 0}%
              </div>
              <div className="text-[10px] text-midnight-500">Win Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-midnight-100">
                {agentStats.find((a) => a.name === 'SNIPER')?.avgDuration || 0}s
              </div>
              <div className="text-[10px] text-midnight-500">Avg Duration</div>
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
