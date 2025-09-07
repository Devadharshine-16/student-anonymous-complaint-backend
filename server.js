import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import i18n from "i18n";
import connectDB from "./db.js";
import complaintRoutes from "./app/routes/complaint.routes.js";
import authRoutes from "./app/routes/auth.routes.js";
import forumRoutes from "./app/routes/forum.routes.js";
import { detectLanguage } from "./config/i18n.js";
import studentRoutes from "./app/routes/studentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Configure i18n
i18n.configure({
  locales: ["en", "es", "fr", "de", "hi", "ar"],
  defaultLocale: "en",
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
});

// ✅ Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:4200", // Angular dev
      "https://student-anonymous-complaint.vercel.app", // ✅ Vercel frontend
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(i18n.init);
app.use(detectLanguage);
app.use(express.static(path.join(__dirname)));

// ✅ API Routes
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/student", studentRoutes);

// ✅ Static HTML routes (optional if you still use plain HTML pages)
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "register.html"))
);
app.get("/view_complaints", (req, res) =>
  res.sendFile(path.join(__dirname, "view_complaints.html"))
);
app.get("/user_complaints", (req, res) =>
  res.sendFile(path.join(__dirname, "user_complaints.html"))
);

// ✅ Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Complaint Management System is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
