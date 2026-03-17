import { useTasks } from '@/hooks/useInsForge';
import { AGENTS } from '@/lib/agents';
import { cn } from '@/lib/utils';
import { X, Zap, AlertCircle, Star, Sparkles } from 'lucide-react';
import { useState } from 'react';

const DESK_THEMES: Record<string, {
  primary: string;
  secondary: string;
  accent: string;
  screenContent: string;
  items: string[];
  floorPattern: string;
}> = {
  Jarvis: {
    primary: '#00ff88',
    secondary: '#00cc6a',
    accent: '#00ff8840',
    screenContent: 'command',
    items: ['📋', '🔑', '☕'],
    floorPattern: '#0a1f14',
  },
  SNIPER: {
    primary: '#00d4ff',
    secondary: '#00a8cc',
    accent: '#00d4ff40',
    screenContent: 'charts',
    items: ['📈', '🎯', '☕'],
    floorPattern: '#0a1a2f',
  },
  LEO: {
    primary: '#ff6b35',
    secondary: '#cc5529',
    accent: '#ff6b3540',
    screenContent: 'code',
    items: ['🔧', '⚡', '☕'],
    floorPattern: '#1f140a',
  },
  Mark: {
    primary: '#a855f7',
    secondary: '#8640d9',
    accent: '#a855f740',
    screenContent: 'news',
    items: ['📰', '🌍', '☕'],
    floorPattern: '#1a0a2f',
  },
  Bryan: {
    primary: '#ffd700',
    secondary: '#ccac00',
    accent: '#ffd70040',
    screenContent: 'social',
    items: ['📱', '🎬', '☕'],
    floorPattern: '#1f1a0a',
  },
};

const STATUS_CONFIG = {
  idle: { label: 'Working', color: '#00ff88', emoji: '✨' },
  busy: { label: 'Busy', color: '#ffd700', emoji: '⚡' },
  error: { label: 'Error', color: '#ff3366', emoji: '🚨' },
  offline: { label: 'Offline', color: '#536397', emoji: '💤' },
};

