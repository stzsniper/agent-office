import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ListTodo,
  Film,
  Calendar,
  Brain,
  Users,
  Contact,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { useState } from 'react';

export type Screen =
  | 'dashboard'
  | 'tasks'
  | 'content'
  | 'calendar'
  | 'memory'
  | 'team'
  | 'contacts'
  | 'settings';

interface SidebarProps {
  active: Screen;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { id: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks Board', icon: ListTodo },
  { id: 'content', label: 'Content Pipeline', icon: Film },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'team', label: 'AI Team', icon: Users },
  { id: 'contacts', label: 'Contacts', icon: Contact },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-midnight-900 border-r border-midnight-700/50 flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-midnight-700/50 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/30 flex-shrink-0">
          <Building2 className="w-4 h-4 text-neon-green" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white truncate">Agent Office</h1>
            <p className="text-[10px] text-midnight-400 truncate">Mission Control</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                isActive
                  ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                  : 'text-midnight-300 hover:text-white hover:bg-midnight-800'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-midnight-700/50 text-midnight-400 hover:text-white transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
