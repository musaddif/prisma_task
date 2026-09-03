import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

// =============================================
// Security middleware (configured for production)
// =============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
}));

// =============================================
// CORS Configuration - COMPLETE FIX
// =============================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://pretty-fulfillment-production-d36b.up.railway.app",
  "https://pretty-fulfillment-production-7974.up.railway.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow any Railway subdomain
    if (origin.includes('railway.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Check against allowed origins list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.log(`❌ CORS blocked: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
}));

// =============================================
// Handle OPTIONS preflight requests - FIXED
// =============================================
// Use '/*' instead of '*' to avoid path-to-regexp error
app.options('/*', (req, res) => {
  const origin = req.headers.origin;
  
  if (origin && (origin.includes('railway.app') || origin.includes('localhost'))) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
  res.sendStatus(200);
});

// =============================================
// Body parsing middleware
// =============================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =============================================
// Debug middleware to log all requests
// =============================================
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`  User-Agent: ${req.headers['user-agent']?.substring(0, 50)}...`);
  next();
});

// =============================================
// Rate limiting for auth routes
// =============================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increased from 20 for better usability
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// Apply rate limiter to auth routes only
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
    origin: req.headers.origin || 'No origin',
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