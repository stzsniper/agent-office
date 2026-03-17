# Agent Office — Mission Control

**The Agent Office IS the Mission Control Command Center.**

One unified system where all agents work and Willy monitors/commands them from a single place.

## Agents

| Agent | Role | Emoji |
|-------|------|-------|
| Jarvis | General Manager | 🤖 |
| SNIPER | Trading Engine | 🎯 |
| LEO | DevOps & Frontend | 🛠️ |
| Mark | Macro Analysis | 📊 |
| Bryan | Social Media | 📱 |

## Features

- **Agent Status** — Live status (idle/busy/error/offline), current task, last active, daily stats
- **Activity Feed** — Real-time feed from InsForge, filterable by agent, auto-refresh 15s
- **Task Queue** — Full task management with status tracking and expandable details
- **Quick Actions** — One-click task triggers for any agent
- **Stats Dashboard** — Aggregate metrics: pending, in-progress, completed, failed, success rate

## Tech Stack

- React 18 + TypeScript
- Vite + Tailwind CSS (dark cyberpunk theme)
- TanStack React Query (auto-refresh)
- Lucide React (icons)
- InsForge API (backend)

## Commands

```bash
npm install --include=dev   # Install dependencies
npm run dev                 # Dev server on port 5180
npm run build               # Production build
npm run deploy              # Deploy to Cloudflare Pages
```

## Deploy

Requires `CLOUDFLARE_API_TOKEN`:

```bash
export CLOUDFLARE_API_TOKEN=your-token
npm run deploy
```

Deploys to: `mission-control.pages.dev` (separate from stzsniper.com)

## Architecture

```
src/
├── components/
│   ├── Header.tsx          # Agent Office branding + live clock
│   ├── AgentCard.tsx       # Individual agent status cards
│   ├── ActivityFeed.tsx    # Real-time activity stream
│   ├── TaskQueue.tsx       # Task management table
│   ├── QuickActions.tsx    # One-click agent triggers
│   └── StatsBar.tsx        # Aggregate metrics
├── pages/
│   └── Dashboard.tsx       # Main layout
├── hooks/
│   └── useInsForge.ts      # React Query data hooks
└── lib/
    ├── insforge.ts         # API client + types
    └── utils.ts            # Formatting helpers
```
