# code.withnarayan — Backend

Node.js + Express backend for the notes marketplace, using **lowdb**
(a pure JavaScript JSON-file database — no native compilation, works on
Windows/Mac/Linux without any extra build tools).

## Run locally

```bash
npm install
npm run dev
```

Server starts at `http://localhost:5000`. Check it's alive:
`http://localhost:5000/api/health`

Your data is stored in `data.json` (created automatically on first run).
Uploaded PDFs go in `uploads/`.

## Admin password (IMPORTANT — change this)

A `.env` file is already included with a default password so it works
out of the box:
```
ADMIN_PASSWORD=changeme123
```
**Change this before you deploy anywhere public.** Only whoever knows
this password can publish or delete notes — everyone else can only
browse and download.

## API Endpoints

| Method | Endpoint | Auth | What it does |
|---|---|---|---|
| GET | `/api/notes` | Public | List all notes |
| POST | `/api/notes` | **Admin** | Create a note (multipart form: title, subject, pages, level, description, optional `pdf` file or `driveLink`) |
| GET | `/api/notes/:id/download` | Public | Download the note's PDF (also increments download count) |
| DELETE | `/api/notes/:id` | **Admin** | Delete a note |
| POST | `/api/contact` | Public | Save a contact message (JSON: name, email, message) |
| GET | `/api/contact` | Public | List all contact messages (for you to read) |
| POST | `/api/admin/login` | — | Check a password (JSON: `{ password }`) |

Admin-only routes require an `x-admin-password` header matching
`ADMIN_PASSWORD`. The frontend handles this automatically once you log
in via the lock icon in the header.

## Connecting the frontend

The frontend expects this backend at `http://localhost:5000` by default.
If you deploy this backend somewhere (Render, Railway, Fly.io all have
free tiers), set `VITE_API_URL` in the frontend's `.env` to that live URL.

## Notes on uploads

Uploaded PDFs are saved in `uploads/`. Max file size is 20MB, PDF only.
If you deploy this on a host with an ephemeral filesystem (like Vercel
serverless functions), uploaded files won't persist — use a host with
persistent disk (Render, Railway, a VPS), or use the Drive-link option
on the "Add Note" form instead of uploading.

## Next steps (optional, not built yet)

- Razorpay integration for real payments
- Rate limiting on the contact form
- Multiple admin accounts (currently one shared password)
