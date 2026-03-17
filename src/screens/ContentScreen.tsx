import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { Film, Plus, ExternalLink, Calendar as CalIcon, Video, FileText, Image } from 'lucide-react';
import { useState } from 'react';

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  status: string;
  assignedDay?: string;
  link?: string;
  type: 'video' | 'post' | 'article';
}

const COLUMNS = [
  { id: 'research', label: 'Research', color: 'text-neon-blue' },
  { id: 'scripting', label: 'Scripting', color: 'text-neon-purple' },
  { id: 'design', label: 'Design', color: 'text-neon-orange' },
  { id: 'review', label: 'Review', color: 'text-neon-yellow' },
  { id: 'scheduled', label: 'Scheduled', color: 'text-neon-green' },
  { id: 'published', label: 'Published', color: 'text-neon-green' },
  { id: 'analytics', label: 'Analytics', color: 'text-midnight-200' },
];

const PLATFORM_COLORS: Record<string, string> = {
  Facebook: 'bg-blue-600/20 text-blue-400',
  YouTube: 'bg-red-500/20 text-red-400',
  TikTok: 'bg-cyan-500/20 text-cyan-400',
  Instagram: 'bg-pink-500/20 text-pink-400',
  Twitter: 'bg-blue-400/20 text-blue-300',
};

const TYPE_ICONS: Record<string, typeof Video> = {
  video: Video,
  post: FileText,
  article: Image,
};

// Bryan's actual content pipeline
const CONTENT_PIPELINE: ContentItem[] = [
  { id: '1', title: 'Weekly Trading Recap Video', platform: 'YouTube', status: 'research', assignedDay: 'Monday', type: 'video' },
  { id: '2', title: 'SNIPER Signal Breakdown', platform: 'Facebook', status: 'scripting', assignedDay: 'Tuesday', type: 'video' },
  { id: '3', title: 'Macro Monday Reel', platform: 'Facebook', status: 'design', assignedDay: 'Monday', type: 'video' },
  { id: '4', title: 'Market Structure Explainer', platform: 'YouTube', status: 'review', assignedDay: 'Wednesday', type: 'video' },
  { id: '5', title: 'Daily Market Update', platform: 'Facebook', status: 'scheduled', assignedDay: 'Daily', type: 'post' },
  { id: '6', title: 'Agent Office Announcement', platform: 'Facebook', status: 'published', type: 'post' },
  { id: '7', title: 'Trading Tips Carousel', platform: 'Instagram', status: 'analytics', type: 'post', link: 'https://instagram.com' },
  { id: '8', title: 'SNIPER Win Streak Highlight', platform: 'TikTok', status: 'research', type: 'video' },
];

const WEEKLY_SCHEDULE = [
  { day: 'Monday', theme: 'Macro Monday — Weekly market overview & key levels', icon: '📊' },
  { day: 'Tuesday', theme: 'Tech Tuesday — SNIPER signal breakdowns & setups', icon: '🎯' },
  { day: 'Wednesday', theme: 'Win Wednesday — Trade recaps & performance', icon: '🏆' },
  { day: 'Thursday', theme: 'Throwback Thursday — Lessons from past trades', icon: '📚' },
  { day: 'Friday', theme: 'Flash Friday — Week recap & weekend predictions', icon: '⚡' },
  { day: 'Weekend', theme: 'Community — Q&A, polls, engagement content', icon: '💬' },
];

export function ContentScreen() {
  const [view, setView] = useState<'kanban' | 'schedule'>('kanban');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setView('kanban')} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all', view === 'kanban' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'text-midnight-400 hover:text-white')}>
            Pipeline
          </button>
          <button onClick={() => setView('schedule')} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all', view === 'schedule' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'text-midnight-400 hover:text-white')}>
            Weekly Schedule
          </button>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-medium hover:bg-neon-green/20">
          <Plus className="w-4 h-4" /> New Content
        </button>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto">
          {COLUMNS.map(col => {
            const items = CONTENT_PIPELINE.filter(c => c.status === col.id);
            return (
              <div key={col.id} className="space-y-2 min-w-[160px]">
                <div className="flex items-center gap-2 px-1">
                  <span className={cn('text-[10px] font-semibold uppercase tracking-wider', col.color)}>{col.label}</span>
                  <span className="text-[10px] text-midnight-500">({items.length})</span>
                </div>
                <div className="bg-midnight-900/30 rounded-xl p-2 min-h-[250px] space-y-2">
                  {items.map(item => {
                    const TypeIcon = TYPE_ICONS[item.type] || FileText;
                    return (
                      <div key={item.id} className="bg-midnight-800/60 border border-midnight-700/30 rounded-lg p-2.5 hover:border-neon-green/20 transition-all cursor-pointer">
                        <div className="flex items-start gap-2 mb-1.5">
                          <TypeIcon className="w-3 h-3 text-midnight-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-white font-medium leading-tight">{item.title}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', PLATFORM_COLORS[item.platform] || 'bg-midnight-600 text-midnight-300')}>
                            {item.platform}
                          </span>
                        </div>
                        {item.assignedDay && <p className="text-[10px] text-midnight-500 mt-1.5">📅 {item.assignedDay}</p>}
                        {item.link && <ExternalLink className="w-3 h-3 text-midnight-500 mt-1" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card title="Bryan's Weekly Posting Schedule" icon={<CalIcon className="w-4 h-4" />}>
          <div className="space-y-2">
            {WEEKLY_SCHEDULE.map(s => (
              <div key={s.day} className="flex items-center gap-4 p-3 rounded-lg bg-midnight-900/40 border border-midnight-800/30">
                <span className="text-lg">{s.icon}</span>
                <span className="text-sm font-semibold text-neon-green w-28">{s.day}</span>
                <span className="text-sm text-midnight-200">{s.theme}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
