# TaskFlow — Modern Task & Productivity Manager

TaskFlow is a premium, responsive SaaS-style productivity dashboard built with **React**, **Vite**, **Lucide React**, and **localStorage**. It enables individuals and teams to track, organize, and accomplish daily deliverables with instant real-time statistics, smart views, priority management, and custom categorization.

---

## ✨ Features

- **📊 Comprehensive Dashboard Stats**: Real-time metrics for Total, Completed, Pending, and Overdue tasks, complete with dynamic completion rate progress and motivational prompts.
- **⚡ Intuitive Task Management**:
  - Create tasks with title, description, priority levels (Low, Medium, High), due dates, categories, and initial status.
  - Interactive custom checkboxes with smooth completion state transitions and timestamp tracking.
  - Quick-edit existing tasks with pre-populated form fields and instantaneous updates.
  - Full task detail inspection modal with metadata (creation date, completed date, notes).
  - Safe deletion workflow with accessible confirmation dialog.
- **🔍 Advanced Search & Multi-Filter Engine**:
  - Live full-text search across titles and descriptions.
  - Status filters: *All Tasks*, *Pending*, *Completed*, and *🔥 High Priority*.
  - Priority dropdown filter (*High*, *Medium*, *Low*).
  - Category dropdown and sidebar filter.
  - Sort by *Soonest Due Date*, *Latest Due Date*, *Highest Priority*, *Lowest Priority*, *Recently Created*, or *Title (A-Z)*.
  - Single-click *Clear Filters* action.
- **📁 Projects & Categories**:
  - Default categories: *Work*, *Personal*, *Study*, and *Health*.
  - Custom category creator with dynamic color palette tags.
  - Task count badges per category in the sidebar.
- **📅 Smart Task Views**:
  - **All Tasks**: Complete overview of active and archived items.
  - **Today**: Dedicated view for items with today's deadline.
  - **Upcoming**: Future-dated incomplete deliverables.
  - **Completed**: Finished tasks with completion timestamps.
  - Contextual empty states with targeted action triggers.
- **💾 Safe Persistence**:
  - Powered by browser `localStorage`.
  - Automatic error handling for missing or malformed stored data.
  - Initializes with realistic sample tasks only when no saved data exists, preserving all user updates.
- **🎨 Design & Accessibility**:
  - Light and Dark mode toggle with persistent preference.
  - Responsive design optimized for desktop, tablet, and mobile (collapsible drawer navigation).
  - Built with CSS custom properties design system, WCAG color contrast compliance, and `:focus-visible` keyboard rings.
  - Keyboard shortcut: Press `N` to quickly open the Create Task modal.
  - Non-intrusive toast notifications for success, warning, and deletion events.

---

## 🛠️ Technologies

- **React 18** (Modern hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`)
- **Vite 6** (High-speed build tool and hot module replacement)
- **Lucide React** (Clean, consistent iconography)
- **CSS3** (CSS custom properties, flexbox, CSS grid, glassmorphism backdrop-filters, responsive media queries)
- **HTML5 & Web Storage API** (`localStorage`)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jvprakruth004/AI_ARENA.git
   cd AI_ARENA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view TaskFlow.

### Production Build

To build the optimized production assets:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📂 Project Architecture

```
AI_ARENA/
├── index.html                  # HTML entry point with Plus Jakarta Sans typography
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration
├── README.md                   # Project documentation
├── .gitignore                  # Git ignore rules
└── src/
    ├── main.jsx                # Application mounting root
    ├── App.jsx                 # Master application controller and state machine
    ├── index.css               # Design system & CSS variable styling
    ├── components/
    │   ├── Header.jsx          # App navbar, brand, search, theme toggle, mobile toggle
    │   ├── Sidebar.jsx         # Views, categories, and mini productivity widget
    │   ├── DashboardStats.jsx  # Summary cards (Total, Pending, Completed, Overdue) + Progress
    │   ├── FilterBar.jsx       # Status tabs, search, priority, category, sort dropdowns
    │   ├── TaskList.jsx        # Task feed with contextual empty states
    │   ├── TaskCard.jsx        # Individual task card with actions and status badges
    │   ├── TaskModal.jsx       # Create/Edit task modal with form validation
    │   ├── TaskDetailModal.jsx # Full-detail task inspector modal
    │   ├── DeleteConfirmModal.jsx # Destructive action confirmation dialog
    │   ├── CategoryModal.jsx   # Custom category creation modal with color picker
    │   └── Toast.jsx           # Global feedback notification toasts
    ├── data/
    │   └── initialData.js      # Sample tasks with dynamic relative dates and default categories
    └── utils/
        └── dateUtils.js        # Date comparison, overdue detection, and formatting utilities
```
