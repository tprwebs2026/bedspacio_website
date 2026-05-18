export const requireAuth = (req, res, next) => {
    const user = req.session?.user;

    if (!user?.id) {
        return res.status(401).json({
            message: 'Unauthorized',
            error: 'Authentication required'
        });
    }

    req.user = user;

    next();
};