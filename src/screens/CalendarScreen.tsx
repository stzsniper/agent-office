import { cn } from '@/lib/utils';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { useState } from 'react';
import { Card } from '@/components/Card';
import { X } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'trading' | 'content' | 'macro' | 'cron' | 'deploy' | 'meeting';
  agent?: string;
}

// Real scheduled events for STZ
const now = new Date();
const MOCK_EVENTS: CalEvent[] = [
  // SNIPER cron jobs
  { id: '1', title: 'SNIPER Daily Market Scan', start: new Date(now.setHours(8, 0, 0, 0)), end: new Date(now.setHours(8, 30, 0, 0)), type: 'cron', agent: 'SNIPER' },
  { id: '2', title: 'SNIPER Position Check', start: new Date(Date.now() + 3600000 * 4), end: new Date(Date.now() + 3600000 * 4.5), type: 'trading', agent: 'SNIPER' },
  // Mark's macro schedule
  { id: '3', title: 'Mark: Hourly Macro Scan', start: new Date(Date.now() + 3600000), end: new Date(Date.now() + 3600000 * 1.25), type: 'macro', agent: 'Mark' },
  { id: '4', title: 'Mark: Weekly Macro Report', start: new Date(Date.now() + 86400000 * 2), end: new Date(Date.now() + 86400000 * 2 + 3600000), type: 'macro', agent: 'Mark' },
  // Bryan's content schedule
  { id: '5', title: 'Bryan: Macro Monday Video', start: new Date(Date.now() + 86400000), end: new Date(Date.now() + 86400000 + 3600000), type: 'content', agent: 'Bryan' },
  { id: '6', title: 'Bryan: Daily Facebook Post', start: new Date(Date.now() + 86400000), end: new Date(Date.now() + 86400000 + 1800000), type: 'content', agent: 'Bryan' },
  { id: '7', title: 'Bryan: Weekly Video Publish', start: new Date(Date.now() + 86400000 * 3), end: new Date(Date.now() + 86400000 * 3 + 3600000), type: 'content', agent: 'Bryan' },
  // LEO's deploy schedule
  { id: '8', title: 'LEO: Agent Office Deploy', start: new Date(Date.now() + 3600000 * 2), end: new Date(Date.now() + 3600000 * 2.5), type: 'deploy', agent: 'LEO' },
  // Jarvis reports
  { id: '9', title: 'Jarvis: Daily Status Report', start: new Date(Date.now() + 86400000), end: new Date(Date.now() + 86400000 + 1800000), type: 'cron', agent: 'Jarvis' },
  { id: '10', title: 'Jarvis: Weekly Summary', start: new Date(Date.now() + 86400000 * 4), end: new Date(Date.now() + 86400000 * 4 + 3600000), type: 'cron', agent: 'Jarvis' },
];

const EVENT_COLORS: Record<string, string> = {
  trading: '#00d4ff',
  content: '#ffd700',
  macro: '#a855f7',
  cron: '#00ff88',
  deploy: '#ff6b35',
  meeting: '#ff3366',
};

export function CalendarScreen() {
  const [view, setView] = useState<any>(Views.WEEK);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);

  const eventStyleGetter = (event: CalEvent) => ({
    style: {
      backgroundColor: EVENT_COLORS[event.type] + '30',
      borderLeft: `3px solid ${EVENT_COLORS[event.type]}`,
      color: '#f0f1f5',
      borderRadius: '4px',
      fontSize: '11px',
      padding: '2px 6px',
    },
  });

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap">
        {Object.entries(EVENT_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-midnight-300 capitalize">{type}</span>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="p-4" style={{ height: '600px' }}>
          <BigCalendar
            localizer={localizer}
            events={MOCK_EVENTS}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(e) => setSelectedEvent(e as CalEvent)}
            style={{ height: '100%' }}
            className="mission-calendar"
          />
        </div>
      </Card>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-midnight-800 border border-midnight-600/50 rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} className="text-midnight-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {selectedEvent.agent && <div className="flex justify-between"><span className="text-midnight-400">Agent</span><span className="text-white">{selectedEvent.agent}</span></div>}
              <div className="flex justify-between"><span className="text-midnight-400">Type</span><span className="capitalize" style={{ color: EVENT_COLORS[selectedEvent.type] }}>{selectedEvent.type}</span></div>
              <div className="flex justify-between"><span className="text-midnight-400">Start</span><span className="text-white">{moment(selectedEvent.start).format('MMM D, h:mm A')}</span></div>
              <div className="flex justify-between"><span className="text-midnight-400">End</span><span className="text-white">{moment(selectedEvent.end).format('MMM D, h:mm A')}</span></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mission-calendar { color: #d4d8e5; }
        .mission-calendar .rbc-toolbar { margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .mission-calendar .rbc-toolbar button { color: #7e8ab1; border: 1px solid #18244b; background: #101832; padding: 4px 12px; border-radius: 6px; font-size: 12px; }
        .mission-calendar .rbc-toolbar button:hover { color: #00ff88; border-color: #00ff8830; }
        .mission-calendar .rbc-toolbar button.rbc-active { background: #00ff8815; color: #00ff88; border-color: #00ff8840; }
        .mission-calendar .rbc-toolbar-label { color: #f0f1f5; font-weight: 600; }
        .mission-calendar .rbc-header { color: #7e8ab1; font-size: 11px; padding: 8px 0; border-bottom: 1px solid #18244b; }
        .mission-calendar .rbc-month-view { border-color: #18244b; }
        .mission-calendar .rbc-day-bg { border-color: #18244b; }
        .mission-calendar .rbc-off-range-bg { background: #080c19; }
        .mission-calendar .rbc-today { background: #00ff8808; }
        .mission-calendar .rbc-date-cell { padding: 4px 8px; font-size: 12px; }
        .mission-calendar .rbc-date-cell.rbc-off-range { color: #283c7d; }
        .mission-calendar .rbc-month-row { border-color: #18244b; }
        .mission-calendar .rbc-time-view { border-color: #18244b; }
        .mission-calendar .rbc-time-header-content { border-color: #18244b; }
        .mission-calendar .rbc-time-content { border-color: #18244b; }
        .mission-calendar .rbc-time-slot { border-color: #18244b30; }
        .mission-calendar .rbc-timeslot-group { border-color: #18244b; }
        .mission-calendar .rbc-current-time-indicator { background: #00ff88; }
      `}</style>
    </div>
  );
}
