const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader) return res.status(401).send('Access denied. No token provided');

    const token = authHeader.split(" ")[1];
    if(!token) return res.status(401).send('Access denied. No token provided');


    jwt.verify(token , process.env.JWT_SECRET , (err , decode) => {
        if(err) return res.status(403).send('Access denied. Invalid token');
        req.decode = decode;
        next();
    })
}