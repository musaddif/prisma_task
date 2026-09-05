import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

// =============================================
// CORS — must run before helmet and all API routes
// =============================================
const allowedOrigins = [
  "https://pretty-fulfillment-production-d36b.up.railway.app",
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

const corsOptions = {
  origin(origin, callback) {
    // Non-browser clients (curl, server-to-server, some health checks)
    if (!origin) {
      return callback(null, true);
    }

    const normalized = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalized)) {
      // Reflect the exact request origin (required when credentials: true)
      return callback(null, normalized);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    // Do not throw — throwing omits Access-Control-Allow-Origin on preflight
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Type"],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

app.use(cors(corsOptions));
// Ensure checkout preflight always gets CORS headers
app.options("/api/checkout", cors(corsOptions));
app.options("/api/health", cors(corsOptions));
app.options("/api/test", cors(corsOptions));

// =============================================
// Security middleware (after CORS)
// =============================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);

// =============================================
// Body parsing middleware
// =============================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =============================================
// Debug middleware to log all requests
// =============================================
app.use((req, res, next) => {
  console.log(
    `[${req.method}] ${req.url} - Origin: ${req.headers.origin || "No origin"}`
  );
  next();
});

// =============================================
// Rate limiting for auth routes
// =============================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api/auth", authLimiter);

// =============================================
// Health check endpoint
// =============================================
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// =============================================
// Test endpoint for debugging CORS
// =============================================
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.headers.origin || "No origin",
    method: req.method,
  });
});

// =============================================
// Routes
// =============================================
app.use("/api", authRoutes);

// =============================================
// Error handling middleware (should be last)
// =============================================
app.use(errorMiddleware);

// =============================================
// 404 handler for routes that don't exist
// =============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;
