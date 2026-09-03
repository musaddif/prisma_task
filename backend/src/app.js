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
// CORS Configuration - Fixed for Railway
// =============================================
const allowedOrigins = [
  process.env.FRONTEND_URL, // Your frontend URL from environment
  "http://localhost:5173", // Local development
  "http://localhost:3000", // Alternative local port
].filter(Boolean); // Remove undefined values

// For Railway, also allow all Railway.app subdomains dynamically
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests with no origin (like mobile apps, curl, etc.)
  if (!origin) {
    return next();
  }
  
  // Check if origin is allowed
  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed === '*') return true;
    // Allow all Railway subdomains
    if (allowed?.includes('railway.app') && origin.includes('railway.app')) {
      return true;
    }
    return allowed === origin;
  });
  
  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Original CORS middleware as fallback (with more permissive settings)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // Allow any Railway subdomain (for flexibility)
      if (origin.includes('railway.app')) {
        return callback(null, true);
      }
      
      // For development, allow localhost
      if (origin.includes('localhost')) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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