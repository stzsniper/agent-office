// InsForge configuration for Mission Control
const INSFORGE_URL = 'https://v7r9ej7n.ap-southeast.insforge.app';
const INSFORGE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTY4NzV9.nK8Zdiz-Yjxfjk5e9-OccabLX_gwt-VNXAjUlhUg0MA';

interface InsForgeResponse<T = unknown> {
  data: T | null;
  error: { message: string } | null;
}

async function insFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<InsForgeResponse<T>> {
  try {
    const res = await fetch(`${INSFORGE_URL}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': INSFORGE_ANON_KEY,
        'Authorization': `Bearer ${INSFORGE_ANON_KEY}`,
        'Prefer': 'return=representation',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      return { data: null, error: { message: err.message || 'Request failed' } };
    }

    const data = await res.json();
    return { data: data as T, error: null };
  } catch (e) {
    return { data: null, error: { message: (e as Error).message } };
  }
}

// ─── Types ────────────────────────────────────────────────────────────

export interface AgentTask {
  id?: string;
  agent: string;
  task: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  result?: string;
  session_key?: string;
  created_at?: string;
}

export interface ActivityItem {
  id?: string;
  agent: string;
  action: string;
  details?: string;
  status?: string;
  created_at?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentStatus {
  name: string;
  role: string;
  emoji: string;
  status: 'idle' | 'busy' | 'error' | 'offline';
  currentTask?: string;
  lastActive?: string;
  tasksToday: number;
  successRate: number;
}

// ─── API Functions ────────────────────────────────────────────────────

export async function getActivityFeed(limit = 50, agent?: string) {
  let query = `activity_feed_v2?select=*&order=created_at.desc&limit=${limit}`;
  if (agent) {
    query += `&agent=eq.${agent}`;
  }
  return insFetch<ActivityItem[]>(query);
}

export async function getTasks(limit = 50, status?: string) {
  let query = `agent_tasks?select=*&order=created_at.desc&limit=${limit}`;
  if (status) {
    query += `&status=eq.${status}`;
  }
  return insFetch<AgentTask[]>(query);
}

export async function createTask(task: Omit<AgentTask, 'id' | 'created_at'>) {
  return insFetch<AgentTask[]>('agent_tasks', {
    method: 'POST',
    body: JSON.stringify([task]),
  });
}

export async function updateTask(id: string, updates: Partial<AgentTask>) {
  return insFetch<AgentTask[]>(`agent_tasks?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function getTaskStats() {
  // Get tasks from last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  return insFetch<AgentTask[]>(
    `agent_tasks?select=*&started_at=gte.${sevenDaysAgo}&order=started_at.desc`
  );
}

export async function getTodayActivityCount(agent: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return insFetch<AgentTask[]>(
    `agent_tasks?select=id&agent=eq.${agent}&started_at=gte.${today.toISOString()}`
  );
}

// ─── Agent Definitions ────────────────────────────────────────────────

export const AGENTS: Omit<AgentStatus, 'status' | 'currentTask' | 'lastActive' | 'tasksToday' | 'successRate'>[] = [
  { name: 'Jarvis', role: 'General Manager', emoji: '🤖' },
  { name: 'SNIPER', role: 'Trading Engine', emoji: '🎯' },
  { name: 'LEO', role: 'DevOps & Frontend', emoji: '🛠️' },
  { name: 'Mark', role: 'Macro Analysis', emoji: '📊' },
  { name: 'Bryan', role: 'Social Media', emoji: '📱' },
];