// Isometric screen content
function IsoScreen({ type, color, isActive }: { type: string; color: string; isActive: boolean }) {
  if (!isActive) return <div className="w-full h-full bg-midnight-950 rounded-sm" />;

  return (
    <div className="w-full h-full rounded-sm overflow-hidden relative" style={{ background: '#050a12' }}>
      <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}50 0%, transparent 60%)` }} />

      {type === 'command' && (
        <div className="p-1.5 space-y-1">
          <div className="flex gap-0.5">
            <div className="h-1.5 rounded-sm bg-neon-green/50 w-8 animate-pulse" />
            <div className="h-1.5 rounded-sm bg-neon-green/30 w-4" />
          </div>
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-2.5 rounded-sm bg-neon-green/20 border border-neon-green/10" />
            <div className="h-2.5 rounded-sm bg-neon-blue/20 border border-neon-blue/10" />
            <div className="h-2.5 rounded-sm bg-neon-yellow/20 border border-neon-yellow/10" />
          </div>
          <div className="flex gap-0.5">
            <div className="h-1 rounded-sm bg-midnight-600 flex-1" />
            <div className="h-1 rounded-sm bg-neon-green/40 w-3" />
          </div>
        </div>
      )}

      {type === 'charts' && (
        <div className="p-1">
          <svg viewBox="0 0 50 25" className="w-full h-5">
            <rect x="2" y="15" width="3" height="8" fill={color} opacity="0.6" />
            <rect x="7" y="10" width="3" height="13" fill={color} opacity="0.7" />
            <rect x="12" y="12" width="3" height="11" fill="#ff3366" opacity="0.5" />
            <rect x="17" y="6" width="3" height="17" fill={color} opacity="0.8" />
            <rect x="22" y="8" width="3" height="15" fill={color} opacity="0.7" />
            <rect x="27" y="4" width="3" height="19" fill={color} opacity="0.9" />
            <rect x="32" y="10" width="3" height="13" fill="#ff3366" opacity="0.4" />
            <rect x="37" y="2" width="3" height="21" fill={color} />
            <rect x="42" y="5" width="3" height="18" fill={color} opacity="0.8" />
          </svg>
        </div>
      )}

      {type === 'code' && (
        <div className="p-1 font-mono space-y-0.5">
          <div className="flex gap-1">
            <span className="text-[5px] text-midnight-600">1</span>
            <span className="text-[5px]" style={{ color }}>{'const'}</span>
            <span className="text-[5px] text-midnight-300">deploy</span>
          </div>
          <div className="flex gap-1">
            <span className="text-[5px] text-midnight-600">2</span>
            <span className="text-[5px] text-neon-blue">=</span>
            <span className="text-[5px] text-neon-yellow">await</span>
          </div>
          <div className="flex gap-1">
            <span className="text-[5px] text-midnight-600">3</span>
            <span className="text-[5px] text-neon-green">✓ build</span>
          </div>
          <div className="flex gap-1">
            <span className="text-[5px] text-midnight-600">4</span>
            <span className="text-[5px] animate-pulse" style={{ color }}>▶ push</span>
          </div>
        </div>
      )}

      {type === 'news' && (
        <div className="p-1.5 space-y-1">
          <div className="text-[6px] font-bold px-1 py-0.5 rounded-sm inline-block" style={{ background: color + '30', color }}>FED</div>
          <div className="h-1 rounded-sm bg-midnight-600 w-full" />
          <div className="h-1 rounded-sm bg-midnight-700 w-3/4" />
          <div className="text-[6px] font-bold px-1 py-0.5 rounded-sm inline-block bg-neon-yellow/20 text-neon-yellow mt-1">CPI</div>
          <div className="h-1 rounded-sm bg-midnight-600 w-full" />
        </div>
      )}

      {type === 'social' && (
        <div className="p-1">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-3 rounded-sm flex items-center justify-center" style={{ background: color + '20' }}>
              <span className="text-[6px]">📱</span>
            </div>
            <div className="h-3 rounded-sm bg-neon-purple/20 flex items-center justify-center">
              <span className="text-[6px]">🎬</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="h-0.5 rounded bg-neon-green flex-1 animate-pulse" />
            <span className="text-[5px] text-neon-green">LIVE</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Blocky Roblox-style avatar
function BlockyAvatar({ agent, status, theme }: { agent: typeof AGENTS[0]; status: string; theme: typeof DESK_THEMES[string] }) {
  const isOffline = status === 'offline';
  const isBusy = status === 'busy';
  const isError = status === 'error';

  return (
    <div className={cn('relative transition-all duration-300', isBusy && 'animate-bounce-slow')}>
      {/* Floating status icon */}
      {!isOffline && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <div className={cn(
            'text-sm animate-float',
            isError && 'animate-shake'
          )}>
            {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.emoji || '✨'}
          </div>
        </div>
      )}

      {/* Blocky body */}
      <div className="flex flex-col items-center" style={{ opacity: isOffline ? 0.3 : 1 }}>
        {/* Head */}
        <div
          className="w-8 h-8 rounded-lg border-2 relative"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            borderColor: theme.primary,
            boxShadow: `0 0 12px ${theme.accent}`,
          }}
        >
          {/* Eyes */}
          <div className="absolute top-2 left-1.5 w-1.5 h-2 bg-white rounded-sm" />
          <div className="absolute top-2 right-1.5 w-1.5 h-2 bg-white rounded-sm" />
          <div className="absolute top-2.5 left-2 w-0.5 h-1 bg-midnight-900 rounded-full" style={{ animation: isBusy ? 'none' : 'blink 3s infinite' }} />
          <div className="absolute top-2.5 right-2 w-0.5 h-1 bg-midnight-900 rounded-full" style={{ animation: isBusy ? 'none' : 'blink 3s infinite' }} />
          {/* Mouth */}
          {isError ? (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-1 bg-neon-red rounded-full" />
          ) : isBusy ? (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-b-2 border-l-2 border-r-2 border-white rounded-b-full" />
          ) : (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-white rounded-full" />
          )}
        </div>

        {/* Body */}
        <div
          className="w-10 h-7 -mt-1 rounded-lg border-2"
          style={{
            background: `linear-gradient(180deg, ${theme.secondary}90, ${theme.secondary}60)`,
            borderColor: theme.primary + '80',
          }}
        >
          {/* Arms */}
          <div className="absolute -left-2 top-11 w-2 h-5 rounded-lg" style={{ background: theme.secondary + '80', animation: isBusy ? 'typing 0.5s ease-in-out infinite alternate' : 'none' }} />
          <div className="absolute -right-2 top-11 w-2 h-5 rounded-lg" style={{ background: theme.secondary + '80', animation: isBusy ? 'typing 0.5s ease-in-out infinite alternate-reverse' : 'none' }} />
        </div>

        {/* Legs */}
        <div className="flex gap-1 -mt-0.5">
          <div className="w-4 h-4 rounded-lg" style={{ background: theme.secondary + '60', border: `2px solid ${theme.primary}40` }} />
          <div className="w-4 h-4 rounded-lg" style={{ background: theme.secondary + '60', border: `2px solid ${theme.primary}40` }} />
        </div>
      </div>

      {/* Name tag */}
      <div className="text-center mt-1">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{
          background: theme.primary + '20',
          color: theme.primary,
          border: `1px solid ${theme.primary}40`,
        }}>
          {agent.name}
        </span>
      </div>
    </div>
  );
}

// Isometric desk (CSS 3D)
function IsoDesk({
  agent,
  tasks,
  onClick,
}: {
  agent: typeof AGENTS[0];
  tasks: any[];
  onClick: () => void;
}) {
  const theme = DESK_THEMES[agent.name];
  const agentTasks = tasks?.filter(t => t.agent === agent.name) || [];
  const activeTask = agentTasks.find(t => t.status === 'in_progress');
  const hasError = agentTasks.some(t => t.status === 'failed');

  const status: 'idle' | 'busy' | 'error' | 'offline' =
    activeTask ? 'busy' : hasError ? 'error' : agentTasks.length > 0 ? 'idle' : 'offline';

  const statusCfg = STATUS_CONFIG[status];
  const isActive = status === 'idle' || status === 'busy';

  return (
    <div
      className="relative cursor-pointer group perspective-1000"
      onClick={onClick}
    >
      {/* Hover tooltip */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all z-30 pointer-events-none group-hover:-translate-y-1">
        <div className="bg-midnight-800 border-2 rounded-xl px-4 py-2 whitespace-nowrap shadow-2xl" style={{ borderColor: theme.primary + '50' }}>
          <p className="text-sm font-bold text-white flex items-center gap-1">
            <span>{agent.emoji}</span> {agent.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: statusCfg.color }}>
            {activeTask ? `⚡ ${activeTask.task}` : `${statusCfg.emoji} ${statusCfg.label}`}
          </p>
        </div>
      </div>

      {/* Isometric workstation card */}
      <div
        className="relative rounded-2xl p-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
        style={{
          background: `linear-gradient(145deg, ${theme.floorPattern}, #080c19)`,
          border: `2px solid ${theme.primary}30`,
          boxShadow: isActive ? `0 8px 32px ${theme.accent}, inset 0 1px 0 ${theme.primary}20` : '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Desk surface (isometric-ish) */}
        <div className="relative mb-3">
          {/* Monitor setup */}
          <div className={cn(
            'grid gap-2 mb-3 justify-center',
            agent.name === 'SNIPER' || agent.name === 'LEO' ? 'grid-cols-3' : 'grid-cols-2'
          )}>
            {Array.from({ length: agent.name === 'SNIPER' || agent.name === 'LEO' ? 3 : 2 }).map((_, i) => (
              <div key={i} className="relative">
                {/* Monitor frame */}
                <div className="bg-midnight-900 rounded-lg p-1 border-2" style={{ borderColor: theme.primary + '40' }}>
                  {/* Screen */}
                  <div
                    className="aspect-[4/3] rounded-sm overflow-hidden relative"
                    style={{
                      boxShadow: isActive ? `0 0 20px ${theme.accent}, inset 0 0 10px ${theme.primary}10` : 'none',
                    }}
                  >
                    <IsoScreen type={theme.screenContent} color={theme.primary} isActive={isActive && i === 0} />
                  </div>
                </div>
                {/* Stand */}
                <div className="flex justify-center">
                  <div className="w-4 h-1.5 rounded-b-lg" style={{ background: theme.primary + '30' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Desk items row */}
          <div className="flex justify-center gap-2 text-lg mb-2">
            {theme.items.map((item, i) => (
              <span key={i} className={cn(
                'transition-all duration-300',
                isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90 grayscale'
              )}>
                {item}
              </span>
            ))}
          </div>

          {/* Desk surface line */}
          <div className="h-2 rounded-full mx-4" style={{
            background: `linear-gradient(90deg, transparent, ${theme.primary}30, transparent)`,
          }} />
        </div>

        {/* Avatar */}
        <div className="flex justify-center relative" style={{ minHeight: '80px' }}>
          <BlockyAvatar agent={agent} status={status} theme={theme} />
        </div>

        {/* Status bar */}
        <div className="mt-3 pt-2 border-t flex items-center justify-between" style={{ borderColor: theme.primary + '20' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{
              background: statusCfg.color,
              boxShadow: `0 0 8px ${statusCfg.color}`,
              animation: status === 'busy' ? 'pulse 1s infinite' : status === 'error' ? 'pulse 0.5s infinite' : 'none',
            }} />
            <span className="text-[10px] font-medium" style={{ color: statusCfg.color }}>{statusCfg.label}</span>
          </div>
          <span className="text-[10px] text-midnight-500">{agentTasks.length} tasks</span>
        </div>

        {/* Active task strip */}
        {activeTask && (
          <div className="mt-2 p-2 rounded-lg" style={{ background: theme.primary + '10', border: `1px solid ${theme.primary}20` }}>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-neon-yellow flex-shrink-0" />
              <p className="text-[10px] text-midnight-200 truncate">{activeTask.task}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-2 p-2 rounded-lg bg-neon-red/10 border border-neon-red/20">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-neon-red" />
              <p className="text-[10px] text-neon-red">Task failed!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Detail panel
function AgentDetail({ agent, tasks, onClose }: { agent: typeof AGENTS[0]; tasks: any[]; onClose: () => void }) {
  const theme = DESK_THEMES[agent.name];
  const agentTasks = tasks?.filter(t => t.agent === agent.name) || [];
  const activeTask = agentTasks.find(t => t.status === 'in_progress');
  const completedToday = agentTasks.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    return new Date(t.completed_at).toDateString() === new Date().toDateString();
  }).length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="rounded-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{
          background: `linear-gradient(145deg, ${theme.floorPattern}, #080c19)`,
          border: `2px solid ${theme.primary}40`,
          boxShadow: `0 24px 80px ${theme.accent}`,
        }}
      >
        {/* Header */}
        <div className="p-5 border-b" style={{ borderColor: theme.primary + '20', background: theme.primary + '05' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{agent.emoji}</div>
              <div>
                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                <p className="text-sm" style={{ color: theme.primary }}>{agent.role}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-midnight-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Current task */}
          <div className="p-3 rounded-xl" style={{ background: theme.primary + '10', border: `1px solid ${theme.primary}20` }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
              <span className="text-xs font-semibold text-midnight-300 uppercase tracking-wider">Status</span>
            </div>
            {activeTask ? (
              <p className="text-sm text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon-yellow" />
                {activeTask.task}
              </p>
            ) : (
              <p className="text-sm text-midnight-400">Available for assignments ✨</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-midnight-900/50">
              <p className="text-2xl font-bold font-mono text-white">{agentTasks.length}</p>
              <p className="text-[10px] text-midnight-500 uppercase mt-0.5">Total</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-midnight-900/50">
              <p className="text-2xl font-bold font-mono" style={{ color: theme.primary }}>{completedToday}</p>
              <p className="text-[10px] text-midnight-500 uppercase mt-0.5">Today</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-midnight-900/50">
              <p className="text-2xl font-bold font-mono text-neon-green">
                {agentTasks.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-[10px] text-midnight-500 uppercase mt-0.5">Done</p>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="text-xs font-semibold text-midnight-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Star className="w-3 h-3" style={{ color: theme.primary }} />
              Role
            </h4>
            <div className="space-y-1.5">
              {agent.responsibilities.slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-midnight-300 p-1.5 rounded-lg bg-midnight-900/30">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.primary }} />
                  {r}
                </div>
              ))}
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

  const jarvis = AGENTS.find(a => a.name === 'Jarvis')!;
  const team = AGENTS.filter(a => a.name !== 'Jarvis');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-midnight-300 uppercase tracking-wider flex items-center gap-2">
            <span className="text-lg">🏢</span> Agent Office
          </h3>
          <p className="text-xs text-midnight-500 mt-0.5">Click any agent to view details</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-midnight-800/50">
              <span>{cfg.emoji}</span>
              <span className="text-midnight-400">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Office floor — isometric grid */}
      <div className="relative">
        {/* Jarvis — Command Center (top) */}
        <div className="flex justify-center mb-8">
          <div className="w-80">
            <div className="text-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neon-green/60 px-3 py-1 rounded-full border border-neon-green/20 bg-neon-green/5">
                🏆 Command Center
              </span>
            </div>
            <IsoDesk
              agent={jarvis}
              tasks={tasks || []}
              onClick={() => setSelectedAgent(jarvis)}
            />
          </div>
        </div>

        {/* Team workstations */}
        <div className="text-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-midnight-500 px-3 py-1">
            ↓ Team Workstations ↓
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map(agent => (
            <IsoDesk
              key={agent.name}
              agent={agent}
              tasks={tasks || []}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      </div>

      {/* Floor decorations */}
      <div className="bg-midnight-900/30 border border-midnight-800/30 rounded-xl p-4">
        <div className="flex items-center justify-around text-2xl">
          <div className="text-center">
            <div>🪴</div>
            <div className="text-[9px] text-midnight-600 mt-1">Plants</div>
          </div>
          <div className="text-center">
            <div>🍕☕</div>
            <div className="text-[9px] text-midnight-600 mt-1">Break Room</div>
          </div>
          <div className="text-center">
            <div>📺📊</div>
            <div className="text-[9px] text-midnight-600 mt-1">News Wall</div>
          </div>
          <div className="text-center">
            <div>🎮🎯</div>
            <div className="text-[9px] text-midnight-600 mt-1">Game Zone</div>
          </div>
          <div className="text-center">
            <div>🚪</div>
            <div className="text-[9px] text-midnight-600 mt-1">Entrance</div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedAgent && (
        <AgentDetail
          agent={selectedAgent}
          tasks={tasks || []}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }

        @keyframes typing {
          0% { transform: translateY(0) rotate(-5deg); }
          100% { transform: translateY(-3px) rotate(5deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
