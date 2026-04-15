import express from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import bcrypt from 'bcrypt';
import { generatePassword } from '../utils/generatePassword.js';


const userRoute = express.Router();

userRoute.get('/v1', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Not Authenticated'
        });
    };

    return res.json({
        success: true,
        user: req.session.user
    });
});


userRoute.get('/v1/profile', requireAuth,  async (req, res) => {
    try {
        if (!req.session?.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const id = req.session.user.id;

        console.log('ID: ', id);

        if (!id) throw new Error('ID is required');

        const response = await db.one(
            `SELECT 
                id,
                fullname,
                username,
                email,
                role,
                created_at,
                contact_number
            FROM users 
            WHERE id = $1`,
            [ id ]
        );

        if (response.length === 0) {
            throw new Error('No user found');
        };

        return res.status(200).json(response);

    } catch (err) {
        console.error('Error retrieving profile data: ', err);
    }
})


userRoute.post('/v1/new_user', requireAuth, async (req, res) => {
    try {
        const { 
            fullname, 
            username,
            email,
            contact_number,
            role
        } = req.body

        if (!fullname || !username || !email || !contact_number || !role) {
            throw new Error('Please provide the required fields to proceed.');
        }

        const plainPassword = generatePassword();
        console.log('Plain password: ', plainPassword);

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        await db.none(
            `INSERT INTO
                users (fullname, username, email, contact_number, role, password) 
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [ fullname, username, email, contact_number, role,hashedPassword ]
        );

        return res.json({
            message: 'User created succesfully',
            username: username,
            password: plainPassword
        });

    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({
                message: 'Username or email already exist!'
            });
        };

        console.error('Error creating new user: ', err);
        return res.status(500).json({ message: 'Server error' });
    }
});


export default userRoute;