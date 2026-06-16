import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import fs from 'fs/promises'
import path from 'path'

import { db } from '../config/database.js';
import { branchImage } from '../middleware/multer.js';

const branchRoute = express.Router();

/*
    THIS ROUTE WILL BE USED TO RETRIEVE INFORMATION ABOUT:
    > branch details
    > landmark details
*/



branchRoute.post('/v1/new', requireAuth, branchImage.single('branch_image'), async (req, res) => {
    try {
        const { name, address, userId } = req.body;
        const landmarks = JSON.parse(req.body.landmarks);
        const image_file = req.file.filename;


        const result = await db.tx(async (t) => {

            // 1. Insert branch
            const branch = await t.one(
                `INSERT INTO branches (name, address, property_manager_id, branch_image)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id`,
                [name, address, userId, image_file]
            );

            // 2. Insert landmarks (ignore duplicates)
            await t.none(
                `INSERT INTO landmarks (landmark)
                    SELECT UNNEST($1::text[])
                    ON CONFLICT (landmark) DO NOTHING`,
                [landmarks]
            );

            // 3. Get all landmark IDs (existing + new)
            const landmarkRows = await t.any(
                `SELECT id FROM landmarks WHERE landmark = ANY($1)`,
                [landmarks]
            );

            const landmarkIds = landmarkRows.map(l => l.id);

            // 4. Insert into join table
            await t.none(
                `INSERT INTO branch_landmarks (branch_id, landmark_id)
                    SELECT $1, UNNEST($2::int[])`,
                [branch.id, landmarkIds]
            );

            return {
                branchId: branch.id,
                landmarkIds
            };
        });

        return res.status(201).json({
            message: 'Branch created successfully',
            data: result
        });

    } catch (err) {
        console.error('Create branch error:', err);

        return res.status(500).json({
            message: 'Failed to create branch'
        });
    }
});


