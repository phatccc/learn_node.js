module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        const role = req.decode?.role;

        if(!role)
            return res.status(401).send('Access denied. No token provided');

        if(!allowedRoles.includes(role))
            return res.status(403).send('Access denied. Invalid role');

        next();
    }
}