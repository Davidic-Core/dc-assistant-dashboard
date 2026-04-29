# DC Assistant - GitHub Personal Assistant Dashboard

A premium dark-themed GitHub dashboard built with React, Next.js 16, and Tailwind CSS, featuring AI integration and real-time activity monitoring for the Davidic-Core account.

## 🎨 Design System

### Colors
- **Background**: Deep black (#0a0a0a)
- **Accent**: Emerald green (#10b981)
- **Cards**: Dark gray (#141414)
- **Text**: Light gray (#f5f5f5)
- **Borders**: Subtle gray (#262626)

### Typography
- **Headings**: System fonts (SF Pro Display)
- **Body**: System fonts (Segoe UI, Roboto)
- **Monospace**: Fira Code (for terminal previews)

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Theme variables and global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/Dashboard page
│   ├── repositories/
│   │   └── page.tsx         # Repositories listing
│   ├── activity/
│   │   └── page.tsx         # Live activity feed
│   ├── assistant/
│   │   └── page.tsx         # AI Assistant interface
│   ├── notifications/
│   │   └── page.tsx         # Notifications center
│   ├── terminal/
│   │   └── page.tsx         # Terminal preview
│   └── settings/
│       └── page.tsx         # Settings with 6 tabs
│
├── components/
│   ├── Sidebar.tsx          # Collapsible navigation sidebar
│   ├── Header.tsx           # Top header with search and profile
│   ├── LayoutWrapper.tsx     # Main layout container
│   ├── StatsCard.tsx        # GitHub stats display
│   ├── RepositoryCard.tsx   # Repository information card
│   ├── ActivityFeed.tsx     # Commit/PR activity timeline
│   ├── AIChat.tsx           # Interactive chat panel
│   ├── NotificationsPanel.tsx # Notifications list
│   └── TerminalPreview.tsx  # Terminal output display
```

## 🎯 Features

### 1. **Dashboard Home** (`/`)
- Welcome message with user greeting
- 4 key metrics: Total Repos, Stars, Followers, Recent Commits
- Repository grid (first 4 repos with rich metadata)
- Live activity feed with timeline
- AI Assistant chat panel
- Notifications sidebar
- Terminal preview window

### 2. **Repositories** (`/repositories`)
- Complete repository listing (12 sample repos)
- Search functionality
- Filter options
- Repository statistics
- Multi-column responsive grid
- Quick access to GitHub links

### 3. **Live Activity** (`/activity`)
- Chronological activity timeline
- Commit, PR, Push, and Branch creation events
- Activity statistics (weekly, monthly, repositories)
- Detailed commit information
- Color-coded activity types

### 4. **AI Assistant** (`/assistant`)
- Interactive chat interface
- Suggested question categories
- Real-time response simulation
- Feature list (6 AI capabilities)
- Mobile-friendly design

### 5. **Notifications** (`/notifications`)
- Success, Info, Alert, and Pending notification types
- Notification statistics
- Filter tabs (All, Unread, Mentions)
- Dismissible notifications
- Color-coded status indicators

### 6. **Terminal** (`/terminal`)
- Live terminal output preview
- Syntax-highlighted commands
- Quick command reference (6 common commands)
- Copy and export functionality
- Terminal info display

### 7. **Settings** (`/settings`)
- **General**: Username, email, theme preferences
- **AI Keys**: OpenAI, Anthropic, Google Gemini configuration
- **GitHub Token**: Personal access token management
- **Terminal**: Shell type, font size, history settings
- **Environment**: Environment variable management
- **Notifications**: Notification preference toggles

## 🛠️ Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React 0.394
- **Fonts**: System fonts + Fira Code for monospace
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Client State**: React hooks (useState)
- **Styling Approach**: CSS custom properties + Tailwind utility classes

## 📱 Responsive Design

- **Mobile**: Simplified bottom navigation (5 main items)
- **Tablet**: 2-column layouts where applicable
- **Desktop**: Full 3+ column layouts with sidebar
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px)

## 🎨 Component Highlights

### Sidebar
- Collapsible with icon-only mode on desktop
- Active state highlighting with green accent
- Responsive mobile bottom navigation
- Icons from Lucide React

### Stats Cards
- Gradient backgrounds with colors
- Trend indicators (up/down with percentages)
- Icon badges
- Hover effects

### Repository Cards
- External link icons (appear on hover)
- Language indicators with colors
- Stars and fork counts
- Last updated timestamps

### Activity Timeline
- Visual timeline with colored badges
- Activity type icons
- Detailed descriptions
- Timestamps

### AI Chat
- Message bubbles with sender distinction
- Real-time message simulation
- Loading state with spinner
- Input validation

## 🚀 Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## 📊 Mock Data

All data is realistic mock content representing:
- 12 sample repositories (various languages)
- 8 activity items (commits, PRs, pushes, branches)
- 3 sample notifications
- Terminal output with git and npm commands
- 24 total repositories across platform
- 4.2K total stars, 1.8K followers

## 🎯 Next Steps for Real Integration

To connect to real GitHub data:
1. Add GitHub API client (Octokit)
2. Replace mock repository data with API calls
3. Integrate real activity feed from GitHub webhooks
4. Add real authentication
5. Connect to actual GitHub notifications
6. Implement AI model integration

## 📄 License

MIT
