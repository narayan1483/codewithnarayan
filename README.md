<div align="center">

# 🚀 code.withnarayan

### *Handwritten CS Notes, Cheatcodes & SDE Interview Mastery Platform*

[![Live Site](https://img.shields.io/badge/Live%20Website-codewithnarayan.vercel.app-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://codewithnarayan.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-10B981?style=for-the-badge&logo=render&logoColor=white)](https://codewithnarayan-backend.onrender.com)
[![Database](https://img.shields.io/badge/Database-Aiven%20MySQL-F59E0B?style=for-the-badge&logo=mysql&logoColor=white)](https://aiven.io)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge)](#-license)

<p align="center">
  Subject-wise, exam-ready handwritten PDF notes, cheatcodes, and structured roadmaps for <b>DSA · Java · System Design · Web Dev · DBMS · OS · Networking</b> — designed for students & software engineers.
</p>

</div>

---

## 🌟 Key Highlights & Modern Features

### 🗂️ 1. Interactive Category Hubs (`CategoryHubSection.jsx`)
- **Aiven MySQL Cloud Persistence:** Admins can dynamically create, edit, reorder, or delete category cards live without touching code.
- **Dynamic Expanding Explorers:** Clicking a category card (*All CS Notes, Cheatsheets, System Design, Placement Quiz, etc.*) smoothly slides open its dedicated explorer section.
- **Dynamic Typewriter Tickers:** Live rotating topic announcements with pulsing glowing badges.

### 🏆 2. Daily Interview Placement Quiz (`QuizSection.jsx`)
- **Interactive MCQ Practice:** Core CS & Placement quizzes covering DSA, Java OOP, DBMS normal forms, OS concurrency, and Web Development.
- **Live Score & Instant Explanations:** Real-time percentage scoring with detailed green/red explanations for every option.
- **Admin Question Management:** Add, edit, and delete questions with instant localStorage + state sync.
- **Quick Collapse & Back Button:** Easy one-click navigation to collapse view or jump back to category hubs.

### 📦 3. Curated Placement Bundles (`BundlesSection.jsx`)
- All-in-one bundled packs (*DSA Mastery, Java Full Course, Placement Ready Bundle, Full Stack Web Dev Kit*) to save prep time and download everything in one click.

### ⚡ 4. Cheatcodes & Cheatsheet Explorer (`CheatsheetSection.jsx`)
- Fast revision syntax sheets, one-liners, time complexities, and interview formulas with one-click code copy and search filter.

### 🎯 5. Structured Career Roadmaps (`RoadmapSection.jsx`)
- Step-by-step career tracks for **Frontend, Backend, Full Stack, DevOps, DSA, and System Design** with milestone tracking and progress persistence.

### 🔍 6. Spotlight Command Palette (`CommandPalette.jsx`)
- Instant `Ctrl + K` quick search across all notes, categories, roadmaps, cheatsheets, and quizzes.

### 📱 7. 100% Mobile Responsive & Touch Optimized (`BottomNav.jsx`)
- Tested across small screens (320px–440px) and tablets with zero horizontal overflow.
- Floating glassmorphic bottom navigation bar with iOS safe-area inset support.

### 🎨 8. Premium Design & Ultra-Smooth Animations
- Flowing gradient headline animations (`linear-gradient(135deg, #2563EB 0%, #7C3AED 45%, #FF4D6D 100%)`).
- Ambient backdrop radial glows and glassmorphic translucent navigation.
- Dark / Light mode toggle with persistent preferences.

---

## 🛠️ Complete Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Blazing fast HMR and optimized production bundles |
| **Styling & Motion** | Custom Modern CSS | Glassmorphism, CSS keyframe micro-animations, HSL color tokens |
| **Icons** | Lucide React | High-performance scalable SVG icons |
| **Backend Server** | Node.js + Express | RESTful API with Gzip compression (`compression`) |
| **Database** | Aiven MySQL (24/7 Cloud) | High-availability relational database with connection pooling |
| **Authentication** | Custom Admin Auth | Secure password verification & session management |
| **Frontend Hosting** | Vercel | Global Edge CDN hosting with zero-config deployments |
| **Backend Hosting** | Render | Automatic keep-alive self-pinging web service |

---

## 📂 Project Architecture

```
codewithnarayan-fullstack/
├── backend/
│   ├── middleware/
│   │   └── adminAuth.js        # Admin authorization middleware
│   ├── routes/
│   │   ├── admin.js            # Admin analytics & authentication
│   │   ├── categoryHubs.js     # Category Hubs CRUD with MySQL sync
│   │   ├── contact.js          # User contact messages
│   │   ├── notes.js            # Notes management API
│   │   ├── progress.js         # Roadmap user progress tracking
│   │   ├── requests.js         # Student note request submissions
│   │   ├── roadmaps.js         # Developer career roadmaps API
│   │   └── topicNotes.js       # Formatted multi-page topic notes
│   ├── db.js                   # MySQL pool connection & table initialization
│   ├── server.js               # Express app, compression, CORS & keep-alive
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AboutSection.jsx        # Founder & platform bio
    │   │   ├── AddNoteModal.jsx        # Admin note upload modal
    │   │   ├── AdminLoginModal.jsx     # Admin passkey portal
    │   │   ├── AnnouncementBanner.jsx  # Top headline banner
    │   │   ├── BottomNav.jsx           # Mobile touch navigation bar
    │   │   ├── BundlesSection.jsx      # Curated placement bundles
    │   │   ├── CategoryHubSection.jsx  # Interactive Category Hubs & DB sync
    │   │   ├── ChatWidget.jsx          # Live student support widget
    │   │   ├── CheatsheetSection.jsx   # Quick revision syntax cheatcodes
    │   │   ├── CommandPalette.jsx      # Ctrl+K spotlight search
    │   │   ├── ContactSection.jsx      # Contact form
    │   │   ├── Footer.jsx              # Footer links & socials
    │   │   ├── Header.jsx              # Glassmorphic header & stats
    │   │   ├── Hero.jsx                # Animated hero headline & search
    │   │   ├── HubCategoryModal.jsx    # Admin category editor modal
    │   │   ├── NoteCard.jsx            # Handwritten note card
    │   │   ├── NoteModal.jsx           # Note details & PDF download
    │   │   ├── NotesSection.jsx        # Subject filter tabs & grid
    │   │   ├── QuizSection.jsx         # Daily placement MCQ challenge
    │   │   ├── RecentlyViewed.jsx      # Recently browsed notes
    │   │   ├── RequestNoteModal.jsx    # Request a custom note modal
    │   │   ├── RoadmapSection.jsx      # Interactive learning paths
    │   │   └── Toast.jsx               # Floating toast notifications
    │   ├── api.js                      # Centralized API service layer
    │   ├── App.jsx                     # Main application layout
    │   ├── index.css                   # Global styles, variables & animations
    │   └── main.jsx                    # React root entrypoint
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Quick Start & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/narayan1483/codewithnarayan.git
cd codewithnarayan-fullstack
```

### 2. Setup Backend
```bash
cd backend
npm install

# Configure your environment variables (.env):
# PORT=5000
# MYSQL_HOST=your-mysql-host
# MYSQL_PORT=your-mysql-port
# MYSQL_USER=your-mysql-user
# MYSQL_PASSWORD=your-mysql-password
# MYSQL_DATABASE=defaultdb
# ADMIN_PASSWORD=your-admin-password

npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Live Deployments

| Component | Platform | Live URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [codewithnarayan.vercel.app](https://codewithnarayan.vercel.app) |
| **Backend API** | Render | [codewithnarayan-backend.onrender.com](https://codewithnarayan-backend.onrender.com) |
| **Database** | Aiven Cloud | MySQL 8.0 Cloud Cluster |

---

## 👤 Founder & Creator

<div align="center">

**Narayan Prasad Maurya**  
*Founder & Full Stack Developer, code.withnarayan*

[![Instagram](https://img.shields.io/badge/Instagram-@code.withnarayan-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/code.withnarayan)
[![GitHub](https://img.shields.io/badge/GitHub-@narayan1483-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/narayan1483)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, customize, and share.

<div align="center">
  <sub>Crafted with passion & precision by <b>Narayan Prasad Maurya</b> ❤️</sub>
</div>
