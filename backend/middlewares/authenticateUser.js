// middlewares/authenticateUser.js
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/UserModel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authenticateUser = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("No Authorization header provided");
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Authorization header:", authHeader);
    console.log("Extracted token:", token);

    if (!token) {
        console.log("No token found after splitting the Authorization header");
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const userId = payload['sub'];

        let user = await User.findOne({ googleId: userId });

        if (!user) {
            user = new User({
                googleId: userId,
                email: payload['email'],
                name: payload['name'],
                picture: payload['picture']
            });
            await user.save();
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error: ", error.message)
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

module.exports = authenticateUser;
