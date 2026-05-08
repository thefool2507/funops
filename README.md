# FunOps — Task Management Redefined

> A professional, elegant web-based task management tool for daily operations. Built with Next.js 16, Supabase, and deployed free on Vercel + Supabase.

![FunOps Dashboard](https://github.com/thefool2507/funops/blob/main/funops.mp4?raw=true)

## Features

| Feature | Description |
|---|---|
| **Kanban Board** | Drag & drop tasks across Todo → In Progress → Done |
| **All Tasks View** | Filterable, sortable list with bulk actions |
| **Calendar View** | Monthly calendar with per-day task planning |
| **Analytics** | Completion rates, priority charts, category breakdown |
| **Pomodoro Timer** | Built-in focus sessions with per-task tracking |
| **Quick Add** | Press `⌘K` to instantly add tasks anywhere |
| **Command Palette** | Navigate and search tasks without leaving keyboard |
| **Auth** | Email/password + GitHub OAuth via Supabase |
| **Responsive** | Works on desktop, tablet, and mobile |
| **Realtime** | Live updates across tabs via Supabase Realtime |

## Tech Stack

**Frontend (Free on Vercel)**
- [Next.js 14](https://nextjs.org) — App Router + Server Components
- [TypeScript](https://typescriptlang.org) — Full type safety
- [Tailwind CSS](https://tailwindcss.com) — Utility-first styling
- [Framer Motion](https://framer.com/motion) — Smooth animations
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) — Drag & drop
- [Recharts](https://recharts.org) — Analytics charts

**Backend (Free on Supabase)**
- [Supabase](https://supabase.com) — PostgreSQL + Auth + Realtime + RLS
- Row Level Security — users only see their own data

## Deploy in 5 minutes

### Step 1 — Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/funops.git
cd funops
pnpm install
```

### Step 2 — Create Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, set a database password, select a region
3. Go to **SQL Editor** → paste contents of `supabase/schema.sql` → **Run**
4. Go to **Settings → API** → copy your **Project URL** and **anon key**

### Step 3 — Set environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Step 5 — Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

Or via [vercel.com](https://vercel.com/new):
1. Import your GitHub repo
2. Add environment variables from step 3
3. Deploy — done!

**Vercel will auto-deploy on every `git push main`.**

### Step 6 — Enable GitHub OAuth (optional)

1. Supabase Dashboard → **Authentication → Providers → GitHub**
2. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
   - Homepage URL: `https://your-app.vercel.app`
   - Callback URL: `https://your-project.supabase.co/auth/v1/callback`
3. Paste Client ID and Secret into Supabase

## Project Structure

```
funops/
├── app/
│   ├── (auth)/           # Login & signup pages
│   ├── api/tasks/        # REST API route handlers
│   ├── auth/callback/    # OAuth callback
│   ├── dashboard/        # Protected app pages
│   │   ├── page.tsx      # Main dashboard
│   │   ├── kanban/       # Kanban board
│   │   ├── tasks/        # All tasks list
│   │   ├── calendar/     # Calendar view
│   │   ├── analytics/    # Charts & stats
│   │   ├── timer/        # Pomodoro timer
│   │   └── settings/     # User settings
│   └── page.tsx          # Landing page
├── components/
│   ├── analytics/        # Charts, stat cards
│   ├── kanban/           # Board, task cards
│   ├── layout/           # Sidebar, header
│   ├── tasks/            # Modal, pomodoro
│   └── ui/               # Command palette
├── hooks/
│   ├── useTasks.ts       # Task CRUD + realtime
│   └── useSidebar.ts     # Mobile sidebar
├── lib/
│   ├── supabase/         # Client & server helpers
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── supabase/
│   └── schema.sql        # Database schema + RLS
├── middleware.ts          # Auth route protection
├── vercel.json           # Vercel config
└── .github/
    └── workflows/ci.yml  # GitHub Actions CI
```

## Database Schema

```sql
tasks         — id, user_id, title, description, status, priority,
                category, tags, due_date, estimated_minutes,
                actual_minutes, completed_at, order_index

pomodoro_sessions — id, user_id, task_id, duration_minutes, completed_at

user_preferences  — id, user_id, theme, pomodoro_duration,
                    short_break, long_break, default_view
```

All tables have **Row Level Security** — users can only read/write their own rows.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open command palette |
| `↑↓` | Navigate command palette |
| `↵` | Select item |
| `Esc` | Close modal / palette |

## Development

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

## Free Tier Limits

| Service | Free Limit | FunOps Usage |
|---|---|---|
| **Vercel** | Unlimited deployments | Frontend hosting |
| **Supabase** | 500MB DB, 2GB bandwidth | Backend + Auth + Realtime |
| **Supabase Auth** | 50,000 MAU | Authentication |

Both services are **free forever** for personal/small projects.

## Contributing

PRs welcome! Please:
1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push & open a PR

## 📄 License

MIT License — free to use, modify, and distribute.

---

Built with using Next.js + Supabase. Deploy it free.
