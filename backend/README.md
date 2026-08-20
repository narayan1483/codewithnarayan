# ⚙️ code.withnarayan — Backend API

High-performance Node.js & Express REST API powered by **Aiven MySQL 8.0 Cloud Database**, with automatic schema migrations, gzip response compression, and keep-alive pinging.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/Database-Aiven%20MySQL-4479A1?style=flat-square&logo=mysql)](https://aiven.io)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render)](https://codewithnarayan-backend.onrender.com)

---

## 🌟 Key Architecture & Features

- 🗄️ **Aiven MySQL Cloud Database:** Relational database with connection pooling (`mysql2/promise`), SSL encryption, and auto table initialization.
- ⚡ **Gzip Response Compression:** Powered by `compression` middleware for ultra-fast JSON delivery.
- 🔄 **Keep-Alive Self Ping:** Periodic 14-minute self-pinging mechanism preventing Render free tier cold starts.
- 🔐 **Admin Authentication:** Secure header-based verification (`x-admin-password`) protecting mutation endpoints.
- 📁 **File Uploads & Drive Support:** Multer upload engine handling PDF uploads with auto-directory creation and Drive link fallbacks.
- 🌐 **Universal CORS:** Pre-configured for seamless communication with Vercel frontend deployments and local dev servers.

---

## 🛠️ Environment Variables (.env)

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MYSQL_HOST=your-aiven-mysql-host.aivencloud.com
MYSQL_PORT=your-mysql-port
MYSQL_USER=avnadmin
MYSQL_PASSWORD=your-secure-password
MYSQL_DATABASE=defaultdb
ADMIN_PASSWORD=your-admin-passkey
RENDER_EXTERNAL_URL=https://codewithnarayan-backend.onrender.com
```

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`. Test the health check at `http://localhost:5000/api/health`.

---

## 📡 API Endpoints Reference

### 1. Notes Management (`/api/notes`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Public | List all notes with subject, download counts & tags |
| `POST` | `/api/notes` | **Admin** | Create new note (Supports PDF upload & Drive links) |
| `PUT` | `/api/notes/:id` | **Admin** | Update existing note details |
| `DELETE` | `/api/notes/:id` | **Admin** | Delete note and remove stored file |
| `GET` | `/api/notes/:id/download` | Public | Stream PDF download and increment download counter |

### 2. Category Hubs (`/api/hubs`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hubs` | Public | Fetch all category hub boxes (Auto-seeded if empty) |
| `POST` | `/api/hubs` | **Admin** | Create custom category box |
| `PUT` | `/api/hubs/:id` | **Admin** | Update category card colors, icons, targets & badges |
| `DELETE` | `/api/hubs/:id` | **Admin** | Delete category box |
| `POST` | `/api/hubs/reset` | **Admin** | Reset category hubs to default 6 curated boxes |

### 3. Roadmaps & Topic Notes (`/api/roadmaps` & `/api/topic-notes`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/roadmaps` | Public | Get all career learning roadmaps |
| `POST` | `/api/roadmaps` | **Admin** | Create new career track |
| `GET` | `/api/topic-notes/:topicId` | Public | Fetch multi-page formatted topic guide |

### 4. Admin & Analytics (`/api/admin`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Public | Validate admin password |
| `GET` | `/api/admin/stats` | **Admin** | Live aggregate counts (Notes, Downloads, Messages, Requests) |

### 5. Inquiries & Requests (`/api/contact` & `/api/requests`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Public | Submit user contact message |
| `GET` | `/api/contact` | **Admin** | View all user contact messages |
| `POST` | `/api/requests` | Public | Submit student note request |
| `GET` | `/api/requests` | **Admin** | View student requests |

---

## 🗄️ Database Tables Initialized

- `notes` — Subject notes, pages, levels, downloads, links & PDF paths.
- `category_hubs` — Interactive category cards, gradients, badges, action types & targets.
- `roadmaps` — Structured learning paths with sub-milestones.
- `topic_notes` — Multi-page rich notes content.
- `contact_messages` — Inbound student messages & feedback.
- `note_requests` — Requested topics & urgency levels.
- `user_progress` — User roadmap completion tracking.

---

## 🌐 Deployment (Render)

1. Create a **Web Service** on [Render](https://render.com).
2. Connect your repository and set Root Directory to `backend`.
3. Set Build Command to `npm install` and Start Command to `npm start`.
4. Add your Environment Variables (`MYSQL_HOST`, `MYSQL_PASSWORD`, `ADMIN_PASSWORD`, etc.).
5. Set `RENDER_EXTERNAL_URL` to your live Render service URL for auto-keepalive.
