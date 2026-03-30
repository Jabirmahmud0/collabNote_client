# CollabNote 🟣
> **Intelligent Real-Time Collaborative Notes Platform**

![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Socket.IO-blue)
![AI Integrations](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange)
![License](https://img.shields.io/badge/License-MIT-green)

A professional, full-stack application engineered as a comprehensive exploration of modern web technologies. This project goes beyond basic CRUD functionality to demonstrate proficiency in real-time bidirectional communication, complex state syncing, AI integrations, and modern deployment pipelines.

**Live Demo:** [collabnote-six.vercel.app](https://collabnote-six.vercel.app)

---

## 🎯 Project Motivation & Technical Highlights
This project was purposefully built to tackle complex frontend and backend engineering challenges, making it a cornerstone piece of my technical portfolio:

* **Real-Time Data Synchronization:** Mastered bidirectional communication using WebSockets (`Socket.IO`) to handle sub-second collaborative editing, minimizing race conditions with partial delta syncing.
* **Complex UI State Management:** Engineered a seamless user experience tracking live cursors, active presence, and typing indicators for multiple concurrent users across an active document.
* **Resilient AI Architecture:** Integrated Google's **Gemini 2.5 Flash** LLM to power smart summaries and auto-tagging. Built a robust backend proxy featuring **custom API key auto-rotation** to seamlessly manage rate limits and ensure maximum uptime.
* **Security & Scalability:** Implemented a dual-token JWT authentication flow (Access & Refresh tokens) natively alongside Firebase components, with secure multi-platform deployment spanning Vercel and Render.

---

## ✨ Key Features

### 🤝 Seamless Collaboration
* **Multi-user editing** - Edit documents simultaneously with intelligent delta tracking.
* **Live cursors & Presence** - See where collaborators are typing in real-time with UI overlays.
* **Typing indicators** - Instant visual feedback of active user states in the room.

### 🧠 AI-Powered Tooling
* **Smart Summaries** - One-click, concise AI-generated summaries of lengthy note content.
* **Contextual Auto-Tags** - Intelligent prompt engineering to suggest relevant tag groupings.
* **Advanced Diff Viewer** - Developer-grade change tracking to compare edits side-by-side or unified.

### 📝 Rich Document Management
* **Rich Text Customization** - Full-featured `Quill.js` editor supporting complex formatting.
* **Version History** - Persistent note histories with granular rollback capabilities.
* **Media Handling** - Direct image integrations powered by `Cloudinary`.

---

## 🚀 Tech Stack & Tools Explored

### Frontend Architecture
| Technology | Role & Purpose |
|------------|----------------|
| **React 19** | Core UI Framework leveraging modern hooks and concurrent features |
| **Vite & Tailwind CSS v4** | Blazing fast build tooling paired with utility-first styling |
| **Context API / useReducer** | Predictable, scalable complex state management |
| **Quill.js** | Extensible rich text engine handling Delta math |
| **Framer Motion** | Polished, hardware-accelerated micro-interactions |

### Backend Infrastructure
| Technology | Role & Purpose |
|------------|----------------|
| **Node.js / Express** | Robust, RESTful application server |
| **Socket.IO** | High-performance WebSocket server for real-time events |
| **MongoDB Atlas / Mongoose** | NoSQL database with strict schema validation |
| **Google Generative AI** | Prompt execution engine (Gemini 2.5) with key-rotation logic |
| **JWT & bcryptjs** | Enterprise-grade stateless authentication |

---

## 🔌 System Architecture (Socket Events)

**Client → Server**
```javascript
socket.emit('join-room', { noteId, userId, userName }) // Initiates presence
socket.emit('note-change', { noteId, delta, userId })  // Broadcasts operational transforms
socket.emit('cursor-move', { noteId, userId, range })  // Syncs XY/index coordinates
```

**Server → Client**
```javascript
socket.on('room-users', (users) => {})                 // Updates active presence list
socket.on('note-update', ({ delta, userId }) => {})    // Applies remote deltas securely
socket.on('cursor-update', ({ userId, range }) => {})  // Renders remote cursor overlays
```

---

## 🛠️ Local Development Setup

### 1. Requirements
* Node.js v18+
* MongoDB Atlas Cluster (Free Tier)
* Google Gemini API Key

### 2. Installation
```bash
git clone https://github.com/Jabirmahmud0/collabnote.git
cd collabnote
```

### 3. Backend Configuration (`/server`)
```bash
cd server
npm install
```
Create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<auth>@cluster0...
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh
GOOGLE_API_KEY_A=your_gemini_key_1
GOOGLE_API_KEY_B=your_gemini_key_2
CLOUDINARY_CLOUD_NAME=your_cloud
CLIENT_URL=http://localhost:5173
```
*Run:* `npm run dev`

### 4. Frontend Configuration (`/client`)
```bash
cd ../client
npm install
```
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
```
*Run:* `npm run dev`

---

## 👨‍💻 About The Author

**Jabir Mahmud**  
Passionate about tackling complex technical challenges and exploring innovative frontend and backend solutions. 

* **GitHub:** [@Jabirmahmud0](https://github.com/Jabirmahmud0)
* **LinkedIn:** [Jabir Mahmud](https://linkedin.com/in/jabirmahmud)

> *This project serves as a live demonstration of my ability to build technically challenging, user-centric, and scalable web applications from scratch.*

---
📄 **License:** MIT
