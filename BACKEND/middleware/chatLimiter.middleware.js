import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many messages, please slow down and try again later.',
        success: false,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id?.toString() || ipKeyGenerator(req.ip),
});

export default chatLimiter;