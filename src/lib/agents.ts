// Agent Office Configuration
// Add agents here → rooms appear automatically in the office

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  room: number;                    // Room number in the office
  floor: 'executive' | 'team';     // Executive floor = leadership, Team floor = operators
  monitorCount: 2 | 3;
  screenContent: 'command' | 'charts' | 'code' | 'news' | 'social' | 'research' | 'support';
  deskItems: string[];
  responsibilities: string[];
  tools?: string[];                // Tools this agent uses
  maxTasks?: number;               // Concurrent task limit
  priority?: number;               // Display priority (lower = first)
}

// Current agents (edit this to add/remove agents)
export const AGENTS: AgentConfig[] = [
  {
    id: 'jarvis',
    name: 'Jarvis',
    role: 'General Manager',
    emoji: '🤖',
    color: '#00ff88',
    room: 101,
    floor: 'executive',
    monitorCount: 2,
    screenContent: 'command',
    deskItems: ['📋', '🔑', '☕'],
    responsibilities: [
      'Coordinate all agent operations',
      'Handle user requests via Telegram',
      'Monitor system health & uptime',
      'Generate daily reports',
      'Manage InsForge database',
      'Gatekeeper for platform changes',
    ],
    tools: ['Telegram', 'InsForge', 'All Agents'],
    priority: 1,
  },
  {
    id: 'sniper',
    name: 'SNIPER',
    role: 'Trading Engine',
    emoji: '🎯',
    color: '#00d4ff',
    room: 201,
    floor: 'team',
    monitorCount: 3,
    screenContent: 'charts',
    deskItems: ['📈', '🎯', '☕'],
    responsibilities: [
      'Execute SMC crypto trading signals',
      'Monitor open positions',
      'Run strategy backtests',
      'Risk management (2% max per trade)',
      'Track portfolio P&L',
    ],
    tools: ['TradingView', 'InsForge'],
    priority: 2,
  },
  {
    id: 'leo',
    name: 'LEO',
    role: 'DevOps & Frontend',
    emoji: '🛠️',
    color: '#ff6b35',
    room: 202,
    floor: 'team',
    monitorCount: 3,
    screenContent: 'code',
    deskItems: ['🔧', '⚡', '☕'],
    responsibilities: [
      'Deploy to Cloudflare Pages',
      'Manage GitHub repositories',
      'Build & fix frontend features',
      'Monitor CI/CD pipelines',
      'Infrastructure & uptime monitoring',
    ],
    tools: ['GitHub', 'Cloudflare', 'npm'],
    priority: 3,
  },
  {
    id: 'mark',
    name: 'Mark',
    role: 'Macro Analyst',
    emoji: '📊',
    color: '#a855f7',
    room: 203,
    floor: 'team',
    monitorCount: 2,
    screenContent: 'news',
    deskItems: ['📰', '🌍', '☕'],
    responsibilities: [
      'Hourly macro market scans',
      'Fed & CPI event alerts',
      'Bond yield & DXY analysis',
      'Crypto market structure reports',
      'Weekly macro report generation',
    ],
    tools: ['Web Search', 'InsForge'],
    priority: 4,
  },
  {
    id: 'bryan',
    name: 'Bryan',
    role: 'Social Media Manager',
    emoji: '📱',
    color: '#ffd700',
    room: 204,
    floor: 'team',
    monitorCount: 2,
    screenContent: 'social',
    deskItems: ['📱', '🎬', '☕'],
    responsibilities: [
      'Manage Facebook posting schedule',
      'Run video content pipeline',
      'Generate social media content',
      'Track engagement metrics',
      'Community management',
    ],
    tools: ['Facebook API', 'InsForge'],
    priority: 5,
  },
];

// Empty room slots for future expansion
// Room numbers follow: 101-199 = executive, 201-299 = team, 301-399 = support, etc.
export const MAX_ROOMS_PER_FLOOR = 20;

// Get room number for next agent on a floor
export function getNextRoom(floor: 'executive' | 'team' | 'support'): number {
  const floorPrefix = floor === 'executive' ? 100 : floor === 'team' ? 200 : 300;
  const occupiedRooms = AGENTS.filter(a => a.floor === floor).map(a => a.room);
  
  for (let i = 1; i <= MAX_ROOMS_PER_FLOOR; i++) {
    const roomNum = floorPrefix + i;
    if (!occupiedRooms.includes(roomNum)) return roomNum;
  }
  return floorPrefix + MAX_ROOMS_PER_FLOOR + 1; // Overflow
}

// Get all rooms on a floor (occupied + empty)
export function getFloorRooms(floor: 'executive' | 'team') {
  const floorPrefix = floor === 'executive' ? 100 : 200;
  const occupiedRooms = AGENTS.filter(a => a.floor === floor);
  const maxOccupied = Math.max(...occupiedRooms.map(a => a.room), floorPrefix);
  const totalRooms = Math.max(maxOccupied - floorPrefix + 2, 4); // Always show 2 empty slots minimum
  
  const rooms: (AgentConfig | { empty: true; room: number })[] = [];
  
  for (let i = 1; i <= totalRooms; i++) {
    const roomNum = floorPrefix + i;
    const agent = occupiedRooms.find(a => a.room === roomNum);
    if (agent) {
      rooms.push(agent);
    } else {
      rooms.push({ empty: true, room: roomNum });
    }
  }
  
  return rooms;
}

// Status types
export type AgentStatus = 'idle' | 'busy' | 'error' | 'offline';

export const STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; emoji: string }> = {
  idle: { label: 'Working', color: '#00ff88', emoji: '✨' },
  busy: { label: 'Busy', color: '#ffd700', emoji: '⚡' },
  error: { label: 'Error', color: '#ff3366', emoji: '🚨' },
  offline: { label: 'Offline', color: '#536397', emoji: '💤' },
};

// Screen content patterns
export const SCREEN_PATTERNS: Record<string, { name: string; description: string }> = {
  command: { name: 'Command Center', description: 'Dashboard overview with all metrics' },
  charts: { name: 'Trading Charts', description: 'Live market data and candlesticks' },
  code: { name: 'Code Editor', description: 'Deployment and build status' },
  news: { name: 'News Feed', description: 'Fed, CPI, and macro alerts' },
  social: { name: 'Social Media', description: 'Content queue and engagement' },
  research: { name: 'Research', description: 'Data analysis and reports' },
  support: { name: 'Support', description: 'Help desk and tickets' },
};
