import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
    message: {
        status: 429,
        message: 'Quá nhhiều yêu cầu, vui lòng thử lại sau 1 phút'
    }
});

export default limiter;