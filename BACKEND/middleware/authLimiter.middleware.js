import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        error: 'Too many attempts from this IP, please try again later.',
        success: false,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
});

export default authLimiter;