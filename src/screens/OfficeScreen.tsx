import { useTasks } from '@/hooks/useInsForge';
import { AGENTS } from '@/lib/agents';
import { cn } from '@/lib/utils';
import { X, Zap, Clock, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';

// Desk configurations per agent
const DESK_CONFIGS: Record<string, {
  monitorCount: number;
  screenColor: string;
  screenContent: string;
  deskItems: string[];
}> = {
  Jarvis: {
    monitorCount: 2,
    screenColor: '#00ff88',
    screenContent: 'overview',
    deskItems: ['☕', '📋', '🔑'],
  },
  SNIPER: {
    monitorCount: 3,
    screenColor: '#00d4ff',
    screenContent: 'charts',
    deskItems: ['📈', '☕', '🎯'],
  },
  LEO: {
    monitorCount: 3,
    screenColor: '#ff6b35',
    screenContent: 'code',
    deskItems: ['🖥️', '☕', '🔧'],
  },
  Mark: {
    monitorCount: 2,
    screenColor: '#a855f7',
    screenContent: 'news',
    deskItems: ['📰', '☕', '📊'],
  },
  Bryan: {
    monitorCount: 2,
    screenColor: '#ffd700',
    screenContent: 'social',
    deskItems: ['📱', '☕', '🎬'],
  },
};

const STATUS_CONFIG = {
  idle: { label: 'Working', color: '#00ff88', lampClass: 'lamp-green', screenGlow: true },
  busy: { label: 'Busy', color: '#ffd700', lampClass: 'lamp-yellow', screenGlow: true },
  error: { label: 'Error', color: '#ff3366', lampClass: 'lamp-red', screenGlow: false },
  offline: { label: 'Offline', color: '#536397', lampClass: 'lamp-off', screenGlow: false },
};

// Screen content patterns for each agent type
function ScreenPattern({ type, color, isActive }: { type: string; color: string; isActive: boolean }) {
  if (!isActive) return <div className="w-full h-full bg-midnight-900" />;

  return (
    <div className="w-full h-full overflow-hidden relative" style={{ background: '#0a0f1a' }}>
      {/* Screen glow effect */}
      <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at center, ${color}40 0%, transparent 70%)` }} />

      {type === 'overview' && (
        <div className="p-1 space-y-0.5">
          <div className="h-1 rounded-full bg-neon-green/40 w-3/4 animate-pulse" />
          <div className="h-0.5 rounded-full bg-midnight-500 w-full" />
          <div className="grid grid-cols-3 gap-0.5 mt-1">
            <div className="h-2 rounded bg-neon-green/20" />
            <div className="h-2 rounded bg-neon-blue/20" />
            <div className="h-2 rounded bg-neon-yellow/20" />
          </div>
          <div className="h-0.5 rounded-full bg-midnight-600 w-1/2 mt-0.5" />
          <div className="h-0.5 rounded-full bg-midnight-600 w-2/3" />
        </div>
      )}

      {type === 'charts' && (
        <div className="p-1">
          <svg viewBox="0 0 60 30" className="w-full h-4 opacity-80">
            <polyline
              points="0,25 8,20 12,22 18,15 22,18 28,10 32,12 38,8 42,14 48,6 52,10 58,4"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              className={isActive ? 'animate-pulse' : ''}
            />
            <polyline
              points="0,28 8,26 12,27 18,24 22,25 28,22 32,23 38,20 42,22 48,18 52,20 58,16"
              fill="none"
              stroke="#ff3366"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
          <div className="flex gap-0.5 mt-0.5">
            <div className="text-[5px] font-mono" style={{ color }}>+2.4%</div>
            <div className="text-[5px] font-mono text-neon-red">-0.8%</div>
          </div>
        </div>
      )}

      {type === 'code' && (
        <div className="p-1 space-y-0.5 font-mono">
          <div className="flex gap-0.5">
            <span className="text-[4px] text-midnight-500">1</span>
            <span className="text-[4px]" style={{ color }}>import</span>
            <span className="text-[4px] text-midnight-300">{'{'}</span>
          </div>
          <div className="flex gap-0.5">
            <span className="text-[4px] text-midnight-500">2</span>
            <span className="text-[4px] text-neon-blue ml-1">deploy</span>
          </div>
          <div className="flex gap-0.5">
            <span className="text-[4px] text-midnight-500">3</span>
            <span className="text-[4px] text-midnight-300">{'}'}</span>
            <span className="text-[4px] text-midnight-500">from</span>
          </div>
          <div className="h-0.5 w-full bg-midnight-700/30 my-0.5" />
          <div className="flex gap-0.5">
            <span className="text-[4px] text-midnight-500">{'>'}</span>
            <span className="text-[4px] text-neon-green animate-pulse">build ✓</span>
          </div>
        </div>
      )}

      {type === 'news' && (
        <div className="p-1 space-y-0.5">
          <div className="text-[5px] font-bold" style={{ color }}>FED NEWS</div>
          <div className="h-0.5 rounded bg-midnight-600 w-full" />
          <div className="h-0.5 rounded bg-midnight-700 w-4/5" />
          <div className="h-0.5 rounded bg-midnight-700 w-3/4" />
          <div className="text-[5px] font-bold mt-1 text-neon-yellow">CPI ALERT</div>
          <div className="h-0.5 rounded bg-midnight-600 w-full" />
          <div className="h-0.5 rounded bg-midnight-700 w-2/3" />
        </div>
      )}

      {type === 'social' && (
        <div className="p-1">
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-3 rounded bg-neon-yellow/20 flex items-center justify-center">
              <span className="text-[5px]">📱</span>
            </div>
            <div className="h-3 rounded bg-neon-purple/20 flex items-center justify-center">
              <span className="text-[5px]">🎬</span>
            </div>
            <div className="h-3 rounded bg-neon-green/20 flex items-center justify-center">
              <span className="text-[5px]">📊</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 mt-0.5">
            <div className="h-0.5 rounded bg-midnight-600 flex-1" />
            <span className="text-[4px]" style={{ color }}>LIVE</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Typing animation dots
function TypingIndicator({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="flex gap-0.5 items-center justify-center">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1 h-1 rounded-full bg-neon-green"
          style={{
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Agent figure (simplified stick person)
function AgentFigure({ status, color, isWorking }: { status: string; color: string; isWorking: boolean }) {
  if (status === 'offline') return null;

  return (
    <div className="flex flex-col items-center" style={{ animation: isWorking ? 'typingMotion 2s ease-in-out infinite' : 'none' }}>
      {/* Head */}
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, opacity: 0.8 }} />
      {/* Body */}
      <div className="w-4 h-3 rounded-t-lg mt-0.5" style={{ backgroundColor: color, opacity: 0.6 }} />
    </div>
  );
}

// Individual desk component
function Desk({
  agent,
  tasks,
  onClick,
}: {
  agent: typeof AGENTS[0];
  tasks: any[];
  onClick: () => void;
}) {
  const config = DESK_CONFIGS[agent.name];
  const agentTasks = tasks?.filter(t => t.agent === agent.name) || [];
  const activeTask = agentTasks.find(t => t.status === 'in_progress');
  const hasError = agentTasks.some(t => t.status === 'failed');

  const status: 'idle' | 'busy' | 'error' | 'offline' =
    activeTask ? 'busy' : hasError ? 'error' : agentTasks.length > 0 ? 'idle' : 'offline';

  const statusCfg = STATUS_CONFIG[status];
  const isWorking = status === 'idle' || status === 'busy';

  return (
    <div
      className="relative cursor-pointer group"
      onClick={onClick}
    >
      {/* Hover tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
        <div className="bg-midnight-800 border border-midnight-600/50 rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
          <p className="text-xs font-semibold text-white">{agent.name}</p>
          <p className="text-[10px]" style={{ color: statusCfg.color }}>
            {activeTask ? activeTask.task : statusCfg.label}
          </p>
        </div>
      </div>

      {/* Desk surface */}
      <div className="bg-midnight-800 border border-midnight-700/50 rounded-lg p-3 relative transition-all group-hover:border-neon-green/30 group-hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]">
        {/* Status lamp */}
        <div className="absolute -top-2 -right-2 z-10">
          <div className={cn('w-4 h-4 rounded-full border-2 border-midnight-800', statusCfg.lampClass)} />
        </div>

        {/* Nameplate */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-midnight-700 border border-midnight-600 rounded px-2 py-0.5">
            <span className="text-[9px] font-bold text-white">{agent.name}</span>
          </div>
        </div>

        {/* Monitors */}
        <div className={cn(
          'grid gap-1.5 mb-2 mt-1',
          config.monitorCount === 3 ? 'grid-cols-3' : 'grid-cols-2'
        )}>
          {Array.from({ length: config.monitorCount }).map((_, i) => (
            <div key={i} className="relative">
              {/* Monitor bezel */}
              <div className="bg-midnight-900 border border-midnight-700 rounded overflow-hidden">
                {/* Screen */}
                <div className={cn(
                  'aspect-[4/3] transition-all duration-500',
                  statusCfg.screenGlow && 'shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]'
                )}
                  style={statusCfg.screenGlow ? {
                    boxShadow: `0 0 15px ${config.screenColor}20, inset 0 0 10px ${config.screenColor}10`
                  } : {}}
                >
                  <ScreenPattern
                    type={config.screenContent}
                    color={config.screenColor}
                    isActive={isWorking && (i === 0 || config.monitorCount === 3)}
                  />
                </div>
              </div>
              {/* Monitor stand */}
              <div className="w-1/3 h-1 bg-midnight-700 mx-auto rounded-b" />
            </div>
          ))}
        </div>

        {/* Agent at desk */}
        <div className="flex items-center justify-between">
          {/* Desk items */}
          <div className="flex gap-1 text-xs">
            {config.deskItems.map((item, i) => (
              <span key={i} className={cn(
                'transition-opacity',
                isWorking ? 'opacity-80' : 'opacity-30'
              )}>{item}</span>
            ))}
          </div>

          {/* Agent figure */}
          <AgentFigure status={status} color={config.screenColor} isWorking={status === 'busy'} />

          {/* Typing indicator */}
          <div className="w-6">
            <TypingIndicator active={status === 'busy'} />
          </div>
        </div>

        {/* Current task strip */}
        {activeTask && (
          <div className="mt-2 pt-2 border-t border-midnight-700/30">
            <div className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-neon-yellow" />
              <p className="text-[9px] text-midnight-300 truncate">{activeTask.task}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-2 pt-2 border-t border-neon-red/20">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5 text-neon-red" />
              <p className="text-[9px] text-neon-red">Task failed — needs attention</p>
            </div>
          </div>
        )}

        {status === 'offline' && (
          <div className="mt-2 pt-2 border-t border-midnight-700/30 text-center">
            <p className="text-[9px] text-midnight-600">Away from desk</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Detail panel when clicking an agent
function AgentDetailPanel({ agent, tasks, onClose }: { agent: typeof AGENTS[0]; tasks: any[]; onClose: () => void }) {
  const agentTasks = tasks?.filter(t => t.agent === agent.name) || [];
  const activeTask = agentTasks.find(t => t.status === 'in_progress');
  const completedToday = agentTasks.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    return new Date(t.completed_at).toDateString() === new Date().toDateString();
  }).length;

  const config = DESK_CONFIGS[agent.name];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-midnight-800 border border-midnight-600/50 rounded-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header with agent color */}
        <div className="p-4 border-b border-midnight-700/30" style={{ background: `linear-gradient(135deg, ${config.screenColor}10, transparent)` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{agent.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                <p className="text-sm" style={{ color: config.screenColor }}>{agent.role}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-midnight-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Current Status */}
          <div className="p-3 rounded-lg bg-midnight-900/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeTask ? '#ffd700' : '#00ff88' }} />
              <span className="text-xs font-semibold text-midnight-300 uppercase tracking-wider">Current Status</span>
            </div>
            {activeTask ? (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon-yellow" />
                <p className="text-sm text-white">{activeTask.task}</p>
              </div>
            ) : (
              <p className="text-sm text-midnight-400">No active task — available for assignments</p>
            )}
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-midnight-900/50">
              <p className="text-xl font-bold font-mono text-white">{agentTasks.length}</p>
              <p className="text-[10px] text-midnight-500 uppercase">Total</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-midnight-900/50">
              <p className="text-xl font-bold font-mono" style={{ color: config.screenColor }}>{completedToday}</p>
              <p className="text-[10px] text-midnight-500 uppercase">Today</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-midnight-900/50">
              <p className="text-xl font-bold font-mono text-neon-green">
                {agentTasks.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-[10px] text-midnight-500 uppercase">Done</p>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="text-xs font-semibold text-midnight-400 uppercase tracking-wider mb-2">Role</h4>
            <ul className="space-y-1">
              {agent.responsibilities.slice(0, 4).map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-midnight-300">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: config.screenColor }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Desk Setup */}
          <div className="p-3 rounded-lg bg-midnight-900/30 border border-midnight-700/20">
            <h4 className="text-xs font-semibold text-midnight-400 uppercase tracking-wider mb-2">Desk Setup</h4>
            <div className="flex items-center gap-4 text-xs text-midnight-300">
              <span>🖥️ {config.monitorCount} monitors</span>
              <span>{config.deskItems.join(' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OfficeScreen() {
  const { data: tasks } = useTasks(200);
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENTS[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Office Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-midnight-300 uppercase tracking-wider">Agent Office Floor</h3>
          <p className="text-xs text-midnight-500 mt-0.5">Click any desk for agent details</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span className="text-midnight-400">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Office Floor */}
      <div className="bg-midnight-900/50 border border-midnight-700/30 rounded-2xl p-6 relative overflow-hidden">
        {/* Floor texture */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #18244b 20px, #18244b 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, #18244b 20px, #18244b 21px)',
        }} />

        {/* Ceiling lights */}
        <div className="absolute top-0 left-1/4 w-32 h-1 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute top-0 right-1/4 w-32 h-1 bg-gradient-to-b from-white/10 to-transparent" />

        {/* Jarvis desk — front and center (GM) */}
        <div className="flex justify-center mb-8">
          <div className="w-72">
            <Desk
              agent={AGENTS.find(a => a.name === 'Jarvis')!}
              tasks={tasks || []}
              onClick={() => setSelectedAgent(AGENTS.find(a => a.name === 'Jarvis')!)}
            />
          </div>
        </div>

        {/* Divider — Jarvis is the boss */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-midnight-700/30" />
          <span className="text-[10px] text-midnight-600 uppercase tracking-widest">Team Desks</span>
          <div className="flex-1 h-px bg-midnight-700/30" />
        </div>

        {/* Team desks — 2x2 grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.filter(a => a.name !== 'Jarvis').map(agent => (
            <Desk
              key={agent.name}
              agent={agent}
              tasks={tasks || []}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>

        {/* Floor decorations */}
        <div className="mt-8 pt-4 border-t border-midnight-800/50 flex items-center justify-between text-midnight-600">
          <div className="flex items-center gap-3 text-xs">
            <span>🪴</span>
            <span>Water cooler</span>
            <span>🚰</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span>📺</span>
            <span>News ticker</span>
            <span>📊</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span>🍕</span>
            <span>Break room</span>
            <span>☕</span>
          </div>
        </div>
      </div>

      {/* Agent Detail Panel */}
      {selectedAgent && (
        <AgentDetailPanel
          agent={selectedAgent}
          tasks={tasks || []}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes typingMotion {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-3px); opacity: 1; }
        }

        .lamp-green {
          background: #00ff88;
          box-shadow: 0 0 8px #00ff88, 0 0 16px #00ff8840;
          animation: lampPulse 3s ease-in-out infinite;
        }

        .lamp-yellow {
          background: #ffd700;
          box-shadow: 0 0 8px #ffd700, 0 0 16px #ffd70040;
          animation: lampPulse 1.5s ease-in-out infinite;
        }

        .lamp-red {
          background: #ff3366;
          box-shadow: 0 0 8px #ff3366, 0 0 16px #ff336640;
          animation: lampPulse 0.8s ease-in-out infinite;
        }

        .lamp-off {
          background: #283c7d;
          box-shadow: none;
        }

        @keyframes lampPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
