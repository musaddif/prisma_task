import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

// Security middleware
app.use(helmet());

// =============================================
// CORS Configuration
// =============================================

// Debug logging for incoming origins
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin || "No origin"}`);
  next();
});

// Determine if an origin is allowed
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  // Allow all Railway subdomains (*.railway.app)
  if (origin.includes("railway.app")) return true;
  // Allow localhost for local development
  if (origin.includes("localhost")) return true;
  // Allow standard http/https schemes
  if (/^https?:\/\//.test(origin)) return true;
  return false;
};

// Main CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  })
);

// Explicitly handle OPTIONS preflight requests (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method !== "OPTIONS") {
    return next();
  }

  const origin = req.headers.origin;

  if (isAllowedOrigin(origin) && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");

  return res.sendStatus(204);
});

// Body parsing middleware
app.use(express.json({ limit: "10kb" }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to auth routes only
app.use("/api/auth", authLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/api", authRoutes);

// Error handling middleware (should be last)
app.use(errorMiddleware);

// 404 handler for routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;