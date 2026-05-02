# DC Assistant Dashboard

## Overview
A Next.js GitHub Personal Assistant Dashboard for the **Davidic-Core** GitHub account. Displays live repository data, real-time activity events, and GitHub user stats — all fetched from the GitHub API using a secure server-side token.

## Architecture

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS with custom CSS variables (dark theme)
- **Language**: TypeScript
- **Port**: 3001 (dev), proxied to 80

## Key Files

### API Routes (server-side, authenticated)
- `app/api/github/repos/route.ts` — Fetches all repos from Davidic-Core, returns structured data
- `app/api/github/events/route.ts` — Fetches public events (push, PR, branch, etc.)
- `app/api/github/user/route.ts` — Fetches user profile + computes total stars

### Pages (client-side with polling)
- `app/page.tsx` — Main dashboard: stats, repos, activity feed, AI chat
- `app/repositories/page.tsx` — Full repo list with search, sort, filter
- `app/activity/page.tsx` — Full activity timeline with live stats

### Components
- `components/RepositoryCard.tsx` — Repo card with GitHub link, private badge, open issues
- `components/ActivityFeed.tsx` — Timeline with clickable repo links
- `components/Header.tsx`, `Sidebar.tsx`, `LayoutWrapper.tsx` — Layout shell
- `components/StatsCard.tsx`, `AIChat.tsx`, `EnvironmentPanel.tsx`, `TerminalPreview.tsx`

### Utilities
- `lib/github-utils.ts` — `formatRelativeTime()`, `formatNumber()` helpers

## Environment / Secrets

All secrets are stored securely in Replit's secrets manager (never hardcoded):

| Secret | Purpose |
|---|---|
| `GITHUB_TOKEN` | GitHub Personal Access Token for API auth |
| `GITHUB_USERNAME` | GitHub username (`Davidic-Core`) |

The token is accessed only server-side in the API route handlers via `process.env.GITHUB_TOKEN`. It is never exposed to the client.

## Live Data Polling

| Data | Endpoint | Poll Interval |
|---|---|---|
| Repositories | `/api/github/repos` | 60 seconds |
| Activity events | `/api/github/events` | 30 seconds |
| User stats | `/api/github/user` | 120 seconds |

## Running

```bash
npm install
npm run dev   # starts on port 3001
```

## Workflow
The app runs via the "Start application" workflow: `npm run dev` waiting on port 3001.
