import express from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

import { generatePassword } from '../utils/generatePassword.js';
import { userImage } from '../middleware/multer.js';

import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary.js';

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
                contact_number,
                profile_image
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
            message: 'User Created Succesfully',
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


userRoute.get('/v1/users', requireAuth, async (req, res) => {
    try {

        const response = await db.manyOrNone(
            `SELECT 
                id, 
                username,
                fullname,
                role,
                is_active,
                profile_image,
                last_login
            FROM users
            ORDER BY id ASC`
        );

        console.log(response);

        return res.status(200).json(response);

    } catch (err) {
        console.error('Error retrieving users: ', err);

        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
});


userRoute.get('/v1/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            throw new Error('ID required');
        }

        const response = await db.one(`
            SELECT
                id,
                fullname,
                username,
                contact_number,
                email,
                role,
                is_active,
                profile_image
            FROM users 
            WHERE id = $1
        `, [id]);

        return res.status(200).json(response)

    } catch(err) {
        console.error('Failed to retreive user data: ', err);
    }
});


userRoute.delete('/v1/users/:id', requireAuth, async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error('Invalid user id')
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "No authority to delete user" })
        }


        const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        console.log('user to delete: ', user);

        if (user.profile_image) {
            const filePath = path.join(
                process.cwd(),
                'file/user',
                user.profile_image
            );

            try {
                await fs.unlink(filePath)
            } catch (err) {
                console.log('File not found: ', err)
            }
        };

        await db.none(
            `DELETE FROM users WHERE id = $1`,
            [id]
        );

        console.log('Deleted: ', user.id);

        res.status(200).json({
            message: 'Deleted successfully!'
        })

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message || 'Internal server error'
        });
    }
});



userRoute.patch('/v1/profile/:id', requireAuth, userImage.single('profile_image'), async (req, res) => {
    try {

        // TODO 
        // set update for all fields inside 'users' table (mainly for image)

        const id = Number(req.params.id);
        const user_image = req.file;

        const user = await db.oneOrNone(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        const { ...userUpdates } = req.body;


        if (user_image) {
            if (user?.user_public_id) {
                await deleteFromCloudinary(
                    user.user_public_id
                )
            };

            const imageUpload = await uploadToCloudinary(
                user_image,
                'bedspacio/user'
            );

            userUpdates.profile_image = imageUpload.secure_url;
            userUpdates.user_public_id = imageUpload.public_id;
        }

        if ((Object.keys(userUpdates).length > 0)) {
            const keys = Object.keys(userUpdates);

            const setUserClause = keys
                .map((key, index) => `${key} = $${index+1}`)
                .join(', ');

            const values = keys.map(key => userUpdates[key])
            console.log('Values updated to user: ', values);

            const result = await db.oneOrNone(
                `UPDATE users 
                SET ${setUserClause}
                WHERE id = $${keys.length + 1}
                RETURNING *`,
                [...values, user.id]
            )

            return res.status(200).json({ 
                success: true,
                data: result 
            })
        };
    } catch (err) {
        console.error('Error updating user profile: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
});


userRoute.patch('/v1/users/:id', requireAuth, async (req, res) => {
    try {

        const id = Number(req.params.id);
        if (isNaN(id)) {
            throw new Error('Id must be a number');
        }

        const user = await db.oneOrNone(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const { ...userUpdates } = req.body; 

        const assignedBranches = await db.any(
            `SELECT id, name
            FROM branches
            WHERE property_manager_id = $1`,
            [id]
        );

        const hasBranches = assignedBranches.length > 0;

        // block deactivation
        if (
            user.role === 'property_manager' &&
            userUpdates.is_active === false &&
            hasBranches
        ) {
            return res.status(409).json({
                message: 'Reassign branches before deactivating this manager',
                branches: assignedBranches
            });
        }

        // block role change
        if (
            user.role === 'property_manager' &&
            userUpdates.role === 'admin' &&
            hasBranches
        ) {
            return res.status(409).json({
                message: 'Reassign branches before changing role',
                branches: assignedBranches
            });
        }

        if (Object.keys(userUpdates).length > 0) {
            const keys = Object.keys(userUpdates);

            const setUserClause = keys 
                .map((key, index) => `${key} = $${index + 1}`)
                .join(', ');

            const values = keys.map(key => userUpdates[key]);

            await db.oneOrNone(
                `UPDATE users 
                SET ${setUserClause},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $${keys.length + 1}
                RETURNING *`,
                [...values, id]
            )
        };

        return res.status(200).json({
            success: true,
            message: 'Update successfull'
        })
        

    } catch (err) {
        console.error('Error updating user: ', err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})


userRoute.get('/v1/property_manager', async (req, res) => {
    try {
        const response = await db.manyOrNone(
            `SELECT 
                id, 
                fullname,
                profile_image
            FROM users 
            WHERE 
                role = 'property_manager' AND
                is_active = true
                `
        );

        return res.status(200).json(response);

    } catch (err) {
        console.error('Error retrieving users: ', err);
    }
});



userRoute.patch('/v1/password', requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized (missing user id)'
            });
        }

        const {
            old_password,
            new_password,
            confirm_password
        } = req.body;

        console.log('Request body:', req.body);

        if (!old_password || !new_password || !confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'Please complete all required fields.'
            });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        const password_regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/;

        if (!password_regex.test(new_password)) {
            return res.status(400).json({
                success: false,
                message:
                    'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character'
            });
        }

        const user = await db.oneOrNone(
            `SELECT id, password FROM users WHERE id = $1`,
            [userId]
        );


        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(old_password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Old password is incorrect'
            });
        }

        const same_password = await bcrypt.compare(new_password, user.password);

        if (same_password) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from old password'
            });
        }

        const hashed_password = await bcrypt.hash(new_password, 10);

        await db.none(
            `
            UPDATE users
            SET password = $1,
                updated_at = NOW()
            WHERE id = $2
            `,
            [hashed_password, userId]
        );

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (err) {
        console.log('Error changing password: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});




export default userRoute;