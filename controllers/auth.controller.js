const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined')
if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not defined')
console.log(JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET : ')
console.log(JWT_SECRET, 'JWT_SECRET : ')

// Store refresh tokens (in production, use a database)
const refreshTokens = [];

// Register

exports.register = async (req, res) => {
   try {
       const { username , password } = req.body

       const existUser = await User.findOne({username }) ;
       if(existUser) return res.status(400).send('Username already exist')

       const hashedPassword = await bcrypt.hash(password, 12);
       console.log(hashedPassword)

       const user = new User({username , password : hashedPassword})
       await user.save();

       res.status(201).json({message : "User created successfully" , user_id : user._id})
   } catch (error) {
       console.log(error)
   }
}

// Login

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).send('Invalid username or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid username or password');

    const accessToken = jwt.sign(
        { username },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { username },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    // Store refresh token
    refreshTokens.push(refreshToken);

    console.log('Token created successfully');
    console.log('Refresh tokens stored:', refreshTokens.length);
    console.log('Access token:', accessToken);
    console.log('Refresh token:', refreshToken);

    res.json({
        accessToken,
        refreshToken
    });
}

// Profile
exports.profile = (req, res) => {
    res.json({
        user: req.decode.username,
        message: 'Welcome to profile page',
        profile: req.decode
    });
}

// Refresh

exports.refresh = (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is required' })
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            console.log('JWT verification error:', err.message);
            return res.status(403).json({ message: 'Invalid or expired refresh token' })
        }

        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ message: 'Refresh token is no longer valid (server restarted or revoked)' })
        }

        const newAccessToken = jwt.sign(
            { username: decoded.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({ accessToken: newAccessToken })
    })
}