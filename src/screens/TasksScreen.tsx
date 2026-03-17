import { Card } from '@/components/Card';
import { useTasks, useUpdateTask } from '@/hooks/useInsForge';
import { AgentTask } from '@/lib/insforge';
import { AGENTS } from '@/lib/agents';
import { cn, formatTimeAgo } from '@/lib/utils';
import { ListTodo, Filter, GripVertical, X, Zap } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ColumnId = 'backlog' | 'in_progress' | 'review' | 'done';

const COLUMNS: { id: ColumnId; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-midnight-300' },
  { id: 'in_progress', label: 'In Progress', color: 'text-neon-blue' },
  { id: 'review', label: 'Review', color: 'text-neon-yellow' },
  { id: 'done', label: 'Done', color: 'text-neon-green' },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-midnight-600/50 text-midnight-300',
  medium: 'bg-neon-blue/20 text-neon-blue',
  high: 'bg-neon-orange/20 text-neon-orange',
  urgent: 'bg-neon-red/20 text-neon-red',
};

// Real task categories for STZ
const TASK_TAGS: Record<string, { label: string; color: string }> = {
  'SNIPER': { label: 'Trading', color: 'bg-neon-blue/20 text-neon-blue' },
  'Mark': { label: 'Macro', color: 'bg-neon-purple/20 text-neon-purple' },
  'LEO': { label: 'DevOps', color: 'bg-neon-orange/20 text-neon-orange' },
  'Bryan': { label: 'Content', color: 'bg-neon-yellow/20 text-neon-yellow' },
  'Jarvis': { label: 'Platform', color: 'bg-neon-green/20 text-neon-green' },
};

function TaskCard({ task, onClick }: { task: AgentTask; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id! });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const priority = (task as any).priority || 'medium';
  const tag = TASK_TAGS[task.agent] || TASK_TAGS['Jarvis'];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-midnight-900/60 border border-midnight-700/30 rounded-lg p-3 cursor-pointer hover:border-neon-green/20 transition-all',
        isDragging && 'opacity-50'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-midnight-600 hover:text-midnight-400 cursor-grab">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">{task.task}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', tag.color)}>
              {tag.label}
            </span>
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', PRIORITY_COLORS[priority])}>
              {priority}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-midnight-500">{task.agent}</span>
            {task.started_at && <span className="text-[10px] text-midnight-600">{formatTimeAgo(task.started_at)}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskDetail({ task, onClose }: { task: AgentTask; onClose: () => void }) {
  const updateTask = useUpdateTask();

  const handleStatusChange = (status: string) => {
    if (!task.id) return;
    const updates: any = { status };
    if (status === 'completed') updates.completed_at = new Date().toISOString();
    updateTask.mutate({ id: task.id, updates });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-midnight-800 border border-midnight-600/50 rounded-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{task.task}</h3>
          <button onClick={onClose} className="text-midnight-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-midnight-400">Assigned Agent</span><span className="text-white">{task.agent} {AGENTS.find(a => a.name === task.agent)?.emoji}</span></div>
          <div className="flex justify-between"><span className="text-midnight-400">Status</span><span className="text-white capitalize">{task.status.replace('_', ' ')}</span></div>
          {task.started_at && <div className="flex justify-between"><span className="text-midnight-400">Started</span><span className="text-white">{formatTimeAgo(task.started_at)}</span></div>}
          {task.duration_ms && <div className="flex justify-between"><span className="text-midnight-400">Duration</span><span className="text-white">{(task.duration_ms / 1000).toFixed(1)}s</span></div>}
          {task.result && <div><span className="text-midnight-400 block mb-1">Result</span><p className="text-midnight-200 bg-midnight-900 rounded p-3">{task.result}</p></div>}
        </div>
        <div className="flex gap-2 mt-6">
          {task.status !== 'completed' && <button onClick={() => handleStatusChange('completed')} className="flex-1 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-medium hover:bg-neon-green/20">Mark Complete</button>}
          {task.status !== 'failed' && <button onClick={() => handleStatusChange('failed')} className="flex-1 py-2 rounded-lg bg-neon-red/10 border border-neon-red/30 text-neon-red text-sm font-medium hover:bg-neon-red/20">Mark Failed</button>}
        </div>
      </div>
    </div>
  );
}

export function TasksScreen() {
  const { data: tasks } = useTasks(200);
  const [filter, setFilter] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateTask = useUpdateTask();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (filter) return tasks.filter(t => t.agent === filter);
    return tasks;
  }, [tasks, filter]);

  const columnTasks = useMemo(() => {
    const map: Record<ColumnId, AgentTask[]> = { backlog: [], in_progress: [], review: [], done: [] };
    filteredTasks.forEach(t => {
      if (t.status === 'pending') map.backlog.push(t);
      else if (t.status === 'in_progress') map.in_progress.push(t);
      else if (t.status === 'failed') map.review.push(t);
      else if (t.status === 'completed') map.done.push(t);
    });
    return map;
  }, [filteredTasks]);

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let targetColumn: ColumnId | null = null;
    for (const col of COLUMNS) {
      if (col.id === over.id || columnTasks[col.id].some(t => t.id === over.id)) {
        targetColumn = col.id;
        break;
      }
    }
    if (!targetColumn) return;

    const statusMap: Record<ColumnId, string> = { backlog: 'pending', in_progress: 'in_progress', review: 'failed', done: 'completed' };
    updateTask.mutate({ id: active.id as string, updates: { status: statusMap[targetColumn] as any } });
  };

  const activeTask = activeId ? filteredTasks.find(t => t.id === activeId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-midnight-400" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-midnight-800 border border-midnight-600/50 text-midnight-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-neon-green/30">
          <option value="">All Agents</option>
          {AGENTS.map(a => <option key={a.name} value={a.name}>{a.emoji} {a.name} — {a.role}</option>)}
        </select>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className={cn('text-xs font-semibold uppercase tracking-wider', col.color)}>{col.label}</span>
                <span className="text-xs text-midnight-500">({columnTasks[col.id].length})</span>
              </div>
              <div className="bg-midnight-900/30 rounded-xl p-3 min-h-[400px] space-y-2">
                <SortableContext items={columnTasks[col.id].map(t => t.id!)} strategy={verticalListSortingStrategy}>
                  {columnTasks[col.id].map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                  ))}
                </SortableContext>
                {columnTasks[col.id].length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-midnight-600">
                    <ListTodo className="w-6 h-6 mb-2 opacity-40" />
                    <p className="text-xs">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <DragOverlay>{activeTask && <TaskCard task={activeTask} onClick={() => {}} />}</DragOverlay>
      </DndContext>

      {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}
