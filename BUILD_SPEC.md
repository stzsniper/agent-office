# Mission Control Dashboard — Build Spec

Source: Willy's Lovable Prompt Template
Date: 2026-03-17

## App Structure

Left sidebar navigation with these screens:

### 1. Dashboard (Home)
- Top metrics cards: Active tasks, Content pipeline status, Upcoming events (48h), AI agent activity
- Live activity feed with timestamps
- Status indicators: 🟢 active, 🟡 pending, 🔴 error, ⚫ idle

### 2. Tasks Board (Kanban)
- Columns: Backlog, In Progress, Review, Done
- Task cards: Title, Assignee, Priority (low/medium/high/urgent), Due date, Status
- Drag and drop between columns
- Click to expand + comments
- Filters: assignee, priority, project

### 3. Content Pipeline (Kanban)
- Columns: Research, Scripting, Design, Review, Scheduled, Published, Analytics
- Cards: Title, Platform, Assigned day, Status
- Rich text editor for scripts
- Image attachments, external draft links
- Calendar view toggle
- Weekly posting schedule (Mon-Fri themes)

### 4. Calendar
- Month/Week/Day toggle
- Scheduled tasks, content publishing, meetings, cron jobs
- Color coding by category
- Click event for details
- New event creation

### 5. Memory
- Searchable document library
- Cards: Title, Date, Category, Preview
- Full-text search, filter, sort
- Click to expand full view

### 6. AI Team View
- Org chart visualization
- Jarvis (GM) at top
- Sub-agents grouped by role
- Each agent: Name, Role, Current task, Status, Last active
- Click agent: Responsibilities, Recent work, Performance metrics

### 7. Contacts / CRM
- Contact cards: Name, Role, Handle, Timezone, Notes
- Categories: Internal Team, Content Team, External, Clients

### 8. Settings
- Cron job manager
- Integration status (Slack, Notion, etc.)
- Agent configuration panel

### 9. 🏢 Office (Virtual Agent Office)
- Visual office floor with 5 desks (one per agent)
- Each desk: computer, chair, nameplate, status lamp
- Animated: typing when busy, screen glow, status light pulsing
- Agent-specific screens: Jarvis=dashboard, SNIPER=charts, LEO=terminal, Mark=news, Bryan=social
- Status lamp: 🟢 working, 🟡 waiting, 🔴 error, ⚫ offline
- Click desk → agent details panel
- Fun details: coffee cups, multiple monitors for LEO

## Design
- Dark mode only
- Clean card layouts
- Generous spacing
- Minimal animations
- Desktop optimized
- Subtle accent colors
- Status dots: green=active, yellow=pending, red=error, gray=idle