branchRoute.get('/v1/all', async (req, res) => {
    try {

        // get name, address, landmarks, property manager

        const response = await db.manyOrNone(
            `SELECT 
                b.id,
                b.name AS branch_name,
                b.branch_image AS image,
                b.address,
                u.fullname AS property_manager
            FROM branches b
            JOIN users u 
                ON u.id = b.property_manager_id
            GROUP BY 
                b.id, 
                b.name, 
                b.branch_image,
                b.address, 
                u.fullname
            ORDER BY id ASC
            `
        );

        return res.json(response);

    } catch (err) {
        console.error('Error retrieving branches: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } 
});


branchRoute.get('/v1/name', async (req, res) => {
    try {
        const result = await db.manyOrNone(
            `SELECT 
                b.id AS branch_id,
                b.name AS branch_name,
                u.id AS property_manager_id,
                u.fullname AS property_manager
            FROM branches b
            JOIN users u ON b.property_manager_id = u.id`
        );
        
        return res.status(200).json(result)

    } catch(err) {
        console.log('Error retrieving branch names: ', err);
    }
})


branchRoute.get('/v1/preview', async (req, res) => {
    try {
        const response = await db.manyOrNone(
            `SELECT id, name, address, branch_image
            FROM branches
            `
        );

        if (!response) {
            return res.status(204).json({
                success: true,
                message: 'No branch found'
            });
        }

        return res.status(200).json(response);

    } catch (err) {
        console.error('Error retrieving branches: ', err);
        return res.status(500).json({ message: 'Internal server error' })
    }
})



branchRoute.get('/v1/preview/name-address', async (req, res) => {
    try {
        const response = await db.manyOrNone(
            `SELECT id, name, address FROM branches`
        );

        if (response.length === 0) {
            return res.status(201).json({
                success: true,
                message: 'No branches found'
            })
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error('Error retrieving branch data: '. err);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

branchRoute.get('/v1/:id', async (req, res) => {
    try{
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error('Id must be a number')
        }

        const response = await db.oneOrNone(
            `SELECT 
                b.id,
                b.name AS branch_name,
                b.branch_image AS image,
                b.property_manager_id,
                b.address,
                u.fullname AS property_manager,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', l.id,
                            'landmark', l.landmark
                        )
                    ) FILTER (WHERE l.id IS NOT NULL),
                    '[]'
                ) AS landmarks
            FROM branches b
            JOIN users u ON u.id = b.property_manager_id
            LEFT JOIN branch_landmarks bl ON bl.branch_id = b.id
            LEFT JOIN landmarks l ON l.id = bl.landmark_id
            WHERE b.id = $1
            GROUP BY b.id, b.name, b.branch_image, b.address, u.fullname;`,
            [id]
        );

        if (response.length < 0) {
            return res.status(404).json({
                success: false,
                message: 'No branch data found'
            });
        }

        return res.json(response);

    } catch (err) {
        console.error('Error retrieving branch: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});





branchRoute.delete('/v1/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);

        const deletedBranch = await db.oneOrNone(
            `DELETE FROM branches WHERE id = $1
            RETURNING name, branch_image;`, [id]
        );
        
        if (!deletedBranch) {
            return res.status(404).json({ message: 'branch not found' })
        }

        if (deletedBranch.branch_image) {
            const image_path = path.join(
                process.cwd(),
                'file/branch/image',
                deletedBranch.branch_image
            );

            try {
                await fs.unlink(image_path);
                console.log('Image deleted: ', image_path);
            } catch (err) {
                console.log('Failed to delete image: ', err.message);
            }
        }

        await db.none(`
            DELETE FROM landmarks 
            WHERE id NOT in (
                SELECT landmark_id 
                FROM branch_landmarks
            )`
        );

        return res.status(200).json({
            success: true,
            message: `Successfully deleted branch ${deletedBranch.name}`,
            deletedBranch: deletedBranch.name
        })

    } catch (err) {
        console.error('Error deleting branch: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


// branchRoute.patch('/v1/:id', requireAuth, branchImage.single('branch_image'), async (req, res) => {
//     try {
//         const branch_id = Number(req.params.id);

//         const branch = await db.oneOrNone(
//             `SELECT * FROM branches WHERE id = $1`,
//             [branch_id]
//         );

//         if (!branch) return res.status(404).json({ message: 'branch not found' });

//         const {landmarks: rawLandmarks, ...branchUpdates} = req.body;
//         const landmarks = rawLandmarks ? JSON.parse(rawLandmarks) : [];
//         console.log(req.file);

//         if (req.file) {
//             if (branch.branch_image) {
//                 const old_image_path = path.join(
//                     process.cwd(),
//                     'file/branch/image',
//                     branch.branch_image
//                 );

//                 try {
//                     await fs.unlink(old_image_path);
//                     console.log('Removed: ', old_image_path);
//                 } catch (err) {
//                     console.error(err.message);
//                 }
//             };

//             branchUpdates.branch_image = req.file.filename;
//         }

//         if ((Object.keys(branchUpdates)).length > 0) {
//             const keys = Object.keys(branchUpdates);

//             const setBranchClause = keys
//                 .map((key, index) => `${key} = $${index + 1}`)
//                 .join(', ');
            
//             const values = keys.map(key => branchUpdates[key]);
//             console.log('values: ', values);

//             await db.oneOrNone(`
//                 UPDATE branches
//                 SET ${setBranchClause}
//                 WHERE id = $${keys.length + 1}    
//                 RETURNING *
//             `, [...values, branch_id]);
//         } 

//         if (landmarks?.length) {
//             for (const lm of landmarks) {
//                 if (lm.id) {
//                     await db.none(`
//                         UPDATE landmarks
//                         SET landmark = $1
//                         WHERE id = $2
//                     `, [lm.landmark, lm.id]);
//                 } else {
//                     const newLandmark = await db.one(`
//                         INSERT INTO landmarks (landmark)
//                         VALUES ($1)
//                         RETURNING id
//                     `, [lm.landmark]);

//                     await db.none(`
//                         INSERT INTO branch_landmarks (branch_id, landmark_id)
//                         VALUES ($1, $2)
//                     `, [branch_id, newLandmark.id]);
//                 }
//             }
//         }

//         return res.status(200).json({ success: true });

//     } catch (err) {
//         console.error('Error updating branch: ', err);

//         return res.status(500).json({
//             succes: false,
//             message: 'internal server error'
//         })
//     }
// })


branchRoute.patch('/v1/:id', requireAuth, branchImage.single('branch_image'), async (req, res) => {
    try {
        const branch_id = Number(req.params.id);

        const branch = await db.oneOrNone(
            `SELECT * FROM branches WHERE id = $1`,
            [branch_id]
        );

        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        const { landmarks: rawLandmarks, ...branchUpdates } = req.body;
        const landmarksProvided = rawLandmarks !== undefined;
        const landmarks = landmarksProvided
            ? JSON.parse(rawLandmarks)
            : null;

        if (req.file) {
            if (branch.branch_image) {
                const oldImagePath = path.join(
                    process.cwd(),
                    'file/branch/image',
                    branch.branch_image
                );

                try {
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    console.error(err.message);
                }
            }

            branchUpdates.branch_image = req.file.filename;
        }

        if (Object.keys(branchUpdates).length > 0) {
            const keys = Object.keys(branchUpdates);

            const setClause = keys
                .map((key, index) => `${key} = $${index + 1}`)
                .join(', ');

            const values = keys.map(key => branchUpdates[key]);

            await db.none(`
                UPDATE branches
                SET ${setClause}
                WHERE id = $${keys.length + 1}
            `, [...values, branch_id]);
        }

        // Delete removed landmarks
        if (landmarksProvided) {
            const existingLandmarks = await db.any(`
                SELECT l.id
                FROM landmarks l
                JOIN branch_landmarks bl ON bl.landmark_id = l.id
                WHERE bl.branch_id = $1
            `, [branch_id]);

            const incomingIds = landmarks
                .filter(lm => lm.id)
                .map(lm => lm.id);

            const toDelete = existingLandmarks.filter(
                lm => !incomingIds.includes(lm.id)
            );

            for (const lm of toDelete) {
                await db.none(
                    `DELETE FROM branch_landmarks WHERE landmark_id = $1`,
                    [lm.id]
                );

                await db.none(
                    `DELETE FROM landmarks WHERE id = $1`,
                    [lm.id]
                );
            }

            for (const lm of landmarks) {
                if (lm.id) {
                    await db.none(`
                        UPDATE landmarks
                        SET landmark = $1
                        WHERE id = $2
                    `, [lm.landmark, lm.id]);
                } else {
                    const newLandmark = await db.one(`
                        INSERT INTO landmarks (landmark)
                        VALUES ($1)
                        RETURNING id
                    `, [lm.landmark]);

                    await db.none(`
                        INSERT INTO branch_landmarks (branch_id, landmark_id)
                        VALUES ($1, $2)
                    `, [branch_id, newLandmark.id]);
                }
            }
        }

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('Error updating branch:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


export default branchRoute;