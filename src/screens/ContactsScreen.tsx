import { cn } from '@/lib/utils';
import { Search, Plus, MessageSquare, Globe, X, Bot } from 'lucide-react';
import { useState } from 'react';

interface ContactItem {
  id: string;
  name: string;
  role: string;
  handle: string;
  timezone: string;
  category: string;
  notes: string;
}

// Real contacts for STZ
const CONTACTS: ContactItem[] = [
  // Internal Team
  { id: '1', name: 'Willy', role: 'Owner / Director', handle: '@willy_stz', timezone: 'PHT (UTC+8)', category: 'Internal Team', notes: 'Primary decision maker. Approves all platform changes and deploys. Set the "never touch stzsniper.com without explicit order" rule.' },
  { id: '2', name: 'Jarvis', role: 'General Manager (AI)', handle: 'jarvis@agent-office', timezone: 'PHT (UTC+8)', category: 'Internal Team', notes: 'AI agent — coordinates all operations, handles Telegram, manages InsForge database, gatekeeper for platform changes.' },
  { id: '3', name: 'SNIPER', role: 'Trading Engine (AI)', handle: 'sniper@agent-office', timezone: 'PHT (UTC+8)', category: 'Internal Team', notes: 'AI agent — SMC crypto signals, position monitoring, backtests. 2% max risk per trade.' },
  { id: '4', name: 'LEO', role: 'DevOps & Frontend (AI)', handle: 'leo@agent-office', timezone: 'PHT (UTC+8)', category: 'Internal Team', notes: 'AI agent — GitHub, Cloudflare Pages, frontend builds, bug fixes. Handles STZ Platform deploys with full autonomy.' },
  { id: '5', name: 'Mark', role: 'Macro Analyst (AI)', handle: 'mark@agent-office', timezone: 'PHT (UTC+8)', category: 'Internal Team', notes: 'AI agent — hourly macro scans, Fed/CPI alerts, bond yield analysis, weekly macro reports.' },
  { id: '6', name: 'Bryan', role: 'Social Media (AI)', handle: 'bryan@agent-office', timezone: 'PHT (UTC+8)', category: 'Internal Team', notes: 'AI agent — Facebook posts, video content pipeline, community management, engagement tracking.' },
  // Tools/Platforms
  { id: '7', name: 'InsForge', role: 'Database Platform', handle: 'v7r9ej7n.ap-southeast.insforge.app', timezone: 'Cloud', category: 'Tools', notes: 'Edge Functions + PostgreSQL. Tables: activity_feed_v2, agent_tasks.' },
  { id: '8', name: 'OpenClaw', role: 'Gateway & Agent Runtime', handle: 'localhost:18789', timezone: 'Local', category: 'Tools', notes: 'Agent orchestration, session management, cron jobs, WebSocket API for agent control.' },
  { id: '9', name: 'Cloudflare Pages', role: 'Hosting', handle: 'dash.cloudflare.com', timezone: 'Global CDN', category: 'Tools', notes: 'STZ Platform: stzsniper.com. Agent Office: agent-office.pages.dev. Auto-deploys from GitHub.' },
  { id: '10', name: 'GitHub', role: 'Version Control', handle: 'github.com/stzsniper', timezone: 'UTC', category: 'Tools', notes: 'Repos: smart-traderzone (STZ Platform), agent-office (Mission Control). Token-based auth.' },
];

const CATEGORIES = ['All', 'Internal Team', 'Tools'];
const CATEGORY_COLORS: Record<string, string> = {
  'Internal Team': 'bg-neon-green/20 text-neon-green',
  'Tools': 'bg-neon-blue/20 text-neon-blue',
};

export function ContactsScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<ContactItem | null>(null);

  const filtered = CONTACTS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || c.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-midnight-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search team, agents, tools..."
            className="w-full bg-midnight-800 border border-midnight-600/50 text-midnight-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-neon-green/30 placeholder:text-midnight-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              category === cat ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'text-midnight-400 hover:text-white hover:bg-midnight-800'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            className="bg-midnight-800/60 border border-midnight-700/40 rounded-xl p-4 cursor-pointer hover:border-neon-green/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-midnight-700 flex items-center justify-center text-lg font-bold text-midnight-300">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-neon-green transition-colors">{c.name}</h3>
                  <p className="text-xs text-midnight-400">{c.role}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-midnight-400">
                <MessageSquare className="w-3 h-3" />
                <span className="truncate">{c.handle}</span>
              </div>
              <div className="flex items-center gap-2 text-midnight-400">
                <Globe className="w-3 h-3" />
                <span>{c.timezone}</span>
              </div>
            </div>
            <span className={cn('inline-block mt-3 text-[10px] px-2 py-0.5 rounded-full font-medium', CATEGORY_COLORS[c.category] || 'bg-midnight-700 text-midnight-300')}>
              {c.category}
            </span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-midnight-800 border border-midnight-600/50 rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-midnight-700 flex items-center justify-center text-xl font-bold text-midnight-300">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                  <p className="text-sm text-midnight-400">{selected.role}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-midnight-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-midnight-400">Handle</span><span className="text-white text-right break-all ml-4">{selected.handle}</span></div>
              <div className="flex justify-between"><span className="text-midnight-400">Timezone</span><span className="text-white">{selected.timezone}</span></div>
              <div className="flex justify-between"><span className="text-midnight-400">Category</span><span className={cn('px-2 py-0.5 rounded-full text-xs', CATEGORY_COLORS[selected.category])}>{selected.category}</span></div>
              <div><span className="text-midnight-400 block mb-1">Notes</span><p className="text-midnight-200 bg-midnight-900 rounded-lg p-3 text-xs leading-relaxed">{selected.notes}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
