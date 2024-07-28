const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const publicRoutes = ["/api/webhook"];

const authMiddleware = (req, res, next) => {
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    return ClerkExpressWithAuth({
        apiKey: process.env.CLERK_SECRET_KEY,
    })(req, res, () => {
        next();
    });
};

module.exports = authMiddleware;