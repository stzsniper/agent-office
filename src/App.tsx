import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar, Screen } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { OfficeScreen } from '@/screens/OfficeScreen';
import { TasksScreen } from '@/screens/TasksScreen';
import { ContentScreen } from '@/screens/ContentScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { MemoryScreen } from '@/screens/MemoryScreen';
import { TeamScreen } from '@/screens/TeamScreen';
import { ContactsScreen } from '@/screens/ContactsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000,
      staleTime: 10000,
    },
  },
});

const SCREEN_TITLES: Record<Screen, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of all agent activity' },
  office: { title: 'Office', subtitle: 'Virtual agent workspace — click desks for details' },
  tasks: { title: 'Tasks Board', subtitle: 'Manage and track all tasks' },
  content: { title: 'Content Pipeline', subtitle: 'Plan and publish content' },
  calendar: { title: 'Calendar', subtitle: 'Schedule and events' },
  memory: { title: 'Memory', subtitle: 'Searchable knowledge base' },
  team: { title: 'AI Team', subtitle: 'Agent org chart and status' },
  contacts: { title: 'Contacts', subtitle: 'Team and partner directory' },
  settings: { title: 'Settings', subtitle: 'Configure agents and integrations' },
};

function ScreenRouter({ screen }: { screen: Screen }) {
  switch (screen) {
    case 'dashboard': return <DashboardScreen />;
    case 'office': return <OfficeScreen />;
    case 'tasks': return <TasksScreen />;
    case 'content': return <ContentScreen />;
    case 'calendar': return <CalendarScreen />;
    case 'memory': return <MemoryScreen />;
    case 'team': return <TeamScreen />;
    case 'contacts': return <ContactsScreen />;
    case 'settings': return <SettingsScreen />;
  }
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const screenInfo = SCREEN_TITLES[activeScreen];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-midnight-950 text-white">
        <Sidebar active={activeScreen} onNavigate={setActiveScreen} />
        <main className="ml-60 transition-all duration-300">
          <TopBar title={screenInfo.title} subtitle={screenInfo.subtitle} />
          <div className="p-6">
            <ScreenRouter screen={activeScreen} />
          </div>
          <footer className="text-center py-4 text-xs text-midnight-600">
            Agent Office v1.0 — Mission Control
          </footer>
        </main>
      </div>
    </QueryClientProvider>
  );
}
