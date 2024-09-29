const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const qs = require('qs');
const User = require('../models/UserModel');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
    const { code } = req.body;
    console.log('Received authorization code:', code);
    try {
        // Exchange authorization code for tokens
        const response = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'postmessage',
            grant_type: 'authorization_code'
        }));
        // Receive id and access tokens
        const { id_token, access_token } = response.data;
        console.log('id token: ', id_token)
        console.log('Tokens received:', response.data);

        // Verify ID token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { sub: googleId, name, email, picture } = ticket.getPayload();
        console.log('Token verified. User info:', { googleId, name, email, picture });

        // Check and retrieve information for User
        let user = await User.findOne({ googleId });
        if (!user) {
            user = new User({ googleId, name, email, picture });
            await user.save();
        }

        res.status(200).json({ user, id_token, access_token });
   
        // if unable to verify token, throw error
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).json({ error: 'Invalid Google token' });
    }
});

router.post('/save-user', async (req, res) => {
    const { id_token } = req.body;
    try {
        // Verify Id token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { sub: googleId, name, email, picture } = ticket.getPayload();
        console.log('Token verified. User info:', { googleId, name, email, picture });

        // Check and retrieve information for User
        let user = await User.findOne({ googleId });
        if (!user) {
            user = new User({ googleId, name, email, picture });
            await user.save();
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(400).json({ error: 'Invalid ID token' });
    }
});

module.exports = router;
