import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

// ======================================================
// Debug request logging
// ======================================================

app.use((req, res, next) => {
  console.log(
    `[${req.method}] ${req.originalUrl} - Origin: ${
      req.headers.origin || "No origin"
    }`
  );

  next();
});

// ======================================================
// CORS CONFIGURATION
// IMPORTANT: Keep this BEFORE routes, helmet and auth.
// ======================================================

const allowedOrigins = [
  // Local development
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",

  // Production frontend
  "https://pretty-fulfillment-production-d36b.up.railway.app",

  // Optional frontend URL from Railway environment variable
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without Origin:
    // Postman, curl, Railway health checks, server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] Allowed origin: ${origin}`);
      return callback(null, true);
    }

    console.warn(`[CORS] Blocked origin: ${origin}`);

    return callback(
      new Error(`CORS blocked request from origin: ${origin}`)
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "Accept",
    "X-Requested-With",
  ],

  optionsSuccessStatus: 204,
};

// Apply CORS globally.
//
// The cors package automatically handles OPTIONS
// preflight requests when used as application middleware.
app.use(cors(corsOptions));

// ======================================================
// Security middleware
// ======================================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ======================================================
// Body parsing
// ======================================================

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// ======================================================
// Rate limiter
// ======================================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// ======================================================
// Health check
// ======================================================

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// ======================================================
// Rate limit auth endpoints only
// ======================================================

app.use("/api/auth", authLimiter);

// ======================================================
// Application routes
// ======================================================

app.use("/api", authRoutes);

// ======================================================
// 404 handler
// IMPORTANT: 404 should come BEFORE errorMiddleware
// ======================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ======================================================
// Global error handler
// MUST be last
// ======================================================

app.use(errorMiddleware);

export default app;