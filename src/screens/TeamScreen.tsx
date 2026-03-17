import { Card } from '@/components/Card';
import { useTasks } from '@/hooks/useInsForge';
import { AGENTS } from '@/lib/agents';
import { cn, formatTimeAgo } from '@/lib/utils';
import { ChevronDown, ChevronUp, Zap, Activity } from 'lucide-react';
import { useState } from 'react';

function AgentNode({ agent, tasks, isLead = false }: { agent: typeof AGENTS[0]; tasks: any[]; isLead?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const agentTasks = tasks?.filter(t => t.agent === agent.name) || [];
  const activeTask = agentTasks.find(t => t.status === 'in_progress');
  const completedCount = agentTasks.filter(t => t.status === 'completed').length;
  const failedCount = agentTasks.filter(t => t.status === 'failed').length;
  const hasError = agentTasks.some(t => t.status === 'failed');

  const status = activeTask ? 'busy' : hasError ? 'error' : 'idle';
  const statusDot = status === 'busy' ? 'bg-neon-yellow animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.5)]' :
                    status === 'error' ? 'bg-neon-red shadow-[0_0_8px_rgba(255,51,102,0.5)]' :
                    'bg-neon-green shadow-[0_0_8px_rgba(0,255,136,0.5)]';

  return (
    <div className={cn(
      'border rounded-xl overflow-hidden transition-all',
      isLead
        ? 'bg-neon-green/5 border-neon-green/20'
        : 'bg-midnight-800/60 border-midnight-700/40 hover:border-opacity-60'
    )} style={!isLead ? { borderColor: agent.color + '30' } : undefined}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{agent.emoji}</span>
            <div>
              <h3 className="font-semibold text-white">{agent.name}</h3>
              <p className="text-xs" style={{ color: agent.color }}>{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('w-3 h-3 rounded-full', statusDot)} />
            <span className={cn('text-[10px] font-medium uppercase', status === 'busy' ? 'text-neon-yellow' : status === 'error' ? 'text-neon-red' : 'text-neon-green')}>
              {status}
            </span>
          </div>
        </div>

        {activeTask && (
          <div className="flex items-start gap-2 mb-3 p-2 rounded-lg bg-neon-yellow/5 border border-neon-yellow/10">
            <Zap className="w-3 h-3 text-neon-yellow mt-0.5 flex-shrink-0" />
            <p className="text-xs text-neon-yellow/80">{activeTask.task}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-midnight-400">
          <div className="flex items-center gap-3">
            <span>{completedCount} done</span>
            {failedCount > 0 && <span className="text-neon-red">{failedCount} failed</span>}
          </div>
          {agentTasks[0]?.started_at && <span>{formatTimeAgo(agentTasks[0].started_at)}</span>}
        </div>

        <button onClick={() => setExpanded(!expanded)} className="w-full mt-3 flex items-center justify-center gap-1 text-xs text-midnight-500 hover:text-midnight-300 transition-colors py-1">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Less' : 'Details'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-midnight-700/30 p-4 bg-midnight-900/30">
          <h4 className="text-xs font-semibold text-midnight-300 uppercase tracking-wider mb-2">Responsibilities</h4>
          <ul className="space-y-1.5">
            {agent.responsibilities.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-midnight-400">
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: agent.color }} />
                {r}
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-midnight-800/50">
              <p className="text-lg font-bold font-mono text-white">{agentTasks.length}</p>
              <p className="text-[10px] text-midnight-500 uppercase">Total</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-midnight-800/50">
              <p className="text-lg font-bold font-mono" style={{ color: agent.color }}>{completedCount}</p>
              <p className="text-[10px] text-midnight-500 uppercase">Done</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-midnight-800/50">
              <p className="text-lg font-bold font-mono text-neon-red">{failedCount}</p>
              <p className="text-[10px] text-midnight-500 uppercase">Failed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TeamScreen() {
  const { data: tasks } = useTasks(200);
  const jarvis = AGENTS.find(a => a.name === 'Jarvis')!;
  const agents = AGENTS.filter(a => a.name !== 'Jarvis');

  return (
    <div className="space-y-6">
      {/* Jarvis — Lead */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <AgentNode agent={jarvis} tasks={tasks || []} isLead />
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-16 h-px bg-midnight-600" />
          <div className="w-2 h-2 rounded-full bg-neon-green" />
          <div className="w-16 h-px bg-midnight-600" />
        </div>
      </div>

      {/* Sub-agents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map(agent => (
          <AgentNode key={agent.name} agent={agent} tasks={tasks || []} />
        ))}
      </div>

      {/* Agent descriptions */}
      <Card title="Agent Descriptions" icon={<Activity className="w-4 h-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map(agent => (
            <div key={agent.name} className="p-3 rounded-lg bg-midnight-900/40">
              <div className="flex items-center gap-2 mb-2">
                <span>{agent.emoji}</span>
                <span className="text-sm font-semibold text-white">{agent.name}</span>
              </div>
              <p className="text-xs text-midnight-400">{agent.responsibilities[0]}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
