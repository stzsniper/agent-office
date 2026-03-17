// Real agent definitions for STZ Agent Office
export const AGENTS = [
  {
    name: 'Jarvis',
    role: 'General Manager',
    emoji: '🤖',
    color: '#00ff88',
    responsibilities: [
      'Coordinate all agent operations',
      'Handle user requests via Telegram',
      'Monitor system health & uptime',
      'Generate daily reports',
      'Manage InsForge database',
      'Gatekeeper for platform changes',
    ],
  },
  {
    name: 'SNIPER',
    role: 'Trading Engine',
    emoji: '🎯',
    color: '#00d4ff',
    responsibilities: [
      'Execute SMC crypto trading signals',
      'Monitor open positions',
      'Run strategy backtests',
      'Risk management (2% max per trade)',
      'Track portfolio P&L',
      'Alert on high-probability setups',
    ],
  },
  {
    name: 'LEO',
    role: 'DevOps & Frontend',
    emoji: '🛠️',
    color: '#ff6b35',
    responsibilities: [
      'Deploy to Cloudflare Pages',
      'Manage GitHub repositories',
      'Build & fix frontend features',
      'Monitor CI/CD pipelines',
      'Infrastructure & uptime monitoring',
      'Bug fixes across all projects',
    ],
  },
  {
    name: 'Mark',
    role: 'Macro Analyst',
    emoji: '📊',
    color: '#a855f7',
    responsibilities: [
      'Hourly macro market scans',
      'Fed & CPI event alerts',
      'Bond yield & DXY analysis',
      'Crypto market structure reports',
      'Weekly macro report generation',
      'Risk assessment scoring',
    ],
  },
  {
    name: 'Bryan',
    role: 'Social Media Manager',
    emoji: '📱',
    color: '#ffd700',
    responsibilities: [
      'Manage Facebook posting schedule',
      'Run video content pipeline',
      'Generate social media content',
      'Track engagement metrics',
      'Community management',
      'Content calendar maintenance',
    ],
  },
];

export const PROJECTS = [
  { name: 'STZ Platform', url: 'stzsniper.com', color: '#00ff88' },
  { name: 'Agent Office', url: 'Mission Control', color: '#00d4ff' },
  { name: 'SNIPER Trading', url: 'Trading System', color: '#a855f7' },
  { name: 'Bryan Video Pipeline', url: 'Content System', color: '#ffd700' },
];

export const INTEGRATIONS = [
  { name: 'InsForge', description: 'Database & API backend', icon: '🔥' },
  { name: 'OpenClaw', description: 'Gateway, sessions, cron', icon: '🦞' },
  { name: 'Cloudflare Pages', description: 'Hosting & deployment', icon: '☁️' },
  { name: 'GitHub', description: 'Version control & CI/CD', icon: '🐙' },
  { name: 'Telegram', description: 'Notifications & commands', icon: '📱' },
];
