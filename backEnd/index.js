import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';

import studyRoutes from "./routes/studyRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Your frontend URL
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Allowed origins
const allowedOrigins = [
  CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

console.log("Allowed CORS Origins:", allowedOrigins);

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools without origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/study", studyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
