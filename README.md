# DC Assistant

A modern, premium dark-themed GitHub Personal Assistant Dashboard built with React and Tailwind CSS. Designed for the Davidic-Core account with a focus on elegance, interactivity, and developer productivity.

## Repository

- **Org:** Davidic-Core
- **Repo:** dc-assistant-dashboard
- **Branch:** github-assistant-dashboard

## Overview

DC Assistant is a comprehensive GitHub Personal Assistant Dashboard that combines GitHub repository management, live activity tracking, AI-powered insights, and terminal access into a unified, beautifully designed interface. Built for personal use with Davidic-Core identity, it provides an all-in-one hub for managing development workflows.

## Features

### Core Navigation
- **Collapsible Sidebar** - Responsive navigation with mobile-optimized bottom nav (Home, Repositories, Live Activity, AI Assistant, Notifications, Terminal, Settings)
- **Top Navigation Header** - Davidic-Core identity display, GitHub profile button, search bar, notification bell, and user avatar
- **Mobile-First Responsive Design** - Seamless experience across all devices with adaptive layouts

### Dashboard Sections

1. **Welcome Card** - Personalized greeting for Davidic-Core with quick stats overview
2. **GitHub Stats Cards** - Key metrics display:
   - Total repositories count
   - Stars earned across projects
   - Followers and following
   - Recent commits activity
3. **Repository Grid** - Interactive repository browser showing:
   - Repository name and description
   - Programming language badge
   - Last updated timestamp
   - Direct GitHub link for each repo
4. **Live Activity Feed** - Real-time GitHub activity tracking:
   - Recent commits
   - Push notifications
   - Pull request updates
   - Branch creation events
5. **AI Chat Assistant Panel** - Intelligent conversation interface with:
   - Message history with timestamps
   - Edit prompt button for user messages
   - Regenerate response icon for AI messages
   - Copy response functionality
   - Delete message controls
   - Realistic simulated AI responses
6. **Notifications Panel** - Centralized alert management:
   - Categorized notifications (comments, mentions, PRs, deployments)
   - Read/unread status indicators
   - Timestamp tracking
7. **Terminal Preview Card** - Developer terminal interface with:
   - Real terminal window layout with status bar
   - Command input field with execution
   - Output console area displaying results
   - Command history tracking
   - Clear logs button
   - Shell type selection
   - Font size customization
8. **Settings Page** - Comprehensive configuration with 6 tabs:
   - **General** - Username, email, theme preferences
   - **AI Keys** - OpenAI, Anthropic, Google Gemini API key management
   - **GitHub Token** - Personal access token configuration with verification status
   - **Terminal** - Real terminal interface with command execution, shell settings
   - **Environment** - Dynamic environment variable management with add/edit/delete/show-hide capabilities
   - **Notifications** - Notification preference toggles

## Design System

### Visual Style
- **Color Scheme:** Elegant black/dark gray theme with emerald green accents
  - Primary: #0a0a0a (deep black background)
  - Secondary: #1a1a1a (card backgrounds)
  - Accent: #10b981 (emerald green)
  - Neutral grays: #404040, #666666, #999999
- **Typography:** Clean, modern font stack with semantic hierarchy
- **Components:** Rounded cards, smooth shadows, glass morphism effects
- **Aesthetic:** Premium futuristic developer experience

### Component Library
- Custom Tailwind CSS configuration with semantic design tokens
- Lucide React icons for consistent iconography
- Responsive utility classes for mobile-first development
- Gradient accents and hover states for interactivity

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS with custom theme configuration
- **Icons:** Lucide React
- **Language:** TypeScript
- **State Management:** React Hooks (useState, useCallback)
- **Data:** Mock realistic GitHub data ready for API integration

## Project Structure

```
dc-assistant-dashboard/
├── app/
│   ├── layout.tsx           # Root layout with theme setup
│   ├── page.tsx             # Home/Dashboard page
│   ├── repositories/        # Repository browser
│   ├── activity/            # Live activity feed
│   ├── assistant/           # AI chat page
│   ├── notifications/       # Notifications center
│   ├── terminal/            # Terminal interface
│   └── settings/            # Settings with 6 tabs
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Header.tsx           # Top navigation header
│   ├── LayoutWrapper.tsx    # Main layout container
│   ├── StatsCard.tsx        # Stat display components
│   ├── RepositoryCard.tsx   # Repository display card
│   ├── ActivityFeed.tsx     # Activity timeline
│   ├── AIChat.tsx           # AI assistant chat interface
│   ├── NotificationsPanel.tsx # Notifications display
│   ├── TerminalPreview.tsx  # Terminal card preview
├── app/globals.css          # Global styles and design tokens
├── tailwind.config.js       # Tailwind theme configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies and scripts

```

## Recent Enhancements

### AI Chat Panel Upgrades
- ✨ Edit prompt button - Modify user messages in place
- ✨ Regenerate response - Create new AI responses to the same prompt
- ✨ Copy response - One-click clipboard copying with feedback
- ✨ Delete message - Remove individual messages from conversation
- ✨ Hover controls - Context-aware action buttons appear on hover

### Settings Page Refinements
- ✨ Terminal Tab - Full terminal interface with command execution, output console, history, and clear logs
- ✨ Environment Tab - Complete variable management with add, edit, delete, and secret visibility toggle
- ✨ Show/Hide Secrets - Toggle password visibility for sensitive environment variables
- ✨ Dynamic Variable Management - Add/remove environment variables on the fly

### Core Improvements
- Simplified identity system - Removed login/signup flows, pure Davidic-Core identity
- Enhanced UI interactions - Smooth transitions, feedback indicators, accessibility improvements
- Production-ready components - All components optimized for performance and user experience

## Getting Started

### Prerequisites
- Node.js 18+ and npm (or your preferred package manager)
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Davidic-Core/dc-assistant-dashboard.git
cd dc-assistant-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Setup

Create a `.env.local` file in the root directory for any API keys:
```env
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
```

## Build & Deployment

### Development
```bash
npm run dev      # Start dev server with hot reload
npm run lint     # Run ESLint
```

### Production
```bash
npm run build    # Build for production
npm run start    # Start production server
```

### Deployment to Vercel
The project is optimized for Vercel deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Future Integration Points

The dashboard is structured to easily integrate with:
- **GitHub API** - Replace mock data with real repository and activity data
- **OpenAI/Anthropic API** - Connect real AI models to the chat assistant
- **WebSocket/SSE** - Enable real-time activity updates
- **Database** - Persist user preferences and chat history
- **Authentication** - Add user account management if needed

## File Organization Notes

- **Components** are reusable and isolated - Each component handles its own styling and state
- **Pages** combine components into full views - Use Next.js App Router routing
- **Styling** is centralized - Global tokens in globals.css, extended in tailwind.config.js
- **Icons** use Lucide React - Consistent, accessible, and lightweight

## Performance Optimizations

- Server-side rendering with Next.js for fast initial loads
- CSS-in-JS with Tailwind for minimal bundle size
- Lazy loading for heavy components
- Optimized images and assets
- Efficient re-renders with React hooks

## Accessibility

- Semantic HTML structure throughout
- ARIA labels and roles where needed
- Keyboard navigation support
- Color contrast compliance
- Focus indicators for all interactive elements

## Contributing

This is a personal project for Davidic-Core. For suggestions or improvements:
1. Create a feature branch from `front-end`
2. Make your changes
3. Submit a pull request to the `front-end` branch

## License

This project is maintained by Davidic-Core. All rights reserved.

## Support

For issues, questions, or feature requests, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
