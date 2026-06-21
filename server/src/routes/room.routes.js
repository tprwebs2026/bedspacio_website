import express from 'express';
import axios from 'axios'
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { customAlphabet } from 'nanoid'

import { roomImage } from '../middleware/multer.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary.js';

const roomRoute = express.Router();

// --------------------------- POSTGRESQL ----------------------------- //


roomRoute.post('/v1/new-room', requireAuth, roomImage.array('room_image', 6), async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            type,
            slot,
            capacity,
            payment_term,
            gender,
            branch_id,
            inclusions,
            upper_deck_total,
            lower_deck_total,
            upper_deck_available,
            lower_deck_available
        } = req.body;

        const nanoid = customAlphabet('0123456789', 6);
        const room_uuid = nanoid();

        await db.tx(async t => {
            const createdRoom = await t.one(
                `
                INSERT INTO rooms (
                    room_uuid,
                    title,
                    description,
                    price,
                    type,
                    slot,
                    capacity,
                    payment_term,
                    gender,
                    branch_id
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                RETURNING id, room_uuid, title
                `,
                [
                    room_uuid,
                    title,
                    description,
                    price,
                    type,
                    slot,
                    capacity,
                    payment_term,
                    gender,
                    branch_id
                ]
            );

            const normalizedInclusions = Array.isArray(inclusions)
                ? inclusions
                : [inclusions];

            await Promise.all([
                ...normalizedInclusions.map(inc =>
                    t.none(
                        `
                        INSERT INTO room_inclusions
                        (room_id, inclusion_id)
                        VALUES ($1, $2)
                        `,
                        [createdRoom.id, inc]
                    )
                ),

                ...req.files.map(async (img, index) => {

                    const imageUpload = await uploadToCloudinary(
                        img,
                        `bedspacio/room/room-${createdRoom.room_uuid}`
                    )

                    t.none(
                        `
                        INSERT INTO room_images (
                            room_id, 
                            image_url, 
                            sort_order, 
                            public_id
                        )
                        VALUES (
                            $1, $2, $3, $4
                        )
                        `,
                        [
                            createdRoom.id, 
                            imageUpload.secure_url, 
                            index + 1, 
                            imageUpload.public_id
                        ]
                    )
                })
            ]);

            if (type === 'bedspace') {
                await t.none(
                    `
                    INSERT INTO bedspace_configs (
                        room_id,
                        upper_deck_total,
                        lower_deck_total,
                        upper_deck_available,
                        lower_deck_available
                    )
                    VALUES ( $1,$2,$3,$4,$5 )
                    `,
                    [
                        createdRoom.id,
                        Number(upper_deck_total),
                        Number(lower_deck_total),
                        Number(upper_deck_available),
                        Number(lower_deck_available)
                    ]
                );
            }

            res.status(200).json({
                message: 'Room created successfully',
                data: createdRoom
            });
        });

    } catch (err) {
        console.error('Error creating new room:', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});



