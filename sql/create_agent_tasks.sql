-- Agent Tasks table for Mission Control
-- Run this via InsForge MCP or admin panel

CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent VARCHAR(50) NOT NULL,
  task TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN completed_at IS NOT NULL AND started_at IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (completed_at - started_at)) * 1000 
      ELSE NULL 
    END
  ) STORED,
  result TEXT,
  session_key VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent ON agent_tasks(agent);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_started ON agent_tasks(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created ON agent_tasks(created_at DESC);

-- Enable RLS
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;

-- Allow anon read (for dashboard)
CREATE POLICY "Allow anon read" ON agent_tasks FOR SELECT USING (true);

-- Allow anon insert (for quick actions)
CREATE POLICY "Allow anon insert" ON agent_tasks FOR INSERT WITH CHECK (true);

-- Allow anon update (for marking complete)
CREATE POLICY "Allow anon update" ON agent_tasks FOR UPDATE USING (true);
