import express from 'express';
import { db } from '../config/database.js';
import bcrypt from 'bcrypt';

const userSetupRoute = express.Router();

userSetupRoute.post('/v1/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const response = await db.oneOrNone(
            `SELECT 
                id, fullname, contact_number, email, role, password, is_active 
                FROM users 
                WHERE username = $1
            `, [username]
        );

        if (!response) {
            return res.json({
                message: 'Invalid login credentials',
                success: false
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            response.password
        )

        if (!passwordMatch) {
            return res.json({
                message: 'Invalid login credentials',
                success: false
            });
        }

        await db.none(`UPDATE users SET last_login = NOW() WHERE id = $1`, [ response.id ]);

        req.session.user = {
            id: response.id,
            fullname: response.fullname,
            role: response.role
        };

        req.session.save((err) => {

            if (err) {
                console.error('Session save error:', err);

                return res.status(500).json({
                    success: false,
                    message: 'Session failed to save'
                });
            }

            console.log('SESSION AFTER SAVE:', req.session);

            return res.json({
                message: 'Login successful!',
                success: true,
                user: req.session.user
            });
        });
        
    } catch (err) {
        console.error('Login Error: ', err);
    }
});




userSetupRoute.post('/v1/logout', async (req, res) => {
    const sid = req.sessionID;

    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session: ', err);
            return res.status(500).send('Failed to logout');
        } 

        res.clearCookie('bedspacio_session');
        res.send(`Session id ${sid} logged out successfully!`);
    });
})



export default userSetupRoute;