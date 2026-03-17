import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { Clock, Link, Bot, Plus, Play, Pause, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Real cron jobs for STZ agents
const CRON_JOBS = [
  { id: '1', name: 'SNIPER Daily Market Scan', schedule: '0 8 * * *', agent: 'SNIPER', project: 'SNIPER Trading', status: 'active' as const, lastRun: '2h ago', nextRun: 'in 22h' },
  { id: '2', name: 'SNIPER Position Monitor', schedule: '*/30 * * * *', agent: 'SNIPER', project: 'SNIPER Trading', status: 'active' as const, lastRun: '14m ago', nextRun: 'in 16m' },
  { id: '3', name: 'Mark Hourly Macro Scan', schedule: '0 * * * *', agent: 'Mark', project: 'Agent Office', status: 'active' as const, lastRun: '45m ago', nextRun: 'in 15m' },
  { id: '4', name: 'Mark Weekly Macro Report', schedule: '0 9 * * 1', agent: 'Mark', project: 'Agent Office', status: 'active' as const, lastRun: '3d ago', nextRun: 'in 4d' },
  { id: '5', name: 'Bryan Daily Facebook Post', schedule: '0 10 * * 1-5', agent: 'Bryan', project: 'Bryan Video Pipeline', status: 'active' as const, lastRun: '18h ago', nextRun: 'in 6h' },
  { id: '6', name: 'Bryan Weekly Video Publish', schedule: '0 14 * * 3', agent: 'Bryan', project: 'Bryan Video Pipeline', status: 'active' as const, lastRun: '5d ago', nextRun: 'in 2d' },
  { id: '7', name: 'Jarvis Health Check', schedule: '*/30 * * * *', agent: 'Jarvis', project: 'Agent Office', status: 'active' as const, lastRun: '12m ago', nextRun: 'in 18m' },
  { id: '8', name: 'Jarvis Daily Status Report', schedule: '0 18 * * *', agent: 'Jarvis', project: 'Agent Office', status: 'active' as const, lastRun: '6h ago', nextRun: 'in 18h' },
  { id: '9', name: 'LEO Deploy Watch', schedule: '0 */6 * * *', agent: 'LEO', project: 'STZ Platform', status: 'paused' as const, lastRun: '1d ago', nextRun: 'paused' },
  { id: '10', name: 'Jarvis Weekly Summary', schedule: '0 18 * * 5', agent: 'Jarvis', project: 'Agent Office', status: 'active' as const, lastRun: '4d ago', nextRun: 'in 3d' },
];

// Real integrations
const INTEGRATIONS = [
  { id: '1', name: 'InsForge', status: 'connected' as const, icon: '🔥', description: 'Database & API — activity_feed_v2, agent_tasks tables' },
  { id: '2', name: 'OpenClaw', status: 'connected' as const, icon: '🦞', description: 'Gateway, session management, cron, WebSocket API' },
  { id: '3', name: 'Cloudflare Pages', status: 'connected' as const, icon: '☁️', description: 'Hosting — stzsniper.com, agent-office.pages.dev' },
  { id: '4', name: 'GitHub', status: 'connected' as const, icon: '🐙', description: 'Version control — stzsniper/smart-traderzone, stzsniper/agent-office' },
  { id: '5', name: 'Telegram', status: 'connected' as const, icon: '📱', description: 'Primary channel — agent commands, notifications' },
  { id: '6', name: 'TradingView', status: 'connected' as const, icon: '📈', description: 'Chart data for SNIPER signal generation' },
  { id: '7', name: 'Twitter/X', status: 'disconnected' as const, icon: '🐦', description: 'Social posting — not yet configured' },
  { id: '8', name: 'Notion', status: 'disconnected' as const, icon: '📝', description: 'Documentation sync — not yet configured' },
];

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-neon-green/20 text-neon-green',
  paused: 'bg-neon-yellow/20 text-neon-yellow',
  connected: 'bg-neon-green/20 text-neon-green',
  disconnected: 'bg-midnight-600/50 text-midnight-400',
  error: 'bg-neon-red/20 text-neon-red',
};

const AGENT_COLORS: Record<string, string> = {
  SNIPER: '#00d4ff',
  Mark: '#a855f7',
  Bryan: '#ffd700',
  Jarvis: '#00ff88',
  LEO: '#ff6b35',
};

export function SettingsScreen() {
  const [tab, setTab] = useState<'cron' | 'integrations' | 'agents'>('cron');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {[
          { id: 'cron' as const, label: 'Cron Jobs', icon: Clock },
          { id: 'integrations' as const, label: 'Integrations', icon: Link },
          { id: 'agents' as const, label: 'Agent Config', icon: Bot },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t.id ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'text-midnight-400 hover:text-white hover:bg-midnight-800'
              )}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'cron' && (
        <Card title="Scheduled Jobs" icon={<Clock className="w-4 h-4" />} headerRight={
          <span className="text-[10px] text-midnight-500">{CRON_JOBS.filter(j => j.status === 'active').length} active</span>
        }>
          <div className="space-y-2">
            {CRON_JOBS.map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-midnight-900/40 hover:bg-midnight-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', STATUS_STYLES[job.status])}>
                    {job.status}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{job.name}</p>
                    <div className="flex items-center gap-2 text-xs text-midnight-500">
                      <span className="font-mono">{job.schedule}</span>
                      <span>•</span>
                      <span style={{ color: AGENT_COLORS[job.agent] }}>{job.agent}</span>
                      <span>•</span>
                      <span>{job.project}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs hidden lg:block">
                    <p className="text-midnight-400">Last: {job.lastRun}</p>
                    <p className="text-midnight-500">Next: {job.nextRun}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded text-midnight-500 hover:text-neon-green"><Play className="w-3 h-3" /></button>
                    <button className="p-1.5 rounded text-midnight-500 hover:text-neon-yellow"><Pause className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEGRATIONS.map(int => (
            <Card key={int.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{int.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{int.name}</h3>
                    <p className="text-xs text-midnight-400">{int.description}</p>
                  </div>
                </div>
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', STATUS_STYLES[int.status])}>
                  {int.status}
                </span>
              </div>
              <button className={cn(
                'w-full mt-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                int.status === 'connected'
                  ? 'bg-midnight-700/50 text-midnight-400 hover:text-white'
                  : 'bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/20'
              )}>
                {int.status === 'connected' ? 'Configure' : 'Connect'}
              </button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'agents' && (
        <div className="space-y-3">
          {[
            { name: 'Jarvis', emoji: '🤖', desc: 'Model: GPT-4o | Tools: Telegram, InsForge, All agents | Permissions: Full access' },
            { name: 'SNIPER', emoji: '🎯', desc: 'Model: GPT-4o | Tools: TradingView, InsForge | Permissions: Read markets, write trades' },
            { name: 'LEO', emoji: '🛠️', desc: 'Model: GPT-4o | Tools: GitHub, Cloudflare, npm | Permissions: Deploy, code, build' },
            { name: 'Mark', emoji: '📊', desc: 'Model: GPT-4o | Tools: Web search, InsForge | Permissions: Read markets, write reports' },
            { name: 'Bryan', emoji: '📱', desc: 'Model: GPT-4o | Tools: Facebook API, InsForge | Permissions: Read/write content' },
          ].map(agent => (
            <Card key={agent.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{agent.emoji}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                    <p className="text-xs text-midnight-400">{agent.desc}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-midnight-700/50 text-midnight-300 text-xs font-medium hover:text-white transition-colors">
                  Configure
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
