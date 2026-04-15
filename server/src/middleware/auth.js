export const requireAuth = (req, res, next) => {
    if (!req.session?.user?.id) {
        return res.status(401).json({ 
            message: 'Unauthorized', 
            error: 'Authentication required',
        });
    }
    next();
};