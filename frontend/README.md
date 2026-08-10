# code.withnarayan — Frontend

React (Vite) frontend for the code.withnarayan notes marketplace, connected
to a real Node.js backend.

## Run locally

**1. Start the backend first** (see `codewithnarayan-backend/README.md`):
```bash
cd codewithnarayan-backend
npm install
npm run dev
```
Backend runs at `http://localhost:5000`.

**2. Start the frontend:**
```bash
npm install
npm run dev
```
Open the URL it prints (usually http://localhost:5173).

If your backend runs somewhere other than `localhost:5000`, create a `.env`
file here with:
```
VITE_API_URL=https://your-backend-url.com
```

## Admin mode

Click the small **lock icon** in the top-right of the header and log in
with the password set in the backend's `.env` (`ADMIN_PASSWORD`, default
`changeme123` — change it before going live).

Once logged in as admin, you'll see:
- **Add Note** button in the header — publish with a real PDF upload
  *or* a Google Drive link (either works), and type any subject you want
  (not limited to a fixed list)
- A **trash icon** inside any note's detail popup, to delete it

Regular visitors (not logged in) can only browse, search, and download —
they never see Add Note or delete options.

## What's working now (real, not just in-browser)

- Notes catalog — fetched live from the backend/database
- **Add Note** (admin only) — publishes a real note, with a PDF upload or
  a Drive link
- **Delete Note** (admin only) — removes a note and its file permanently
- **Get Notes** — downloads the actual file (uploaded PDF or opens the
  Drive link), and increments the real download counter
- **Contact form** — saves messages to the database (read them via
  `GET /api/contact` on the backend)
- Wishlist, dark mode, admin login session — per-browser (localStorage),
  which is correct since those are personal, not shared data

## Still to add

- Razorpay payment integration
- Deploy backend somewhere with persistent storage (Render/Railway/a VPS)
  and point `VITE_API_URL` at it, then deploy this frontend to Vercel/Netlify
