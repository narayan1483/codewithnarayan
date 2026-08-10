
<div align="center">

# 📝 code.withnarayan

### Handwritten notes that get you hired.

Subject-wise, exam-ready notes for **DSA · Java · Web Dev · System Design · DBMS · OS** — built by students, for students.

[![Live Site](https://img.shields.io/badge/Live-codewithnarayan.vercel.app-1a73e8?style=for-the-badge&logo=vercel)](https://codewithnarayan.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://codewithnarayan-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#-license)

</div>

---

## 📌 About

**code.withnarayan** is a notes marketplace where students can browse, search and download subject-wise handwritten notes. Sellers/admins can publish new notes instantly — just like adding a product listing on an e-commerce platform.

Built and maintained by **Narayan Prasad Maurya**.

---

## ✨ Features

- 🔍 **Search & filter** notes by subject (DSA, Java, Web Dev, System Design, DBMS, OS)
- 🎨 Notebook-inspired UI — each subject has its own signature color, like colored index tabs
- ➕ **Add Note** flow — publish new notes instantly, live on the site right away
- 📬 Working **Contact form** to reach out directly
- 📱 Fully responsive — mobile hamburger nav included
- ⚡ Fast, modern stack — React + Vite frontend, Node/Express backend

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React (Vite), Tailwind-style CSS     |
| Backend    | Node.js, Express                     |
| Database   | MongoDB                              |
| Hosting    | Frontend → **Vercel** · Backend → **Render** |

---

## 📂 Project Structure

```
codewithnarayan/
├── backend/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   ├── db.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/narayan1483/codewithnarayan.git
cd codewithnarayan
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values (DB URL, ADMIN_PASSWORD, etc.)
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and connects to the backend API.

---

## 🌐 Deployment

| Part      | Platform | URL |
|-----------|----------|-----|
| Frontend  | Vercel   | [codewithnarayan.vercel.app](https://codewithnarayan.vercel.app) |
| Backend   | Render   | [codewithnarayan-backend.onrender.com](https://codewithnarayan-backend.onrender.com) |

> ⚠️ Backend is on Render's free tier — it may take 20–30s to wake up after inactivity.

---

## 👤 Owner

**Narayan Prasad Maurya**
Founder & Developer, code.withnarayan

📷 Instagram: [@code.withnarayan](https://instagram.com/code.withnarayan)
▶️ YouTube: _add your link_
💻 GitHub: [@narayan1483](https://github.com/narayan1483)
🔗 LinkedIn: _add your link_

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify and share with attribution.

<div align="center">

Made with ❤️ by **Narayan Prasad Maurya**

</div>
