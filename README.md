# Kanvax - AI-Powered Task Manager

A modern, feature-rich task management application with AI chat capabilities, built with Next.js 14, TypeScript, and Google Gemini AI.

![Kanvax Dashboard](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 🌐 Live Demo

**[View Live Demo →](https://kanvax.vercel.app)**

## ✨ Features

### Task Management
- **Kanban Board** - Drag-and-drop tasks between To Do, In Progress, and Done columns
- **Full CRUD** - Create, read, update, and delete tasks
- **Priority Levels** - Low, Medium, High with visual indicators
- **Due Dates** - Custom date picker with quick-select buttons (Today, Tomorrow, Next Week)
- **Tags** - Organize tasks with multiple tags
- **Search & Filter** - Find tasks by title/description, filter by priority and status

### AI-Powered Features
- **AI Chat Assistant** - Natural language task suggestions and help
- **Brain Dump** - Paste messy notes, AI extracts actionable tasks
- **Task Enhancement** - AI improves task descriptions with more detail
- **Task Breakdown** - AI splits complex tasks into subtasks
- **AI Productivity Coach** - Personalized insights based on your task data

### Analytics Dashboard
- **Activity Heatmap** - GitHub-style calendar showing task patterns
- **Task Status Distribution** - Visual breakdown of task states
- **Priority Breakdown** - See task distribution by priority
- **Key Metrics** - Completion rate, streak tracking, and more

### UX Enhancements
- **Dark/Light Mode** - Theme toggle with system preference support
- **Command Palette** - Quick actions with `Cmd+K` / `Ctrl+K`
- **Confetti Celebration** - Fun animation when completing tasks
- **Markdown Support** - Rich task descriptions with checkbox subtasks
- **Responsive Design** - Works on desktop and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sikakoluchaitanya/Kanvax.git
   cd Kanvax
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   Gemini_api=your_gemini_api_key_here
   ```
   
   Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **AI** | Google Gemini API |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Drag & Drop** | @dnd-kit |
| **Icons** | Lucide React |

## 📁 Project Structure

```
kanvax/
├── app/
│   ├── analytics/       # Analytics dashboard
│   ├── api/             # API routes (AI endpoints)
│   ├── board/           # Kanban board view
│   ├── chat/            # AI chat interface
│   ├── settings/        # App settings
│   └── page.tsx         # Dashboard home
├── components/
│   ├── layout/          # Sidebar, navigation
│   ├── tasks/           # Task cards, forms, modals
│   └── ui/              # Reusable UI components
├── lib/
│   ├── gemini.ts        # Gemini AI integration
│   └── store.ts         # Zustand store
└── public/              # Static assets
```

## 🔮 Future Improvements

With more time, I would add:

1. **Database Integration** - Persist tasks with PostgreSQL/MongoDB
2. **User Authentication** - Multi-user support with NextAuth.js
3. **Real-time Sync** - Collaborative task management
4. **Calendar View** - Timeline visualization of due dates
5. **Recurring Tasks** - Daily/weekly/monthly task templates
6. **Mobile App** - React Native companion app
7. **Integrations** - Slack, Google Calendar, Notion sync
8. **Task Templates** - Pre-built task structures for common workflows
9. **Time Tracking** - Built-in pomodoro timer and time logging
10. **Export/Import** - CSV/JSON data portability

## 📝 License

MIT License - feel free to use this project for learning or building upon.

---

Built with ❤️ for the Crew Frontend Assignment
