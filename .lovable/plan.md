
## Task Management System — Frontend Prototype

### Pages & Routing
1. **Login Page** (`/login`) — Email + password form with role selector (Admin/User). Uses hardcoded mock users. Clean centered card layout.
2. **Dashboard** (`/dashboard`) — Role-aware landing page showing summary stats (total tasks, by status). Sidebar navigation.
3. **Not Found** (`/*`) — Existing 404 page.

### Admin Views (sidebar nav)
- **Create Task** — Form with title, description, priority (Low/Medium/High), due date, and assignee dropdown (mock users list). Saves to shared state.
- **All Tasks** — Table view of all tasks with status badges, assignee, priority, and filters. Inline "Assign" dropdown to reassign.
- **Audit Logs** — Table showing timestamped log entries (task created, status changed, reassigned) with user, action, and timestamp columns.

### User Views (sidebar nav)
- **My Tasks** — Table/card list of tasks assigned to the logged-in user. Each task shows title, priority, due date, and current status.
- **Update Status** — Dropdown on each task card to change status: To Do → In Progress → In Review → Done. Changes are logged to audit.

### Shared State & Mock Data
- React Context for auth (current user + role) and task store.
- Pre-seeded with 5-6 sample tasks and 3 mock users.
- Audit log entries auto-generated on every create/assign/status-change action.

### Layout & Design
- **Sidebar** using shadcn Sidebar component with role-based menu items.
- shadcn components throughout: Card, Table, Badge, Select, Input, Button, Dialog.
- Professional, clean design with consistent spacing and color scheme.
- Responsive layout that works on desktop and tablet.

### Component Structure
- `AuthContext` — login state, current user, role
- `TaskContext` — tasks array, audit log, CRUD actions
- `AppSidebar` — role-aware navigation
- `DashboardLayout` — sidebar + main content wrapper
- Page components for each view
