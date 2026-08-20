# ⚛️ code.withnarayan — Frontend Client

Modern React 18 + Vite web client for **code.withnarayan**, designed with rich aesthetics, smooth animations, and full mobile touch responsiveness.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://codewithnarayan.vercel.app)

---

## 🌟 Key Features

- 🗂️ **Dynamic Category Hubs:** 6 interactive study hub boxes with smooth sliding expansion & 24/7 MySQL cloud sync.
- 🏆 **Daily Interview Placement Quiz:** Interactive MCQ test with real-time score calculation, instant green/red explanations, and admin question controls.
- 📦 **Curated Placement Bundles:** Complete revision packs for DSA, Java, and System Design with one-click multi-note access.
- ⚡ **Cheatcodes Explorer:** Fast revision syntax sheets with one-click code copy and quick subject filters.
- 🎯 **Career Roadmaps:** Visual milestone tracks for Frontend, Backend, DevOps, DSA & System Design with persistent progress.
- 🔍 **Spotlight Command Palette:** Instant `Ctrl + K` search across notes, subjects, and study materials.
- 📱 **Mobile Touch Bottom Navigation:** Floating glassmorphic bottom bar (`BottomNav.jsx`) optimized for all mobile screens (320px–768px).
- 🌓 **Dark / Light Mode:** Persistent theme switcher with frosted glass header backdrop.

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (.env)
Create a `.env` file in the `frontend` root:
```env
VITE_API_URL=https://codewithnarayan-backend.onrender.com
# For local backend testing, use:
# VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Component Structure

```
frontend/src/
├── components/
│   ├── AboutSection.jsx         # Founder bio & mission
│   ├── AddNoteModal.jsx         # Admin note upload modal (PDF / Drive)
│   ├── AdminLoginModal.jsx      # Admin passkey login modal
│   ├── AnnouncementBanner.jsx   # Top dynamic announcement ribbon
│   ├── BottomNav.jsx            # Mobile floating bottom touch bar
│   ├── BundlesSection.jsx       # Placement bundles cards
│   ├── CategoryHubSection.jsx   # Category Hubs with MySQL backend sync
│   ├── ChatWidget.jsx           # Floating/integrated student chat
│   ├── CheatsheetSection.jsx    # Syntax sheets with instant copy
│   ├── CommandPalette.jsx       # Spotlight search (Ctrl+K)
│   ├── ContactSection.jsx       # Direct contact form
│   ├── Footer.jsx               # Footer links & socials
│   ├── Header.jsx               # Glassmorphic header & stats
│   ├── Hero.jsx                 # Animated gradient hero & search
│   ├── HubCategoryModal.jsx     # Admin category editor modal
│   ├── NoteCard.jsx             # Individual handwritten note card
│   ├── NoteModal.jsx            # PDF viewer modal & download
│   ├── NotesSection.jsx         # Subject filter tabs & note grid
│   ├── QuizSection.jsx          # Daily Placement MCQ challenge
│   ├── RecentlyViewed.jsx       # Recently viewed notes history
│   ├── RequestNoteModal.jsx     # Student note request modal
│   ├── RoadmapSection.jsx       # Interactive career roadmaps
│   ├── Toast.jsx                # Floating toast notifications
│   ├── TopicNotesViewer.jsx     # Multi-page topic notes reader
│   └── TrendingSection.jsx      # Trending notes of the week
├── api.js                       # Centralized API service layer
├── App.jsx                      # Main app shell & section coordinator
├── index.css                    # Design tokens, mobile CSS & animations
└── main.jsx                     # Vite React entry point
```

---

## 🔒 Admin Controls

Click the **Lock icon** in the top navigation and enter your admin password:
- **Add / Edit Notes:** Upload PDFs or link Google Drive files.
- **Manage Category Hubs:** Create, edit colors, change icons, reorder, or delete category boxes with live MySQL sync.
- **Manage Quiz Questions:** Publish new interview questions or update existing ones.
- **View Live Analytics:** Total notes, downloads, messages, and student requests directly in the top admin bar.

---

## 🌐 Deployment (Vercel)

The frontend is configured for zero-config deployments on **Vercel**:
1. Connect your GitHub repository to Vercel.
2. Set Root Directory to `frontend`.
3. Add Environment Variable `VITE_API_URL` pointing to your backend URL.
4. Deploy!
