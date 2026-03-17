import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { Brain, Search, FileText, BookOpen, Lightbulb, Database, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface MemoryDoc {
  id: string;
  title: string;
  category: string;
  date: string;
  preview: string;
  content: string;
  agent?: string;
}

// Real documents for STZ Agent Office
const MEMORY_DOCS: MemoryDoc[] = [
  {
    id: '1',
    title: 'SNIPER Trading Rules',
    category: 'Trading',
    date: '2026-03-15',
    agent: 'SNIPER',
    preview: 'Core trading rules: 2% risk max, stop-loss required, 2:1 R/R minimum...',
    content: 'SNIPER Trading Rules\n\n1. Never risk more than 2% per trade\n2. Always set stop-loss before entry\n3. Take profit at 2:1 risk/reward minimum\n4. No trading during high-impact news without setup confirmation\n5. Maximum 3 concurrent positions\n6. Only trade SMC setups with HTF confirmation\n7. Daily loss limit: 5% of account\n8. Weekly review required every Sunday'
  },
  {
    id: '2',
    title: 'SMC Signal Methodology',
    category: 'Trading',
    date: '2026-03-14',
    agent: 'SNIPER',
    preview: 'Smart Money Concepts framework for signal generation...',
    content: 'SMC Signal Methodology\n\n1. Identify HTF market structure (H4/D1)\n2. Mark order blocks and liquidity zones\n3. Wait for sweep/displacement\n4. Enter on mitigation with LTF confirmation\n5. Target next liquidity pool\n\nFilters:\n- News: No trades 30min before/after high-impact\n- Session: Focus on London/NY overlap\n- Volume: Confirm with volume profile'
  },
  {
    id: '3',
    title: 'Brand Voice & Content Guidelines',
    category: 'Content',
    date: '2026-03-13',
    agent: 'Bryan',
    preview: 'Tone, style, and messaging guidelines for all STZ content...',
    content: 'Brand Voice Guidelines\n\nTone: Confident, knowledgeable, approachable\nStyle: Short sentences, active voice, data-backed\n\nDO:\n- Share real trade results (wins AND losses)\n- Educate on SMC concepts\n- Build community trust\n\nDON\'T:\n- Overpromise returns\n- Use FOMO language\n- Badmouth competitors\n- Make financial advice disclaimers'
  },
  {
    id: '4',
    title: 'Deployment Checklist (LEO)',
    category: 'DevOps',
    date: '2026-03-12',
    agent: 'LEO',
    preview: 'Pre-deployment checklist for Cloudflare Pages deploys...',
    content: 'Deployment Checklist\n\nPre-deploy:\n☐ Run `npm run build` — no errors\n☐ Check bundle size < 500KB\n☐ Verify environment variables\n☐ Test in local preview\n☐ Create git commit with clear message\n\nDeploy:\n☐ Push to main branch\n☐ Verify Cloudflare build succeeds\n☐ Check deployed URL\n☐ Test critical paths\n\nRollback:\n☐ Revert commit if issues\n☐ Force push to trigger rebuild'
  },
  {
    id: '5',
    title: 'InsForge Schema Reference',
    category: 'Technical',
    date: '2026-03-11',
    agent: 'Jarvis',
    preview: 'Database schema for all InsForge tables used by Agent Office...',
    content: 'InsForge Tables\n\nactivity_feed_v2\n- agent: string\n- action: string\n- details: string\n- status: success/error/pending\n- created_at: timestamp\n\nagent_tasks\n- agent: string\n- task: string\n- status: pending/in_progress/completed/failed\n- started_at, completed_at: timestamp\n- duration_ms: number\n- result: text'
  },
  {
    id: '6',
    title: 'Mark: Macro Scan Template',
    category: 'Process',
    date: '2026-03-10',
    agent: 'Mark',
    preview: 'Standard template for hourly macro scans and weekly reports...',
    content: 'Macro Scan Template\n\n1. USD Index (DXY)\n   - Current level, trend direction\n   - Key support/resistance\n\n2. Bond Yields\n   - US 10Y yield\n   - 2Y-10Y spread (recession signal)\n\n3. Crypto Market\n   - BTC market structure\n   - ETH/BTC ratio\n   - Total market cap trend\n\n4. Key Events This Week\n   - Fed speakers\n   - CPI/PPI releases\n   - NFP dates\n\n5. Risk Score: [1-10]'
  },
  {
    id: '7',
    title: 'OpenClaw Agent Configuration',
    category: 'Technical',
    date: '2026-03-09',
    agent: 'Jarvis',
    preview: 'How to configure agents in OpenClaw — bindings, sessions, cron...',
    content: 'OpenClaw Configuration\n\nAgent Structure:\n- Each agent: workspace + state dir + session store\n- Bindings route messages by channel/peer/account\n- Agent-to-agent via sessions_spawn\n\nKey APIs:\n- sessions.list → active sessions\n- sessions.spawn → create task\n- cron.list/run → scheduled tasks\n\nConfig: openclaw.json\n- agents: define agent workspaces\n- bindings: route to correct agent\n- cron: scheduled jobs'
  },
  {
    id: '8',
    title: 'STZ Platform Architecture',
    category: 'Technical',
    date: '2026-03-08',
    agent: 'LEO',
    preview: 'Architecture overview for stzsniper.com — Cloudflare Pages + InsForge...',
    content: 'STZ Platform Architecture\n\nFrontend:\n- React + Vite + Tailwind\n- Deployed to Cloudflare Pages\n- Domain: stzsniper.com\n\nBackend:\n- InsForge (Edge Functions + PostgreSQL)\n- API: v7r9ej7n.ap-southeast.insforge.app\n\nAgent Office:\n- Separate project: agent-office\n- Deployed to mission-control.pages.dev\n- Connects to same InsForge instance'
  },
];

const CATEGORIES = ['All', 'Trading', 'Content', 'DevOps', 'Process', 'Technical'];
const CATEGORY_ICONS: Record<string, typeof Brain> = {
  Trading: TrendingUp,
  Content: FileText,
  DevOps: Database,
  Process: Lightbulb,
  Technical: Shield,
};

export function MemoryScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<MemoryDoc | null>(null);

  const filtered = MEMORY_DOCS.filter(doc => {
    const matchSearch = !search || doc.title.toLowerCase().includes(search.toLowerCase()) || doc.preview.toLowerCase().includes(search.toLowerCase()) || doc.content.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || doc.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 text-midnight-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search memory — trading rules, deploy checklists, brand guides..."
          className="w-full bg-midnight-800 border border-midnight-600/50 text-midnight-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-neon-green/30 placeholder:text-midnight-600"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
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
        {filtered.map(doc => {
          const Icon = CATEGORY_ICONS[doc.category] || FileText;
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-midnight-800/60 border border-midnight-700/40 rounded-xl p-4 cursor-pointer hover:border-neon-green/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className="w-4 h-4 text-neon-green/60" />
                <span className="text-[10px] text-midnight-500">{doc.date}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-neon-green transition-colors">{doc.title}</h3>
              <p className="text-xs text-midnight-400 line-clamp-2 mb-3">{doc.preview}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-midnight-700/50 text-midnight-300">{doc.category}</span>
                {doc.agent && <span className="text-[10px] text-midnight-500">{doc.agent}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-midnight-500">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No documents found</p>
        </div>
      )}

      {selectedDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDoc(null)}>
          <div className="bg-midnight-800 border border-midnight-600/50 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{selectedDoc.title}</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-midnight-400 hover:text-white text-xl">&times;</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs px-2 py-0.5 rounded-full bg-midnight-700/50 text-midnight-300">{selectedDoc.category}</span>
              {selectedDoc.agent && <span className="text-xs text-midnight-400">{selectedDoc.agent}</span>}
              <span className="text-xs text-midnight-500">{selectedDoc.date}</span>
            </div>
            <div className="text-sm text-midnight-200 whitespace-pre-wrap leading-relaxed">{selectedDoc.content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
