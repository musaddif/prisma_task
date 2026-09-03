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
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (origin.includes("railway.app")) return true;
  if (origin.includes("localhost")) return true;
  return allowedOrigins.includes(origin);
};

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
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

// Debug middleware to log all requests (remove in production if needed)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
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