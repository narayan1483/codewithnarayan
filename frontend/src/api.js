const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ADMIN_KEY = "codewithnarayan_admin_password";

const normalize = (n) => ({ ...n, desc: n.description, driveLink: n.drive_link });

export function getAdminPassword() {
  return localStorage.getItem(ADMIN_KEY) || "";
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_KEY);
}

export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Login failed");
  }
  localStorage.setItem(ADMIN_KEY, password);
  return true;
}

export async function fetchNotes() {
  const res = await fetch(`${API_BASE}/api/notes`);
  if (!res.ok) throw new Error("Failed to load notes");
  const data = await res.json();
  return data.map(normalize);
}

export async function createNote(form) {
  const body = new FormData();
  body.append("title", form.title);
  body.append("subject", form.subject);
  body.append("pages", form.pages);
  body.append("level", form.level);
  body.append("description", form.desc);
  if (form.pdfFile) body.append("pdf", form.pdfFile);
  if (form.driveLink) body.append("driveLink", form.driveLink);

  const res = await fetch(`${API_BASE}/api/notes`, {
    method: "POST",
    headers: { "x-admin-password": getAdminPassword() },
    body,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) clearAdminSession();
    throw new Error(err.error || "Failed to publish note");
  }
  const data = await res.json();
  return normalize(data);
}

export async function updateNote(id, form) {
  const body = new FormData();
  if (form.title !== undefined) body.append("title", form.title);
  if (form.subject !== undefined) body.append("subject", form.subject);
  if (form.pages !== undefined) body.append("pages", form.pages);
  if (form.level !== undefined) body.append("level", form.level);
  if (form.desc !== undefined) body.append("description", form.desc);
  if (form.driveLink !== undefined) body.append("driveLink", form.driveLink);
  if (form.pdfFile) body.append("pdf", form.pdfFile);
  if (form.removeFile) body.append("removeFile", "true");

  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: "PUT",
    headers: { "x-admin-password": getAdminPassword() },
    body,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) clearAdminSession();
    throw new Error(err.error || "Failed to update note");
  }
  const data = await res.json();
  return normalize(data);
}

export async function deleteNote(id) {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: "DELETE",
    headers: { "x-admin-password": getAdminPassword() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) clearAdminSession();
    throw new Error(err.error || "Failed to delete note");
  }
  return res.json();
}

export function downloadNoteUrl(id) {
  return `${API_BASE}/api/notes/${id}/download`;
}

export async function sendContactMessage(form) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send message");
  }
  return res.json();
}

// ─── Feature #5: Note Requests API ────────────────────────────────
export async function sendNoteRequest(form) {
  const res = await fetch(`${API_BASE}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit note request");
  }
  return res.json();
}

export async function fetchNoteRequests() {
  const res = await fetch(`${API_BASE}/api/requests`, {
    headers: { "x-admin-password": getAdminPassword() },
  });
  if (!res.ok) throw new Error("Failed to load requests");
  return res.json();
}

// ─── Feature #6: Admin Analytics API ──────────────────────────────
export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/api/admin/stats`, {
    headers: { "x-admin-password": getAdminPassword() },
  });
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json();
}

// ─── Feature #7: Global Progress Sync (Cross-device) ──────────────
// Kisi bhi device se same completed topics dikhne ke liye
export async function fetchProgress() {
  const res = await fetch(`${API_BASE}/api/progress`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  const data = await res.json();
  return data.completedIds || [];
}

export async function saveProgress(completedIds) {
  const res = await fetch(`${API_BASE}/api/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completedIds }),
  });
  if (!res.ok) throw new Error("Failed to save progress");
  return res.json();
}

// ─── Feature #8: Roadmap Data Sync (Cross-device) ─────────────────
// Admin ke changes har jagah dikhne ke liye — localStorage nahi, DB mein save hoga

// Sab roadmap tracks fetch karo (public)
export async function fetchRoadmaps() {
  const res = await fetch(`${API_BASE}/api/roadmaps`);
  if (!res.ok) throw new Error("Failed to fetch roadmaps");
  return res.json(); // { roadmaps: {...} | null, seeded: boolean }
}

// Pehli baar: INITIAL_ROADMAP_DATA ko DB mein seed karo (admin only)
export async function seedRoadmaps(roadmaps) {
  const res = await fetch(`${API_BASE}/api/roadmaps/seed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": getAdminPassword(),
    },
    body: JSON.stringify({ roadmaps }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) clearAdminSession();
    throw new Error(err.error || "Failed to seed roadmaps");
  }
  return res.json();
}

// Naya roadmap track create karo (admin only)
export async function createRoadmapTrack(track) {
  const res = await fetch(`${API_BASE}/api/roadmaps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": getAdminPassword(),
    },
    body: JSON.stringify(track),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) clearAdminSession();
    throw new Error(err.error || "Failed to create roadmap track");
  }
  return res.json();
}

// Existing track update karo — steps/title/desc (admin only)
export async function updateRoadmapTrack(id, data) {
  const res = await fetch(`${API_BASE}/api/roadmaps/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": getAdminPassword(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) clearAdminSession();
    throw new Error(err.error || "Failed to update roadmap track");
  }
  return res.json();
}

// Track delete karo (admin only)
export async function deleteRoadmapTrack(id) {
  const res = await fetch(`${API_BASE}/api/roadmaps/${id}`, {
    method: "DELETE",
    headers: { "x-admin-password": getAdminPassword() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) clearAdminSession();
    throw new Error(err.error || "Failed to delete roadmap track");
  }
  return res.json();
}

