import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";
import contactRouter from "./routes/contact.js";
import adminRouter from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "code.withnarayan backend is running ✅",
    tip: "This is the API server — your website is at http://localhost:5173",
    endpoints: ["/api/health", "/api/notes", "/api/contact", "/api/admin/login"],
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "code.withnarayan backend is running" });
});

app.use("/api/notes", notesRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);

// basic error handler (e.g. multer file-type errors)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ code.withnarayan backend running at http://localhost:${PORT}`);
});