roomRoute.patch(
    '/v1/:id/info',
    requireAuth,
    roomImage.array('room_image', 6),
    async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                throw new Error('Id must be a number');
            }

            const room = await db.one(
                `SELECT * FROM rooms WHERE id = $1
                `,
                [id]
            );

            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: 'Room not found'
                });
            }

            const {
                inclusions,
                existing_images,

                upper_deck_total,
                lower_deck_total,
                upper_deck_available,
                lower_deck_available,

                ...roomUpdates
            } = req.body;

            // Update room info
            if (Object.keys(roomUpdates).length > 0) {
                const keys = Object.keys(roomUpdates);

                const setClause = keys
                    .map((key, index) => `${key} = $${index + 1}`)
                    .join(', ');

                const values = keys.map(
                    key => roomUpdates[key]
                );

                await db.none(
                    `
                    UPDATE rooms
                    SET ${setClause}
                    WHERE id = $${keys.length + 1}
                    `,
                    [...values, id]
                );
            }

            if (roomUpdates.type === 'apartment') {
                await db.none(
                    `
                    DELETE FROM bedspace_configs
                    WHERE room_id = $1
                    `,
                    [id]
                );
            }

            // const hasBedspaceConfig =
            //     upper_deck_total?.trim() !== '' &&
            //     lower_deck_total?.trim() !== '' &&
            //     upper_deck_available?.trim() !== '' &&
            //     lower_deck_available?.trim() !== '';

            // if (hasBedspaceConfig && roomUpdates.type !== 'apartment') {
            //     await db.none(
            //         `
            //         INSERT INTO bedspace_configs (
            //             room_id,
            //             upper_deck_total,
            //             lower_deck_total,
            //             upper_deck_available,
            //             lower_deck_available
            //         )
            //         VALUES ($1, $2, $3, $4, $5)

            //         ON CONFLICT (room_id)
            //         DO UPDATE SET
            //             upper_deck_total = EXCLUDED.upper_deck_total,
            //             lower_deck_total = EXCLUDED.lower_deck_total,
            //             upper_deck_available = EXCLUDED.upper_deck_available,
            //             lower_deck_available = EXCLUDED.lower_deck_available
            //         `,
            //         [
            //             id,
            //             Number(upper_deck_total),
            //             Number(lower_deck_total),
            //             Number(upper_deck_available),
            //             Number(lower_deck_available)
            //         ]
            //     );

            //     const computedCapacity =
            //         Number(upper_deck_total) + Number(lower_deck_total);

            //     const computedSlot =
            //         Number(upper_deck_available) + Number(lower_deck_available);

            //     await db.none(
            //         `
            //         UPDATE rooms
            //         SET
            //             capacity = $1,
            //             slot = $2
            //         WHERE id = $3
            //         `,
            //         [computedCapacity, computedSlot, id]
            //     );
            // }

            const finalRoomType = roomUpdates.type || room.type;

            const hasBedspaceFields =
                upper_deck_total !== undefined &&
                lower_deck_total !== undefined &&
                upper_deck_available !== undefined &&
                lower_deck_available !== undefined;
            
            if (finalRoomType === 'bedspace' && hasBedspaceFields) {
                const upperTotal = Number(upper_deck_total);
                const lowerTotal = Number(lower_deck_total);
                const upperAvailable = Number(upper_deck_available);
                const lowerAvailable = Number(lower_deck_available);

                if (
                    Number.isNaN(upperTotal) ||
                    Number.isNaN(lowerTotal) ||
                    Number.isNaN(upperAvailable) ||
                    Number.isNaN(lowerAvailable)
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid bedspace configuration values'
                    });
                }

                await db.none(
                    `
                    INSERT INTO bedspace_configs (
                        room_id,
                        upper_deck_total,
                        lower_deck_total,
                        upper_deck_available,
                        lower_deck_available
                    )
                    VALUES ($1, $2, $3, $4, $5)

                    ON CONFLICT (room_id)
                    DO UPDATE SET
                        upper_deck_total = EXCLUDED.upper_deck_total,
                        lower_deck_total = EXCLUDED.lower_deck_total,
                        upper_deck_available = EXCLUDED.upper_deck_available,
                        lower_deck_available = EXCLUDED.lower_deck_available
                    `,
                    [
                        id,
                        upperTotal,
                        lowerTotal,
                        upperAvailable,
                        lowerAvailable
                    ]
                );

                const computedCapacity =
                    upperTotal + lowerTotal;

                const computedSlot =
                    upperAvailable + lowerAvailable;

                await db.none(
                    `
                    UPDATE rooms
                    SET
                        capacity = $1,
                        slot = $2
                    WHERE id = $3
                    `,
                    [
                        computedCapacity,
                        computedSlot,
                        id
                    ]
                );
            }

            // Update inclusions
            if (inclusions) {
                const parsedInclusions = JSON.parse(inclusions);

                await db.none(
                    `DELETE FROM room_inclusions WHERE room_id = $1`,
                    [id]
                );

                for (const inc of parsedInclusions) {
                    await db.none(
                        `
                        INSERT INTO room_inclusions
                        (room_id, inclusion_id)
                        VALUES ($1, $2)
                        `,
                        [id, inc]
                    );
                }
            }

            // Parse existing images
            let existingImages = [];

            try {
                existingImages = existing_images
                    ? JSON.parse(existing_images)
                    : [];
            } catch {
                existingImages = [];
            }

            const currentImages = await db.any(
                `
                SELECT *
                FROM room_images
                WHERE room_id = $1
                `,
                [id]
            );

            // Delete removed images
            for (const img of currentImages) {
                if (!existingImages.includes(img.public_id)) {
                    await deleteFromCloudinary(
                        img.public_id
                    )

                    await db.none(
                        `
                            DELETE FROM room_images
                            WHERE id = $1
                        `,
                        [img.id]
                    );
                }
            }

            // Add new uploaded images
            if (req.files && req.files.length > 0) {
                const currentCount = existingImages.length;

                await Promise.all(
                    req.files.map(async (img, index) =>{
                        const imageUpload = await uploadToCloudinary(
                            img,
                            `bedspacio/room/room-${room.room_uuid}`
                        )
                        
                        await db.none(
                            `
                            INSERT INTO room_images
                            (room_id, image_url, sort_order, public_id)
                            VALUES ($1, $2, $3, $4)
                            `,
                            [
                                id,
                                imageUpload.secure_url,
                                currentCount + index + 1,
                                imageUpload.public_id
                            ]
                        )
                    })
                );
            }

            return res.status(200).json({
                success: true,
                message: 'Room updated successfully'
            });

        } catch (err) {
            console.error('Error updating room:', err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
);



roomRoute.delete('/v1/:id/info', requireAuth, async (req, res) => {
    try {

        const id = Number(req.params.id);
        const room = await db.one(
            `SELECT EXISTS(
                SELECT 1 FROM rooms WHERE id = $1
            ) AS exists`,
            [id]
        );

        if (!room.exists) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }


        const room_images = await db.manyOrNone(
            `SELECT * FROM room_images WHERE room_id = $1`,
            [id]
        );

        for (const images of room_images) {
            await deleteFromCloudinary(
                images.public_id
            )
        }
        
        await db.none(
            `DELETE FROM room_images WHERE room_id = $1`,
            [id]
        )
        
        await db.none(
            `DELETE FROM rooms WHERE id = $1`,
            [id]
        )



        return res.status(200).send({
            success: true,
            message: 'Room deleted successfully'
        })

    } catch (err) {
        console.error('Error deleting room: ', err);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
})


roomRoute.get('/v1/admin/all', async (req, res) => {
    try {

        const branch = req.query.branch;
        const type = req.query.type;
        const search = req.query.search;

        const page = Number(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const rooms = await db.manyOrNone(
            `
            SELECT
                r.id,
                r.room_uuid,
                r.title,
                r.branch_id,
                r.type,
                r.slot,
                r.price,
                br.name as branch
            FROM rooms r
            JOIN branches br ON br.id = r.branch_id
            WHERE 
                ($1::text IS NULL OR br.name = $1)
                AND ($2::text IS NULL OR r.type = $2)
                AND (
                    $3::text IS NULL OR
                    r.room_uuid ILIKE '%' || $3 || '%' OR
                    r.title ILIKE '%' || $3 || '%'
                )
            ORDER BY r.created_at DESC
            LIMIT $4 OFFSET $5;
            `,
            [branch || null, type || null, search || null, limit, offset]
        );

        const totalRooms = await db.one(
            `
            SELECT COUNT(*) FROM rooms r
            JOIN branches br ON br.id = r.branch_id
            WHERE 
                ($1::text IS NULL OR br.name = $1)
                AND ($2::text IS NULL OR r.type = $2)
                AND (
                    $3::text IS NULL OR
                    r.room_uuid ILIKE '%' || $3 || '%' OR
                    r.title ILIKE '%' || $3 || '%'
                )
            `,
            [branch || null, type || null, search || null]
        );

        const totalPage = Math.ceil(Number(totalRooms.count) / limit);

        return res.status(200).json({
            data: rooms,
            currentPage: page,
            totalPage
        });

    } catch (err) {
        console.error('Error retrieving rooms: ', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



roomRoute.get('/v1/:room_uuid/info', async (req, res) => {
    try {
        const room_uuid = req.params.room_uuid;
        console.log('room_uuid:', req.params.room_uuid);

        const room = await db.one(
            `
                SELECT
                    r.*,
                    bc.upper_deck_total,
                    bc.lower_deck_total,
                    bc.upper_deck_available,
                    bc.lower_deck_available,
                    COALESCE(inc.inclusions, '[]') AS inclusions,
                    COALESCE(img.images, '[]') AS images

                FROM rooms r

                LEFT JOIN bedspace_configs bc
                    ON bc.room_id = r.id

                LEFT JOIN (
                    SELECT
                        ri.room_id,
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'id', i.id,
                                'inclusion', i.inclusion
                            )
                        ) AS inclusions
                    FROM room_inclusions ri
                    JOIN inclusions i ON i.id = ri.inclusion_id
                    GROUP BY ri.room_id
                ) inc ON inc.room_id = r.id

                LEFT JOIN (
                    SELECT
                        room_id,
                        json_agg(
                            jsonb_build_object(
                                'id', id,
                                'image', image_url,
                                'public_id', public_id
                            )
                            ORDER BY sort_order
                        ) AS images
                    FROM room_images
                    GROUP BY room_id
                ) img ON img.room_id = r.id

                WHERE r.room_uuid = $1;
            `,
            [room_uuid]
        );

        return res.status(200).json(room);

    } catch (err) {
        console.error('Error retrieving room data:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});




roomRoute.get('/v1/preview/details', async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 16, 1), 50);
        const offset = (page - 1) * pageSize;

        const roomType = req.query.type;
        const branchId = req.query.branch ? Number(req.query.branch) : null;
        const minBudget = req.query.minimumBudget ? Number(req.query.minimumBudget) : null;
        const maxBudget = req.query.maximumBudget ? Number(req.query.maximumBudget) : null;

        const inclusions = Array.isArray(req.query.inclusion)
            ? req.query.inclusion
            : req.query.inclusion
                ? [req.query.inclusion]
                : [];

        // Dynamic query building
        let whereConditions = [];
        let params = [];
        let paramIndex = 1;

        
        // Room Type filter
        if (roomType) {
            whereConditions.push(`r.type = $${paramIndex++}`);
            params.push(roomType);
        }

        // Branch filter
        if (branchId) {
            whereConditions.push(`r.branch_id = $${paramIndex++}`);
            params.push(branchId);
        }

        // Price range filter
        if (minBudget !== null) {
            whereConditions.push(`r.price >= $${paramIndex++}`);
            params.push(minBudget);
        }
        if (maxBudget !== null) {
            whereConditions.push(`r.price <= $${paramIndex++}`);
            params.push(maxBudget);
        }

        // if (inclusions.length > 0) {
        //     whereConditions.push(`
        //         EXISTS (
        //             SELECT 1
        //             FROM room_inclusions ri_inc2
        //             JOIN inclusions i2 ON i2.id = ri_inc2.inclusion_id
        //             WHERE ri_inc2.room_id = r.id
        //             AND i2.slug = ANY($${paramIndex++})
        //         )
        //     `);

        //     params.push(inclusions);
        // }

        if (inclusions.length > 0) {
            whereConditions.push(`
                (
                    SELECT COUNT(DISTINCT i2.slug)
                    FROM room_inclusions ri_inc2
                    JOIN inclusions i2 ON i2.id = ri_inc2.inclusion_id
                    WHERE ri_inc2.room_id = r.id
                    AND i2.slug = ANY($${paramIndex})
                ) = $${paramIndex + 1}
            `);

            params.push(inclusions);
            params.push(inclusions.length);
            paramIndex += 2;
        }

        whereConditions.push(`r.slot > 0`);;
        const whereClause = whereConditions.length > 0 
            ? 'WHERE ' + whereConditions.join(' AND ') 
            : '';

        const query = `
            SELECT
                r.id, 
                r.room_uuid,
                r.title,
                r.description,
                r.price,
                r.type,
                r.slot,
                r.gender,
                r.branch_id,
                r.created_at,
                br.name AS branch_name,
                ri.image_url AS thumbnail,
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
                            'id', i.id,
                            'inclusion', i.inclusion
                        )
                    ) FILTER (WHERE i.id IS NOT NULL),
                    '[]'
                ) AS inclusions
            FROM rooms r
            JOIN branches br ON br.id = r.branch_id

            LEFT JOIN (
                SELECT DISTINCT ON (room_id)
                    room_id,
                    image_url
                FROM room_images
                ORDER BY room_id, id ASC
            ) ri ON ri.room_id = r.id

            LEFT JOIN room_inclusions ri_inc ON ri_inc.room_id = r.id
            LEFT JOIN inclusions i ON i.id = ri_inc.inclusion_id

            ${whereClause}

            GROUP BY 
                r.id, r.room_uuid, r.title, r.description, r.price, 
                r.type, r.gender, r.branch_id, r.created_at, br.name, ri.image_url

            ORDER BY r.created_at DESC
            LIMIT $${paramIndex++}
            OFFSET $${paramIndex++}
        `;

        params.push(pageSize, offset);

        const rooms = await db.manyOrNone(query, params);

        const totalRooms = await db.one(
            `
            SELECT COUNT(DISTINCT r.id)
            FROM rooms r
            LEFT JOIN room_inclusions ri_inc ON ri_inc.room_id = r.id
            LEFT JOIN inclusions i ON i.id = ri_inc.inclusion_id
            ${whereClause}
            `,
            params
        );

        return res.status(200).json({
            success: true,
            message: rooms.length > 0 ? "Rooms retrieved successfully" : "No rooms found",
            data: rooms,
            pagination: {
                page,
                pageSize,
                totalRecords: Math.ceil(Number(totalRooms.count))  ,
                totalPage: Math.ceil(Number(totalRooms.count) / 16) 
            }
        });

    } catch (err) {
        console.error('Error retrieving room data: ', err);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
});



roomRoute.get('/v1/preview/:room_uuid/details', async (req, res) => {
    try {

        const room_uuid = req.params.room_uuid;

        if (isNaN(room_uuid)) {
            throw new Error('Id must be a number')
        };

        if (!room_uuid) {
            throw new Error('Id is required')
        };

        const details = await db.oneOrNone(
            `
                SELECT
                    r.*,
                    jsonb_build_object(
                        'id', b.id,
                        'name', b.name,
                        'address', b.address,
                        'branch_image', b.branch_image,
                        'landmarks', COALESCE(lm.landmarks, '[]')
                    ) AS branch,

                    jsonb_build_object(
                        'id', u.id,
                        'fullname', u.fullname,
                        'contact_number', u.contact_number,
                        'email', u.email,
                        'profile_image', u.profile_image
                    ) AS property_manager,

                    COALESCE(inc.inclusions, '[]') AS inclusions,
                    COALESCE(img.images, '[]') AS images

                FROM rooms r

                JOIN branches b
                    ON b.id = r.branch_id

                LEFT JOIN users u
                    ON u.id = b.property_manager_id
                    AND u.is_active = true

                LEFT JOIN (
                    SELECT
                        ri.room_id,
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'id', i.id,
                                'inclusion', i.inclusion,
                                'slug', i.slug
                            )
                        ) AS inclusions
                    FROM room_inclusions ri
                    JOIN inclusions i
                        ON i.id = ri.inclusion_id
                    GROUP BY ri.room_id
                ) inc
                    ON inc.room_id = r.id

                LEFT JOIN (
                    SELECT
                        room_id,
                        json_agg(
                            jsonb_build_object(
                                'id', id,
                                'image', image_url
                            )
                            ORDER BY sort_order
                        ) AS images
                    FROM room_images
                    GROUP BY room_id
                ) img
                    ON img.room_id = r.id

                LEFT JOIN (
                    SELECT
                        bl.branch_id,
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'id', l.id,
                                'landmark', l.landmark
                            )
                        ) AS landmarks
                    FROM branch_landmarks bl
                    JOIN landmarks l
                        ON l.id = bl.landmark_id
                    GROUP BY bl.branch_id
                ) lm
                    ON lm.branch_id = b.id

                WHERE r.room_uuid = $1;
            `, [room_uuid]
        );

        if (!details) {
            return res.status(400).json({
                message: 'Room not found'
            });
        }

        return res.status(200).json(details);

    } catch (err) {
        console.error('Error retrieving room details: ', err);
    }
});



export default roomRoute;