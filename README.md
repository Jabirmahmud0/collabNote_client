# CollabNote Client 🟣
> **The High-Performance Frontend for Real-Time Intelligence**

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-ff0055?logo=framer)

The `client` directory houses the core user interface of CollabNote. Engineered for sub-second responsiveness, it leverages modern React patterns and real-time synchronization to provide a seamless collaborative experience.

---

## 💎 Frontend Highlights

- **Mesh Gradient Aesthetic:** A premium UI featuring glassmorphic layers, noise overlays, and hardware-accelerated animations.
- **Delta-Based Synchronization:** Uses the Quill Delta format for efficient, conflict-free real-time document editing.
- **Intelligent Contextual UI:** Dynamically adapts to multi-user presence with live cursors, typing indicators, and room activity logs.
- **AI Integration Hub:** A dedicated space for interacting with Gemini-powered tools including document summarization and smart tagging.

---

## 🛠️ Tech Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Framework** | React 19 | Leveraging `useActionState`, `useOptimistic`, and modern concurrent features. |
| **Build Tool** | Vite 7 | Lightning-fast HMR and optimized production bundling. |
| **Styling** | Tailwind CSS v4 | Utility-first architecture with the new JIT engine and native CSS variables. |
| **Animation** | Framer Motion | Smooth layout transitions, micro-interactions, and high-performance overlays. |
| **State Sync** | Socket.IO Client | Real-time bidirectional event handling for collaborative editing. |
| **Editor** | React Quill New | Robust rich-text engine with extensive customization support. |

---

## 📂 Project Structure

```text
client/
├── src/
│   ├── components/
│   │   ├── editor/      # Quill editor implementation & Delta syncing logic
│   │   ├── layout/      # Shared components (Nav, Sidebar, Theme Toggle)
│   │   ├── notes/       # Note cards, lists, and management UI
│   │   ├── tools/       # AI-powered utility components
│   │   └── ui/          # Atomic design system (Buttons, Inputs, Modals)
│   ├── context/         # Auth, Socket, Theme, and Note providers
│   ├── hooks/           # Custom hooks for debouncing, persistence, and presence
│   ├── pages/           # View-level components for routing
│   └── utils/           # Formatters, API wrappers, and export logic (PDF/MD)
└── public/              # Static assets and brand resources
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js 18+**
- **Vite-compatible environment**

### 2. Environment Setup
Create a `.env` file in the `client` root:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 3. Installation & Execution
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🎨 Design System

CollabNote uses a custom design tokens system integrated with Tailwind CSS 4.0:
- **Primary Color:** `#8B5CF6` (Violet)
- **Backgrounds:** Adaptive mesh gradients (Light/Dark mode)
- **Typography:** Modern sans-serif stack (Inter/Geist)
- **Effects:** Backdrop-blur (12px), Subtle noise texture (5% opacity)

---

## 👨‍💻 Author
**Jabir Mahmud**  
[GitHub](https://github.com/Jabirmahmud0) • [LinkedIn](https://linkedin.com/in/jabirmahmud)
