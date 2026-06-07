import rateLimit from 'express-rate-limit';

// 1. The Global Shield (Standard API Routes)

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, 
    legacyHeaders: false, 
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests from this IP. Please wait 15 minutes."
        });
    }
});

// 2. The Auth Chokehold (Login / Register Routes)

export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to exactly 5 attempts
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many login attempts.Try again in 10 minutes."
        });
    }
});